from flask import Blueprint, request, jsonify, g
from app.models import db, Assessment, Question, Response, Exam, Course
from app.services.assessment_service import AssessmentService
from app.utils.decorators import tenant_required, login_required, instructor_required

assessments_bp = Blueprint('assessments', __name__)

@assessments_bp.route('', methods=['POST'])
@tenant_required
@instructor_required
def create_assessment():
    """Create a new assessment"""
    data = request.get_json()

    required_fields = ['course_id', 'title', 'type']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Verify course belongs to tenant and instructor
    course = Course.query.filter_by(
        id=data['course_id'],
        tenant_id=g.tenant_id,
        instructor_id=current_user.id
    ).first_or_404()

    try:
        assessment = AssessmentService.create_assessment(
            course_id=data['course_id'],
            module_id=data.get('module_id'),
            title=data['title'],
            type=data['type'],
            description=data.get('description'),
            settings=data.get('settings', {}),
            total_marks=data.get('total_marks', 100)
        )

        return jsonify({
            'message': 'Assessment created successfully',
            'assessment': assessment.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@assessments_bp.route('/<assessment_id>', methods=['GET'])
@tenant_required
@login_required
def get_assessment(assessment_id):
    """Get assessment details"""
    assessment = Assessment.query.filter_by(id=assessment_id).first_or_404()

    # Check access
    if current_user.role == 'student':
        enrollment = Enrollment.query.filter_by(
            user_id=current_user.id,
            course_id=assessment.course_id,
            status='confirmed'
        ).first()

        if not enrollment:
            return jsonify({'error': 'Access denied'}), 403

    return jsonify({
        'assessment': assessment.to_dict(),
        'questions': [question.to_dict() for question in assessment.questions] if current_user.role != 'student' else None
    })

@assessments_bp.route('/<assessment_id>/questions', methods=['POST'])
@tenant_required
@instructor_required
def add_question(assessment_id):
    """Add a question to assessment"""
    assessment = Assessment.query.filter_by(id=assessment_id).first_or_404()

    # Verify instructor owns the course
    if assessment.course.instructor_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()

    required_fields = ['type', 'content', 'marks']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        question = AssessmentService.add_question(
            assessment_id=assessment_id,
            type=data['type'],
            content=data['content'],
            marks=data['marks'],
            explanation=data.get('explanation'),
            order_index=data.get('order_index', 0)
        )

        return jsonify({
            'message': 'Question added successfully',
            'question': question.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@assessments_bp.route('/<assessment_id>/start', methods=['POST'])
@tenant_required
@login_required
def start_assessment(assessment_id):
    """Start an assessment (for students)"""
    assessment = Assessment.query.filter_by(id=assessment_id).first_or_404()

    # Check if student is enrolled
    enrollment = Enrollment.query.filter_by(
        user_id=current_user.id,
        course_id=assessment.course_id,
        status='confirmed'
    ).first_or_404()

    try:
        exam = AssessmentService.start_exam(
            assessment_id=assessment_id,
            user_id=current_user.id
        )

        return jsonify({
            'message': 'Assessment started',
            'exam': exam.to_dict(),
            'questions': [{
                'id': q.id,
                'type': q.type,
                'content': q.content,
                'marks': q.marks,
                'order_index': q.order_index
            } for q in assessment.questions.order_by(Question.order_index)]
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@assessments_bp.route('/exams/<exam_id>/submit', methods=['POST'])
@tenant_required
@login_required
def submit_exam(exam_id):
    """Submit exam responses"""
    exam = Exam.query.filter_by(id=exam_id).first_or_404()

    # Check ownership
    if exam.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()

    if not data or not data.get('responses'):
        return jsonify({'error': 'Responses required'}), 400

    try:
        result = AssessmentService.submit_exam(
            exam_id=exam_id,
            responses=data['responses']  # [{question_id, answer}]
        )

        return jsonify({
            'message': 'Exam submitted successfully',
            'result': result
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@assessments_bp.route('/exams/<exam_id>', methods=['GET'])
@tenant_required
@login_required
def get_exam_result(exam_id):
    """Get exam result"""
    exam = Exam.query.filter_by(id=exam_id).first_or_404()

    # Check access
    if exam.user_id != current_user.id and current_user.role == 'student':
        return jsonify({'error': 'Access denied'}), 403

    responses = exam.responses.join(Question).order_by(Question.order_index).all()

    return jsonify({
        'exam': exam.to_dict(),
        'responses': [{
            'id': r.id,
            'question': r.question.to_dict(),
            'answer': r.answer,
            'marks_awarded': r.marks_awarded,
            'feedback': r.feedback
        } for r in responses]
    })
