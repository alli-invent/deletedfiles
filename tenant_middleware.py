from flask import request, g, abort
import re
from app.models.tenant import Tenant

class TenantMiddleware:
    def __init__(self, app):
        self.app = app
        self.app.before_request(self.identify_tenant)

    def identify_tenant(self):
        # Skip tenant identification for tenant creation endpoints
        if request.path.startswith('/api/tenants/create'):
            return

        # Skip for health check and public endpoints
        if request.path in ['/health', '/api/auth/register']:
            return

        host = request.host.lower()

        # Extract subdomain
        subdomain = self.extract_subdomain(host)

        if not subdomain:
            abort(400, description="Tenant subdomain required")

        # Find tenant by subdomain
        tenant = Tenant.query.filter_by(subdomain=f"{subdomain}.xyz.com").first()

        if not tenant:
            abort(404, description="Tenant not found")

        if tenant.status != 'active':
            abort(403, description="Tenant account is suspended")

        # Store tenant in request context
        g.tenant = tenant
        g.tenant_id = tenant.id

    def extract_subdomain(self, host):
        # Remove port if present
        host = host.split(':')[0]

        # Match subdomain.xyz.com pattern
        pattern = r'^(?:([a-zA-Z0-9-]+)\.)?xyz\.com$'
        match = re.match(pattern, host)

        if match:
            subdomain = match.group(1)
            if subdomain and subdomain not in ['www', 'app', 'api']:
                return subdomain

        return None
