from flask import Blueprint, request, jsonify, g
from app.models import db, Course, Batch, Material, Module, Enrollment
from app.services.course_service import CourseService
from app.utils.decorators import tenant_required, login_required, instructor_required, admin_required
from flask_login import current_user

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('', methods=['GET'])
@tenant_required
def get_courses():
    """Get all courses for the tenant"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status', 'all')

    query = Course.query.filter_by(tenant_id=g.tenant_id)

    if status == 'published':
        query = query.filter_by(is_published=True)
    elif status == 'draft':
        query = query.filter_by(is_published=False)

    courses = query.order_by(Course.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'courses': [course.to_dict() for course in courses.items],
        'total': courses.total,
        'pages': courses.pages,
        'current_page': page
    })

@courses_bp.route('', methods=['POST'])
@tenant_required
@instructor_required
def create_course():
    """Create a new course"""
    if not g.tenant.can_add_course():
        return jsonify({
            'error': 'Course limit reached for your plan',
            'upgrade_required': True
        }), 402

    data = request.get_json()

    required_fields = ['title', 'code', 'delivery']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        course = CourseService.create_course(
            tenant_id=g.tenant_id,
            instructor_id=current_user.id,
            title=data['title'],
            code=data['code'],
            delivery=data['delivery'],
            short_description=data.get('short_description'),
            duration_weeks=data.get('duration_weeks'),
            price_decimal=data.get('price_decimal', 0),
            syllabus=data.get('syllabus', {})
        )

        # Update tenant usage
        g.tenant.update_usage(course_delta=1)

        return jsonify({
            'message': 'Course created successfully',
            'course': course.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@courses_bp.route('/<course_id>', methods=['GET'])
@tenant_required
def get_course(course_id):
    """Get a specific course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id
    ).first_or_404()

    return jsonify({
        'course': course.to_dict(),
        'instructor': course.instructor.to_public_dict() if course.instructor else None,
        'batches': [batch.to_dict() for batch in course.batches],
        'enrollment_count': course.enrollments.filter_by(status='confirmed').count()
    })

@courses_bp.route('/<course_id>', methods=['PUT'])
@tenant_required
@instructor_required
def update_course(course_id):
    """Update a course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id,
        instructor_id=current_user.id
    ).first_or_404()

    data = request.get_json()

    updatable_fields = [
        'title', 'short_description', 'full_description', 'syllabus',
        'duration_weeks', 'price_decimal', 'level', 'metadata', 'is_published'
    ]

    for field in updatable_fields:
        if field in data:
            setattr(course, field, data[field])

    db.session.commit()

    return jsonify({
        'message': 'Course updated successfully',
        'course': course.to_dict()
    })

@courses_bp.route('/<course_id>', methods=['DELETE'])
@tenant_required
@instructor_required
def delete_course(course_id):
    """Delete a course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id,
        instructor_id=current_user.id
    ).first_or_404()

    # Check if there are active enrollments
    active_enrollments = course.enrollments.filter_by(status='confirmed').count()
    if active_enrollments > 0:
        return jsonify({
            'error': 'Cannot delete course with active enrollments'
        }), 400

    db.session.delete(course)
    g.tenant.update_usage(course_delta=-1)

    return jsonify({'message': 'Course deleted successfully'})

@courses_bp.route('/<course_id>/publish', methods=['POST'])
@tenant_required
@instructor_required
def publish_course(course_id):
    """Publish/unpublish a course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id,
        instructor_id=current_user.id
    ).first_or_404()

    course.is_published = not course.is_published
    db.session.commit()

    action = 'published' if course.is_published else 'unpublished'

    return jsonify({
        'message': f'Course {action} successfully',
        'course': course.to_dict()
    })

@courses_bp.route('/<course_id>/materials', methods=['GET'])
@tenant_required
@login_required
def get_course_materials(course_id):
    """Get all materials for a course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id
    ).first_or_404()

    # Check if user has access to the course
    if current_user.role == 'student':
        enrollment = Enrollment.query.filter_by(
            user_id=current_user.id,
            course_id=course_id,
            status='confirmed'
        ).first()

        if not enrollment:
            return jsonify({'error': 'Access denied'}), 403

    materials = Material.query.filter_by(
        course_id=course_id,
        is_published=True
    ).order_by(Material.order_index).all()

    return jsonify({
        'materials': [material.to_dict() for material in materials]
    })

@courses_bp.route('/<course_id>/enrollments', methods=['GET'])
@tenant_required
@instructor_required
def get_course_enrollments(course_id):
    """Get enrollments for a course"""
    course = Course.query.filter_by(
        id=course_id,
        tenant_id=g.tenant_id,
        instructor_id=current_user.id
    ).first_or_404()

    enrollments = course.enrollments.join(User).order_by(
        Enrollment.enrolled_at.desc()
    ).all()

    return jsonify({
        'enrollments': [{
            **enrollment.to_dict(),
            'user': enrollment.user.to_public_dict()
        } for enrollment in enrollments]
    })
