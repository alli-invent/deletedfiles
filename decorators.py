from functools import wraps
from flask import g, request, jsonify
from flask_login import current_user
from app.models import Tenant

def tenant_required(f):
    """Decorator to ensure tenant context is available"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(g, 'tenant') or not hasattr(g, 'tenant_id'):
            return jsonify({'error': 'Tenant context required'}), 400
        return f(*args, **kwargs)
    return decorated_function

def login_required(f):
    """Decorator to require user authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role not in ['admin', 'superadmin']:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def instructor_required(f):
    """Decorator to require instructor role"""
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role not in ['instructor', 'admin', 'superadmin']:
            return jsonify({'error': 'Instructor access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def feature_required(feature_name):
    """Decorator to check if tenant has access to a feature"""
    def decorator(f):
        @wraps(f)
        @tenant_required
        def decorated_function(*args, **kwargs):
            if not g.tenant.features.get(feature_name, False):
                return jsonify({
                    'error': 'Feature not available',
                    'message': f'This feature requires {feature_name} which is not available in your current plan.',
                    'upgrade_required': True,
                    'current_plan': g.tenant.subscription_tier
                }), 402
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_json(schema):
    """Decorator to validate JSON request body against a schema"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400

            data = request.get_json()
            errors = schema.validate(data) if hasattr(schema, 'validate') else []

            if errors:
                return jsonify({
                    'error': 'Validation failed',
                    'details': errors
                }), 400

            return f(*args, **kwargs)
        return decorated_function
    return decorator
