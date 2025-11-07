from app.models import db, Assessment, Question, Exam, Response
import uuid
from datetime import datetime

class AssessmentService:
    @staticmethod
    def create_assessment(course_id, title, assessment_type, **kwargs):
        """Create a new assessment"""

        assessment = Assessment(
            id=str(uuid.uuid4()),
            course_id=course_id,
            module_id=kwargs.get('module_id'),
            title=title,
            type=assessment_type,
            description=kwargs.get('description'),
            settings=kwargs.get('settings', {}),
            total_marks=kwargs.get('total_marks', 100)
        )

        db.session.add(assessment)
        db.session.commit()

        return assessment

    @staticmethod
    def add_question(assessment_id, question_type, content, marks, **kwargs):
        """Add a question to an assessment"""

        # Get the highest order index
        max_order = db.session.query(db.func.max(Question.order_index)).filter_by(
            assessment_id=assessment_id
        ).scalar() or 0

        question = Question(
            id=str(uuid.uuid4()),
            assessment_id=assessment_id,
            type=question_type,
            content=content,
            marks=marks,
            explanation=kwargs.get('explanation'),
            order_index=max_order + 1,
            question_metadata=kwargs.get('question_metadata', {})
        )

        db.session.add(question)
        db.session.commit()

        return question

    @staticmethod
    def start_exam(assessment_id, user_id):
        """Start an exam for a user"""

        # Check if there's already an active exam
        active_exam = Exam.query.filter_by(
            assessment_id=assessment_id,
            user_id=user_id,
            status='in_progress'
        ).first()

        if active_exam:
            return active_exam

        assessment = Assessment.query.get(assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")

        exam = Exam(
            id=str(uuid.uuid4()),
            assessment_id=assessment_id,
            user_id=user_id,
            started_at=datetime.utcnow(),
            total_marks=assessment.total_marks
        )

        db.session.add(exam)
        db.session.commit()

        return exam

    @staticmethod
    def submit_exam(exam_id, responses):
        """Submit exam responses and calculate score"""

        exam = Exam.query.get(exam_id)
        if not exam:
            raise ValueError("Exam not found")

        total_marks_obtained = 0

        # Save each response
        for response_data in responses:
            question_id = response_data.get('question_id')
            answer = response_data.get('answer')

            if not question_id:
                continue

            question = Question.query.get(question_id)
            if not question:
                continue

            # Calculate marks (simplified - in real app, you'd have proper grading logic)
            marks_awarded = 0
            if question.type == 'mcq' and answer == question.content.get('correct_answer'):
                marks_awarded = question.marks
            elif question.type == 'tf' and answer == question.content.get('correct_answer'):
                marks_awarded = question.marks
            else:
                # For subjective questions, full marks for now (would be graded by instructor)
                marks_awarded = question.marks

            total_marks_obtained += marks_awarded

            response = Response(
                id=str(uuid.uuid4()),
                question_id=question_id,
                user_id=exam.user_id,
                exam_id=exam_id,
                answer=answer,
                marks_awarded=marks_awarded
            )

            db.session.add(response)

        # Update exam results
        exam.marks_obtained = total_marks_obtained
        exam.percentage = (total_marks_obtained / exam.total_marks) * 100 if exam.total_marks else 0
        exam.status = 'submitted'
        exam.submitted_at = datetime.utcnow()

        db.session.commit()

        return {
            'exam_id': exam.id,
            'total_marks': exam.total_marks,
            'marks_obtained': exam.marks_obtained,
            'percentage': float(exam.percentage) if exam.percentage else 0,
            'status': exam.status
        }

    @staticmethod
    def grade_subjective_questions(exam_id, graded_responses):
        """Grade subjective questions (to be called by instructor)"""

        exam = Exam.query.get(exam_id)
        if not exam:
            raise ValueError("Exam not found")

        total_marks_obtained = 0

        for graded_data in graded_responses:
            response_id = graded_data.get('response_id')
            marks = graded_data.get('marks')
            feedback = graded_data.get('feedback')

            response = Response.query.get(response_id)
            if response and response.exam_id == exam_id:
                response.marks_awarded = marks
                response.feedback = feedback
                total_marks_obtained += marks

        # Update exam results
        exam.marks_obtained = total_marks_obtained
        exam.percentage = (total_marks_obtained / exam.total_marks) * 100 if exam.total_marks else 0
        exam.status = 'graded'

        db.session.commit()

        return exam
