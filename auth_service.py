from app.models import db, User
import uuid
import jwt
from datetime import datetime, timedelta
from app.config import Config

class AuthService:
    @staticmethod
    def register_user(tenant_id, email, password, full_name, role, profile=None):
        """Register a new user"""

        # Check if email already exists in tenant
        existing_user = User.query.filter_by(
            tenant_id=tenant_id,
            email=email
        ).first()

        if existing_user:
            raise ValueError("Email already registered")

        # Validate role
        valid_roles = ['student', 'instructor', 'admin', 'finance']
        if role not in valid_roles:
            raise ValueError("Invalid role")

        user = User(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            email=email,
            full_name=full_name,
            role=role,
            profile=profile or {}
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def authenticate(tenant_id, email, password):
        """Authenticate user"""
        user = User.query.filter_by(
            tenant_id=tenant_id,
            email=email,
            status='active'
        ).first()

        if user and user.check_password(password):
            return user
        return None

    @staticmethod
    def initiate_password_reset(tenant_id, email):
        """Initiate password reset process"""
        user = User.query.filter_by(
            tenant_id=tenant_id,
            email=email,
            status='active'
        ).first()

        if not user:
            raise ValueError("User not found")

        # Generate reset token
        reset_token = jwt.encode({
            'user_id': user.id,
            'tenant_id': tenant_id,
            'exp': datetime.utcnow() + timedelta(hours=1),
            'purpose': 'password_reset'
        }, Config.SECRET_KEY, algorithm='HS256')

        # In a real application, you would send an email here
        # For now, we'll just return the token (in dev mode)
        print(f"Password reset token for {email}: {reset_token}")

        return reset_token

    @staticmethod
    def reset_password(tenant_id, token, new_password):
        """Reset password using token"""
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])

            if payload.get('purpose') != 'password_reset':
                raise ValueError("Invalid token purpose")

            user = User.query.filter_by(
                id=payload['user_id'],
                tenant_id=tenant_id,
                status='active'
            ).first()

            if not user:
                raise ValueError("User not found")

            user.set_password(new_password)
            db.session.commit()

            return user

        except jwt.ExpiredSignatureError:
            raise ValueError("Reset token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid reset token")
