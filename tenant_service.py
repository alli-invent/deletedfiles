from app.models import db, Tenant, User, Course
import uuid
from datetime import datetime

class TenantService:
    @staticmethod
    def create_tenant(tenant_data, admin_user_data):
        """Create a new tenant with initial admin user"""

        # Check if slug is available
        if Tenant.query.filter_by(slug=tenant_data['slug']).first():
            raise ValueError("Tenant slug already exists")

        # Validate slug format
        if not TenantService.is_valid_slug(tenant_data['slug']):
            raise ValueError("Slug can only contain letters, numbers, and hyphens")

        # Create tenant
        tenant = Tenant(
            id=str(uuid.uuid4()),
            name=tenant_data['name'],
            slug=tenant_data['slug'],
            subdomain=f"{tenant_data['slug']}.xyz.com",
            settings=tenant_data.get('settings', {}),
            branding=tenant_data.get('branding', {})
        )

        db.session.add(tenant)
        db.session.flush()  # Get tenant ID without committing

        # Create admin user
        admin_user = User(
            id=str(uuid.uuid4()),
            tenant_id=tenant.id,
            email=admin_user_data['email'],
            full_name=admin_user_data['full_name'],
            role='admin'
        )
        admin_user.set_password(admin_user_data['password'])
        db.session.add(admin_user)

        db.session.commit()
        return tenant

    @staticmethod
    def is_valid_slug(slug):
        """Validate slug format"""
        import re
        return bool(re.match(r'^[a-z0-9-]+$', slug))

    @staticmethod
    def suggest_slugs(base_slug):
        """Generate alternative slug suggestions"""
        suggestions = []
        counter = 1

        while len(suggestions) < 5:
            suggestion = f"{base_slug}-{counter}"
            if not Tenant.query.filter_by(slug=suggestion).first():
                suggestions.append(suggestion)
            counter += 1

        return suggestions

    @staticmethod
    def get_tenant_by_slug(slug):
        return Tenant.query.filter_by(slug=slug).first()

    @staticmethod
    def get_tenant_by_subdomain(subdomain):
        return Tenant.query.filter_by(subdomain=subdomain).first()

    @staticmethod
    def update_subscription(tenant_id, plan, status='active'):
        """Update tenant subscription"""
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            raise ValueError("Tenant not found")

        tenant.subscription_tier = plan
        tenant.subscription_status = status
        tenant.subscription_expires_at = datetime.utcnow().replace(year=datetime.utcnow().year + 1)

        db.session.commit()
        return tenant
