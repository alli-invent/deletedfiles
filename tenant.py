from app.extensions import db
from app.models.base import BaseModel
from datetime import datetime

class Tenant(BaseModel):
    __tablename__ = 'tenants'

    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    subdomain = db.Column(db.String(200), unique=True, nullable=False)
    status = db.Column(db.Enum('active', 'inactive', 'suspended'), default='active')

    # Subscription fields
    subscription_tier = db.Column(db.Enum('free', 'starter', 'professional', 'enterprise'), default='free')
    subscription_status = db.Column(db.Enum('active', 'canceled', 'past_due', 'trial'), default='active')
    subscription_expires_at = db.Column(db.DateTime)
    stripe_customer_id = db.Column(db.String(100))
    stripe_subscription_id = db.Column(db.String(100))

    # Settings and branding
    settings = db.Column(db.JSON, default=lambda: {
        'timezone': 'UTC',
        'currency': 'USD',
        'language': 'en',
        'max_students': 50,
        'max_courses': 3,
        'max_storage_mb': 500,
    })
    branding = db.Column(db.JSON, default=lambda: {
        'logo_url': None,
        'primary_color': '#3b82f6',
        'secondary_color': '#1e40af',
        'accent_color': '#60a5fa',
    })

    # Usage tracking
    student_count = db.Column(db.Integer, default=0)
    course_count = db.Column(db.Integer, default=0)
    storage_used = db.Column(db.BigInteger, default=0)  # in bytes

    # Relationships
    users = db.relationship('User', back_populates='tenant', lazy='dynamic')
    courses = db.relationship('Course', back_populates='tenant', lazy='dynamic')

    def to_dict(self):
        data = super().to_dict()
        data['features'] = self.features
        return data

    @property
    def features(self):
        """Return feature flags based on subscription tier"""
        return {
            'custom_domain': self.subscription_tier in ['professional', 'enterprise'],
            'advanced_analytics': self.subscription_tier in ['professional', 'enterprise'],
            'api_access': self.subscription_tier in ['professional', 'enterprise'],
            'white_label': self.subscription_tier in ['professional', 'enterprise'],
            'payment_integration': self.subscription_tier in ['starter', 'professional', 'enterprise'],
            'scorm_support': self.subscription_tier in ['starter', 'professional', 'enterprise'],
            'multi_branch': self.subscription_tier in ['professional', 'enterprise'],
            'sso_integration': self.subscription_tier == 'enterprise',
            'storage_limit': self.get_storage_limit(),
            'max_students': self.get_max_students(),
            'max_courses': self.get_max_courses(),
            'max_instructors': self.get_max_instructors(),
        }

    def get_storage_limit(self):
        limits = {
            'free': 500 * 1024 * 1024,  # 500MB
            'starter': 5 * 1024 * 1024 * 1024,  # 5GB
            'professional': 50 * 1024 * 1024 * 1024,  # 50GB
            'enterprise': 250 * 1024 * 1024 * 1024,  # 250GB
        }
        return limits.get(self.subscription_tier, limits['free'])

    def get_max_students(self):
        limits = {
            'free': 50,
            'starter': 500,
            'professional': 2000,
            'enterprise': None,  # unlimited
        }
        return limits.get(self.subscription_tier)

    def get_max_courses(self):
        limits = {
            'free': 3,
            'starter': 20,
            'professional': None,  # unlimited
            'enterprise': None,  # unlimited
        }
        return limits.get(self.subscription_tier)

    def get_max_instructors(self):
        limits = {
            'free': 5,
            'starter': 20,
            'professional': 100,
            'enterprise': None,  # unlimited
        }
        return limits.get(self.subscription_tier)

    def can_add_student(self):
        max_students = self.get_max_students()
        if max_students is None:
            return True
        return self.student_count < max_students

    def can_add_course(self):
        max_courses = self.get_max_courses()
        if max_courses is None:
            return True
        return self.course_count < max_courses

    def can_use_storage(self, additional_bytes):
        return (self.storage_used + additional_bytes) <= self.get_storage_limit()

    def update_usage(self, student_delta=0, course_delta=0, storage_delta=0):
        """Update usage counters"""
        self.student_count += student_delta
        self.course_count += course_delta
        self.storage_used += storage_delta
        db.session.commit()
