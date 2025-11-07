from app.models import db, Course, Batch, Material, Module
import uuid
from datetime import datetime

class CourseService:
    @staticmethod
    def create_course(tenant_id, instructor_id, title, code, delivery, **kwargs):
        """Create a new course"""

        # Check if course code already exists in tenant
        existing_course = Course.query.filter_by(
            tenant_id=tenant_id,
            code=code
        ).first()

        if existing_course:
            raise ValueError("Course code already exists")

        course = Course(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            instructor_id=instructor_id,
            title=title,
            code=code,
            delivery=delivery,
            short_description=kwargs.get('short_description'),
            duration_weeks=kwargs.get('duration_weeks'),
            price_decimal=kwargs.get('price_decimal', 0),
            syllabus=kwargs.get('syllabus', {})
        )

        db.session.add(course)
        db.session.commit()

        return course

    @staticmethod
    def create_batch(course_id, name, start_date, end_date, **kwargs):
        """Create a new batch for a course"""

        batch = Batch(
            id=str(uuid.uuid4()),
            course_id=course_id,
            name=name,
            start_date=start_date,
            end_date=end_date,
            max_capacity=kwargs.get('max_capacity', 30),
            location=kwargs.get('location'),
            schedule=kwargs.get('schedule', {})
        )

        db.session.add(batch)
        db.session.commit()

        return batch

    @staticmethod
    def add_course_material(course_id, title, material_type, content_url, **kwargs):
        """Add material to a course"""

        material = Material(
            id=str(uuid.uuid4()),
            course_id=course_id,
            module_id=kwargs.get('module_id'),
            title=title,
            type=material_type,
            content_url=content_url,
            storage_path=kwargs.get('storage_path'),
            duration_seconds=kwargs.get('duration_seconds'),
            size_bytes=kwargs.get('size_bytes', 0),
            order_index=kwargs.get('order_index', 0),
            access_rules=kwargs.get('access_rules', {})
        )

        db.session.add(material)
        db.session.commit()

        return material

    @staticmethod
    def create_module(course_id, title, **kwargs):
        """Create a new module for a course"""

        # Get the highest order index
        max_order = db.session.query(db.func.max(Module.order_index)).filter_by(
            course_id=course_id
        ).scalar() or 0

        module = Module(
            id=str(uuid.uuid4()),
            course_id=course_id,
            title=title,
            description=kwargs.get('description'),
            order_index=max_order + 1
        )

        db.session.add(module)
        db.session.commit()

        return module
