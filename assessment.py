from app.extensions import db
from app.models.base import BaseModel
from datetime import datetime

class Assessment(BaseModel):
    __tablename__ = 'assessments'

    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)
    module_id = db.Column(db.String(36), db.ForeignKey('modules.id'))

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum('quiz', 'assignment', 'exam', 'project'), nullable=False)

    settings = db.Column(db.JSON, default=lambda: {
        'timed': False,
        'duration_minutes': 60,
        'passing_score': 70,
        'attempts_allowed': 1,
        'shuffle_questions': False,
        'show_results': True,
        'allow_review': True,
        'due_date': None,
        'release_date': None,
    })

    total_marks = db.Column(db.Integer, default=100)
    is_published = db.Column(db.Boolean, default=False)

    # Relationships
    course = db.relationship('Course', back_populates='assessments')
    module = db.relationship('Module', back_populates='assessments')
    questions = db.relationship('Question', back_populates='assessment', lazy='dynamic')
    exams = db.relationship('Exam', back_populates='assessment', lazy='dynamic')

class Question(BaseModel):
    __tablename__ = 'questions'

    assessment_id = db.Column(db.String(36), db.ForeignKey('assessments.id'), nullable=False)

    type = db.Column(db.Enum('mcq', 'tf', 'short', 'essay', 'code'), nullable=False)
    content = db.Column(db.JSON, nullable=False)  # { prompt: '', options: [], correct_answer: '' }
    marks = db.Column(db.Integer, default=1)
    order_index = db.Column(db.Integer, default=0)

    explanation = db.Column(db.Text)  # For showing after submission

    # CHANGED: Renamed from 'metadata' to 'question_metadata'
    question_metadata = db.Column(db.JSON, default=lambda: {
        'difficulty': 'medium',
        'tags': [],
        'hints': []
    })

    # Relationships
    assessment = db.relationship('Assessment', back_populates='questions')
    responses = db.relationship('Response', back_populates='question', lazy='dynamic')

class Response(BaseModel):
    __tablename__ = 'responses'

    question_id = db.Column(db.String(36), db.ForeignKey('questions.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    exam_id = db.Column(db.String(36), db.ForeignKey('exams.id'))

    answer = db.Column(db.JSON)  # Store various answer types
    marks_awarded = db.Column(db.Integer)
    feedback = db.Column(db.Text)

    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    time_spent_seconds = db.Column(db.Integer, default=0)

    # Relationships
    question = db.relationship('Question', back_populates='responses')
    user = db.relationship('User')
    exam = db.relationship('Exam', back_populates='responses')

class Exam(BaseModel):
    __tablename__ = 'exams'

    assessment_id = db.Column(db.String(36), db.ForeignKey('assessments.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime)
    time_spent_seconds = db.Column(db.Integer, default=0)

    total_marks = db.Column(db.Integer)
    marks_obtained = db.Column(db.Integer)
    percentage = db.Column(db.Numeric(5, 2))

    status = db.Column(db.Enum('in_progress', 'submitted', 'graded', 'expired'), default='in_progress')

    proctoring_data = db.Column(db.JSON, default=lambda: {
        'tab_switches': 0,
        'fullscreen_exits': 0,
        'face_detection_logs': []
    })

    # Relationships
    assessment = db.relationship('Assessment', back_populates='exams')
    user = db.relationship('User')
    responses = db.relationship('Response', back_populates='exam', lazy='dynamic')
