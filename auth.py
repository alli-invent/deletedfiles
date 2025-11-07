from flask import Blueprint, request, jsonify, g
from flask_login import login_user, logout_user, login_required, current_user
from app.models import db, User
from app.services.auth_service import AuthService
from app.utils.decorators import tenant_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@tenant_required
def register():
    """Register a new user within a tenant"""
    data = request.get_json()

    required_fields = ['email', 'password', 'full_name', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = AuthService.register_user(
            tenant_id=g.tenant_id,
            email=data['email'],
            password=data['password'],
            full_name=data['full_name'],
            role=data['role'],
            profile=data.get('profile', {})
        )

        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
@tenant_required
def login():
    """User login"""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    try:
        user = AuthService.authenticate(
            tenant_id=g.tenant_id,
            email=data['email'],
            password=data['password']
        )

        if user:
            login_user(user)
            user.last_login_at = db.func.now()
            db.session.commit()

            token = user.get_auth_token()

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user.to_dict()
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """User logout"""
    logout_user()
    return jsonify({'message': 'Logout successful'})

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user information"""
    return jsonify({
        'user': current_user.to_dict()
    })

@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """Change user password"""
    data = request.get_json()

    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current and new password required'}), 400

    if not current_user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 400

    current_user.set_password(data['new_password'])
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'})

@auth_bp.route('/forgot-password', methods=['POST'])
@tenant_required
def forgot_password():
    """Initiate password reset"""
    data = request.get_json()

    if not data or not data.get('email'):
        return jsonify({'error': 'Email required'}), 400

    try:
        AuthService.initiate_password_reset(g.tenant_id, data['email'])
        return jsonify({'message': 'Password reset instructions sent to your email'})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/reset-password', methods=['POST'])
@tenant_required
def reset_password():
    """Reset password with token"""
    data = request.get_json()

    required_fields = ['token', 'new_password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Token and new password required'}), 400

    try:
        AuthService.reset_password(
            g.tenant_id,
            data['token'],
            data['new_password']
        )
        return jsonify({'message': 'Password reset successfully'})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
