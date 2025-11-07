from flask import Blueprint, request, jsonify, g
from app.models import db, Tenant, User, Course
from app.services.tenant_service import TenantService
from app.utils.decorators import tenant_required, admin_required

tenants_bp = Blueprint('tenants', __name__)

@tenants_bp.route('/create', methods=['POST'])
def create_tenant():
    """Create a new tenant (institution)"""
    data = request.get_json()

    required_fields = ['name', 'slug', 'admin_email', 'admin_name', 'admin_password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        tenant_data = {
            'name': data['name'],
            'slug': data['slug'],
            'settings': data.get('settings', {}),
            'branding': data.get('branding', {})
        }

        admin_user_data = {
            'email': data['admin_email'],
            'full_name': data['admin_name'],
            'password': data['admin_password']
        }

        tenant = TenantService.create_tenant(tenant_data, admin_user_data)

        return jsonify({
            'message': 'Tenant created successfully',
            'tenant': tenant.to_dict(),
            'redirect_url': f"https://{tenant.slug}.xyz.com"
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@tenants_bp.route('/current', methods=['GET'])
@tenant_required
def get_current_tenant():
    """Get current tenant information"""
    return jsonify({
        'tenant': g.tenant.to_dict()
    })

@tenants_bp.route('/settings', methods=['GET', 'PUT'])
@tenant_required
@admin_required
def manage_tenant_settings():
    """Get or update tenant settings"""
    if request.method == 'GET':
        return jsonify({
            'settings': g.tenant.settings,
            'branding': g.tenant.branding
        })

    # PUT - Update settings
    data = request.get_json()

    if 'settings' in data:
        g.tenant.settings = {**g.tenant.settings, **data['settings']}

    if 'branding' in data:
        g.tenant.branding = {**g.tenant.branding, **data['branding']}

    db.session.commit()

    return jsonify({
        'message': 'Settings updated successfully',
        'tenant': g.tenant.to_dict()
    })

@tenants_bp.route('/usage', methods=['GET'])
@tenant_required
@admin_required
def get_tenant_usage():
    """Get tenant usage statistics"""
    total_students = User.query.filter_by(
        tenant_id=g.tenant_id,
        role='student',
        status='active'
    ).count()

    total_courses = Course.query.filter_by(tenant_id=g.tenant_id).count()
    active_courses = Course.query.filter_by(tenant_id=g.tenant_id, is_published=True).count()

    return jsonify({
        'usage': {
            'students': {
                'used': total_students,
                'limit': g.tenant.get_max_students(),
                'percentage': (total_students / g.tenant.get_max_students() * 100) if g.tenant.get_max_students() else 0
            },
            'courses': {
                'used': total_courses,
                'limit': g.tenant.get_max_courses(),
                'percentage': (total_courses / g.tenant.get_max_courses() * 100) if g.tenant.get_max_courses() else 0
            },
            'storage': {
                'used_bytes': g.tenant.storage_used,
                'limit_bytes': g.tenant.get_storage_limit(),
                'percentage': (g.tenant.storage_used / g.tenant.get_storage_limit() * 100) if g.tenant.get_storage_limit() else 0
            }
        },
        'features': g.tenant.features
    })

@tenants_bp.route('/validate-slug/<slug>', methods=['GET'])
def validate_slug(slug):
    """Check if a tenant slug is available"""
    existing = Tenant.query.filter_by(slug=slug).first()
    return jsonify({
        'available': existing is None,
        'suggestions': [] if existing is None else TenantService.suggest_slugs(slug)
    })
