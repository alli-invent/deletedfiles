from app.models import db, Enrollment, Course, User
import uuid
from datetime import datetime

class EnrollmentService:
    @staticmethod
    def create_enrollment(user_id, course_id, batch_id=None):
        """Create a new enrollment"""

        # Check if user is already enrolled
        existing_enrollment = Enrollment.query.filter_by(
            user_id=user_id,
            course_id=course_id
        ).first()

        if existing_enrollment:
            raise ValueError("User is already enrolled in this course")

        # Verify course exists and is published
        course = Course.query.filter_by(
            id=course_id,
            is_published=True
        ).first()

        if not course:
            raise ValueError("Course not found or not published")

        # Verify batch exists if provided
        if batch_id:
            batch = course.batches.filter_by(id=batch_id).first()
            if not batch:
                raise ValueError("Batch not found")
            if batch.available_seats <= 0:
                raise ValueError("No available seats in this batch")

        enrollment = Enrollment(
            id=str(uuid.uuid4()),
            user_id=user_id,
            course_id=course_id,
            batch_id=batch_id,
            status='pending'  # Will be confirmed after payment or approval
        )

        db.session.add(enrollment)
        db.session.commit()

        return enrollment

    @staticmethod
    def confirm_enrollment(enrollment_id):
        """Confirm an enrollment (after payment or approval)"""
        enrollment = Enrollment.query.get(enrollment_id)

        if not enrollment:
            raise ValueError("Enrollment not found")

        enrollment.status = 'confirmed'
        enrollment.confirmed_at = datetime.utcnow()

        db.session.commit()

        return enrollment

    @staticmethod
    def update_enrollment_progress(enrollment_id, progress):
        """Update enrollment progress"""
        enrollment = Enrollment.query.get(enrollment_id)

        if not enrollment:
            raise ValueError("Enrollment not found")

        enrollment.update_progress(progress)
        db.session.commit()

        return enrollment

    @staticmethod
    def get_user_enrollments(user_id, status=None):
        """Get all enrollments for a user"""
        query = Enrollment.query.filter_by(user_id=user_id)

        if status:
            query = query.filter_by(status=status)

        return query.order_by(Enrollment.enrolled_at.desc()).all()

    @staticmethod
    def get_course_enrollments(course_id, status=None):
        """Get all enrollments for a course"""
        query = Enrollment.query.filter_by(course_id=course_id)

        if status:
            query = query.filter_by(status=status)

        return query.order_by(Enrollment.enrolled_at.desc()).all()
