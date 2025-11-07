from flask import Blueprint, request, jsonify, g
from app.models import db, Enrollment, Course, User
from app.services.enrollment_service import EnrollmentService
from app.utils.decorators import tenant_required, login_required, instructor_required

enrollments_bp = Blueprint('enrollments', __name__)

@enrollments_bp.route('', methods=['GET'])
@tenant_required
@login_required
def get_enrollments():
    """Get user's enrollments or all enrollments (for instructors/admins)"""
    if current_user.role in ['instructor', 'admin']:
        # Get all enrollments for the tenant
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', 'all')

        query = Enrollment.query.join(Course).filter(
            Course.tenant_id == g.tenant_id
        )

        if status != 'all':
            query = query.filter(Enrollment.status == status)

        enrollments = query.order_by(Enrollment.enrolled_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            'enrollments': [{
                **enrollment.to_dict(),
                'course': enrollment.course.to_dict(),
                'user': enrollment.user.to_public_dict()
            } for enrollment in enrollments.items],
            'total': enrollments.total,
            'pages': enrollments.pages,
            'current_page': page
        })
    else:
        # Get current user's enrollments
        enrollments = Enrollment.query.filter_by(
            user_id=current_user.id
        ).join(Course).order_by(Enrollment.enrolled_at.desc()).all()

        return jsonify({
            'enrollments': [{
                **enrollment.to_dict(),
                'course': enrollment.course.to_dict()
            } for enrollment in enrollments]
        })

@enrollments_bp.route('', methods=['POST'])
@tenant_required
@login_required
def create_enrollment():
    """Enroll in a course"""
    data = request.get_json()

    if not data or not data.get('course_id'):
        return jsonify({'error': 'Course ID required'}), 400

    course = Course.query.filter_by(
        id=data['course_id'],
        tenant_id=g.tenant_id,
        is_published=True
    ).first_or_404()

    # Check if user is already enrolled
    existing_enrollment = Enrollment.query.filter_by(
        user_id=current_user.id,
        course_id=data['course_id']
    ).first()

    if existing_enrollment:
        return jsonify({'error': 'Already enrolled in this course'}), 400

    try:
        enrollment = EnrollmentService.create_enrollment(
            user_id=current_user.id,
            course_id=data['course_id'],
            batch_id=data.get('batch_id')
        )

        return jsonify({
            'message': 'Enrolled successfully',
            'enrollment': {
                **enrollment.to_dict(),
                'course': course.to_dict()
            }
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@enrollments_bp.route('/<enrollment_id>', methods=['GET'])
@tenant_required
@login_required
def get_enrollment(enrollment_id):
    """Get a specific enrollment"""
    enrollment = Enrollment.query.filter_by(id=enrollment_id).first_or_404()

    # Check access
    if (current_user.role == 'student' and enrollment.user_id != current_user.id) and \
       (current_user.role == 'instructor' and enrollment.course.instructor_id != current_user.id):
        return jsonify({'error': 'Access denied'}), 403

    return jsonify({
        'enrollment': {
            **enrollment.to_dict(),
            'course': enrollment.course.to_dict(),
            'user': enrollment.user.to_public_dict() if current_user.role != 'student' else None
        }
    })

@enrollments_bp.route('/<enrollment_id>/progress', methods=['PUT'])
@tenant_required
@login_required
def update_progress(enrollment_id):
    """Update enrollment progress"""
    enrollment = Enrollment.query.filter_by(id=enrollment_id).first_or_404()

    # Check access
    if enrollment.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()

    if not data or data.get('progress') is None:
        return jsonify({'error': 'Progress value required'}), 400

    try:
        progress = float(data['progress'])
        enrollment.update_progress(progress)
        db.session.commit()

        return jsonify({
            'message': 'Progress updated successfully',
            'enrollment': enrollment.to_dict()
        })

    except ValueError as e:
        return jsonify({'error': 'Invalid progress value'}), 400

@enrollments_bp.route('/<enrollment_id>/status', methods=['PUT'])
@tenant_required
@instructor_required
def update_enrollment_status(enrollment_id):
    """Update enrollment status (instructor/admin only)"""
    enrollment = Enrollment.query.filter_by(id=enrollment_id).first_or_404()

    # Check if instructor owns the course
    if current_user.role == 'instructor' and enrollment.course.instructor_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()

    if not data or not data.get('status'):
        return jsonify({'error': 'Status required'}), 400

    valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed', 'dropped']
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    enrollment.status = data['status']

    if data['status'] == 'confirmed':
        enrollment.confirmed_at = db.func.now()
    elif data['status'] == 'completed':
        enrollment.completed_at = db.func.now()

    db.session.commit()

    return jsonify({
        'message': 'Enrollment status updated successfully',
        'enrollment': enrollment.to_dict()
    })

@enrollments_bp.route('/<enrollment_id>/grade', methods=['PUT'])
@tenant_required
@instructor_required
def update_grade(enrollment_id):
    """Update enrollment grade (instructor/admin only)"""
    enrollment = Enrollment.query.filter_by(id=enrollment_id).first_or_404()

    # Check if instructor owns the course
    if current_user.role == 'instructor' and enrollment.course.instructor_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()

    if not data or not data.get('final_grade'):
        return jsonify({'error': 'Grade required'}), 400

    enrollment.final_grade = data['final_grade']
    enrollment.grade_points = data.get('grade_points')

    db.session.commit()

    return jsonify({
        'message': 'Grade updated successfully',
        'enrollment': enrollment.to_dict()
    })
