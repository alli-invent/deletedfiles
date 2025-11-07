from app.extensions import db
from app.models.base import BaseModel
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from app.config import Config

class User(UserMixin, BaseModel):
    __tablename__ = 'users'

    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.Enum('student', 'instructor', 'admin', 'finance', 'superadmin'), nullable=False)

    profile = db.Column(db.JSON, default=lambda: {
        'phone': None,
        'address': None,
        'photo_url': None,
        'bio': None,
        'date_of_birth': None,
    })

    status = db.Column(db.Enum('active', 'inactive', 'pending'), default='pending')
    last_login_at = db.Column(db.DateTime)
    email_verified = db.Column(db.Boolean, default=False)

    # Composite unique constraint for email within tenant
    __table_args__ = (db.UniqueConstraint('tenant_id', 'email', name='unique_email_per_tenant'),)

    # Relationships
    tenant = db.relationship('Tenant', back_populates='users')
    enrollments = db.relationship('Enrollment', back_populates='user', lazy='dynamic')
    created_courses = db.relationship('Course', back_populates='instructor', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_auth_token(self, expires_in=86400):
        """Generate JWT token for authentication"""
        return jwt.encode({
            'user_id': self.id,
            'tenant_id': self.tenant_id,
            'exp': datetime.utcnow() + timedelta(seconds=expires_in)
        }, Config.SECRET_KEY, algorithm='HS256')

    @staticmethod
    def verify_auth_token(token):
        """Verify JWT token and return user"""
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            return User.query.get(data['user_id'])
        except:
            return None

    def to_dict(self):
        data = super().to_dict()
        # Remove sensitive information
        data.pop('password_hash', None)
        return data

    def to_public_dict(self):
        """Return public user information (for course pages, etc.)"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'profile': self.profile,
            'role': self.role,
        }
