from app.extensions import db
from app.models.base import BaseModel
from datetime import datetime

class Enrollment(BaseModel):
    __tablename__ = 'enrollments'

    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)
    batch_id = db.Column(db.String(36), db.ForeignKey('batches.id'))

    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', 'completed', 'dropped'), default='pending')
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)

    progress_decimal = db.Column(db.Numeric(5, 2), default=0)  # 0-100 percentage
    final_grade = db.Column(db.String(10))
    grade_points = db.Column(db.Numeric(5, 2))

    # CHANGED: Renamed from 'metadata' to 'enrollment_metadata'
    enrollment_metadata = db.Column(db.JSON, default=lambda: {
        'completion_requirements': {},
        'last_accessed_at': None,
        'time_spent_minutes': 0,
        'notes': None,
    })

    # Relationships
    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')
    batch = db.relationship('Batch', back_populates='enrollments')
    certificate = db.relationship('Certificate', back_populates='enrollment', uselist=False)

    def update_progress(self, new_progress):
        """Update progress and check for completion"""
        self.progress_decimal = min(100, max(0, new_progress))

        if self.progress_decimal >= 100 and self.status != 'completed':
            self.status = 'completed'
            self.completed_at = datetime.utcnow()

    def to_dict(self):
        data = super().to_dict()
        # Convert Decimal to float for JSON serialization
        if data.get('progress_decimal'):
            data['progress_decimal'] = float(data['progress_decimal'])
        if data.get('grade_points'):
            data['grade_points'] = float(data['grade_points'])
        return data
