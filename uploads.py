from flask import Blueprint, request, jsonify, g
import os
from werkzeug.utils import secure_filename
from app.services.file_service import FileService
from app.utils.decorators import tenant_required, login_required, instructor_required

uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/course-materials', methods=['POST'])
@tenant_required
@instructor_required
def upload_course_material():
    """Upload course material file"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    course_id = request.form.get('course_id')
    module_id = request.form.get('module_id')

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not course_id:
        return jsonify({'error': 'Course ID required'}), 400

    # Check file size and type
    file.seek(0, 2)  # Seek to end to get size
    file_size = file.tell()
    file.seek(0)  # Reset seek position

    if not g.tenant.can_use_storage(file_size):
        return jsonify({
            'error': 'Storage limit exceeded',
            'upgrade_required': True
        }), 402

    try:
        upload_result = FileService.upload_course_material(
            file=file,
            tenant_id=g.tenant_id,
            course_id=course_id,
            module_id=module_id,
            title=request.form.get('title'),
            description=request.form.get('description')
        )

        # Update tenant storage usage
        g.tenant.update_usage(storage_delta=file_size)

        return jsonify({
            'message': 'File uploaded successfully',
            'material': upload_result
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@uploads_bp.route('/user-avatar', methods=['POST'])
@tenant_required
@login_required
def upload_user_avatar():
    """Upload user avatar"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Check if it's an image
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    if not FileService.allowed_file(file.filename, allowed_extensions):
        return jsonify({'error': 'File type not allowed'}), 400

    try:
        avatar_url = FileService.upload_user_avatar(
            file=file,
            user_id=current_user.id,
            tenant_id=g.tenant_id
        )

        # Update user profile
        if not current_user.profile:
            current_user.profile = {}

        current_user.profile['photo_url'] = avatar_url
        db.session.commit()

        return jsonify({
            'message': 'Avatar uploaded successfully',
            'avatar_url': avatar_url
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@uploads_bp.route('/certificate-template', methods=['POST'])
@tenant_required
@instructor_required
def upload_certificate_template():
    """Upload certificate template"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Check if it's an image
    allowed_extensions = {'png', 'jpg', 'jpeg', 'svg', 'pdf'}
    if not FileService.allowed_file(file.filename, allowed_extensions):
        return jsonify({'error': 'File type not allowed'}), 400

    try:
        template_url = FileService.upload_certificate_template(
            file=file,
            tenant_id=g.tenant_id,
            template_name=request.form.get('template_name')
        )

        return jsonify({
            'message': 'Certificate template uploaded successfully',
            'template_url': template_url
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@uploads_bp.route('/signed-url', methods=['POST'])
@tenant_required
@login_required
def generate_signed_url():
    """Generate signed URL for secure file access"""
    data = request.get_json()

    if not data or not data.get('file_path'):
        return jsonify({'error': 'File path required'}), 400

    try:
        signed_url = FileService.generate_signed_url(
            file_path=data['file_path'],
            tenant_id=g.tenant_id,
            user_id=current_user.id
        )

        return jsonify({
            'signed_url': signed_url,
            'expires_in': 3600  # 1 hour
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
