import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

def setup_database():
    """Initialize the database with all tables"""
    print("Setting up database...")

    try:
        from app import create_app
        from app.config import config
        from app.extensions import db

        # Use development config
        app = create_app(config['development'])

        with app.app_context():
            try:
                # Create all tables
                db.create_all()
                print("✅ Database tables created successfully!")

                # Test the connection
                from app.models.tenant import Tenant
                tenant_count = Tenant.query.count()
                print(f"✅ Database connection test passed. Tenants in DB: {tenant_count}")

                return True

            except Exception as e:
                print(f"❌ Database setup failed: {e}")
                import traceback
                traceback.print_exc()
                return False

    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("This might be due to missing service files. Let me create them...")
        create_missing_services()
        return setup_database()  # Try again after creating missing files

def create_missing_services():
    """Create any missing service files"""
    services_dir = os.path.join(os.path.dirname(__file__), 'app', 'services')
    os.makedirs(services_dir, exist_ok=True)

    # List of required service files
    service_files = {
        'enrollment_service.py': """
from app.models import db, Enrollment, Course, User
import uuid
from datetime import datetime

class EnrollmentService:
    @staticmethod
    def create_enrollment(user_id, course_id, batch_id=None):
        existing_enrollment = Enrollment.query.filter_by(
            user_id=user_id, course_id=course_id
        ).first()
        
        if existing_enrollment:
            raise ValueError("User is already enrolled in this course")
        
        course = Course.query.filter_by(id=course_id, is_published=True).first()
        if not course:
            raise ValueError("Course not found or not published")
        
        enrollment = Enrollment(
            id=str(uuid.uuid4()),
            user_id=user_id,
            course_id=course_id,
            batch_id=batch_id,
            status='pending'
        )
        
        db.session.add(enrollment)
        db.session.commit()
        return enrollment

    @staticmethod
    def confirm_enrollment(enrollment_id):
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            raise ValueError("Enrollment not found")
        
        enrollment.status = 'confirmed'
        enrollment.confirmed_at = datetime.utcnow()
        db.session.commit()
        return enrollment
""",
        'assessment_service.py': """
from app.models import db, Assessment, Question, Exam, Response
import uuid
from datetime import datetime

class AssessmentService:
    @staticmethod
    def create_assessment(course_id, title, assessment_type, **kwargs):
        assessment = Assessment(
            id=str(uuid.uuid4()),
            course_id=course_id,
            title=title,
            type=assessment_type,
            settings=kwargs.get('settings', {}),
            total_marks=kwargs.get('total_marks', 100)
        )
        db.session.add(assessment)
        db.session.commit()
        return assessment

    @staticmethod
    def start_exam(assessment_id, user_id):
        exam = Exam(
            id=str(uuid.uuid4()),
            assessment_id=assessment_id,
            user_id=user_id,
            started_at=datetime.utcnow()
        )
        db.session.add(exam)
        db.session.commit()
        return exam
""",
        'payment_service.py': """
from app.models import db, Payment, Invoice
import uuid
from datetime import datetime

class PaymentService:
    @staticmethod
    def create_invoice(tenant_id, user_id, due_date, line_items, **kwargs):
        total_amount = sum(item.get('amount', 0) for item in line_items)
        invoice_number = f"INV-{int(datetime.utcnow().timestamp())}"
        
        invoice = Invoice(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            user_id=user_id,
            invoice_number=invoice_number,
            due_date=due_date,
            total_amount=total_amount,
            line_items=line_items
        )
        db.session.add(invoice)
        db.session.commit()
        return invoice

    @staticmethod
    def create_payment(tenant_id, user_id, invoice_id, amount, payment_method, **kwargs):
        payment = Payment(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            user_id=user_id,
            invoice_id=invoice_id,
            amount=amount,
            payment_method=payment_method
        )
        db.session.add(payment)
        db.session.commit()
        return payment
"""
    }

    for filename, content in service_files.items():
        filepath = os.path.join(services_dir, filename)
        if not os.path.exists(filepath):
            print(f"📝 Creating {filename}...")
            with open(filepath, 'w') as f:
                f.write(content)

if __name__ == '__main__':
    success = setup_database()
    if success:
        print("\n🎉 Database setup completed successfully!")
        print("You can now run the application with: python run.py")
    else:
        print("\n💥 Database setup failed!")
        sys.exit(1)
