import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

class FileService:
    # Allowed file extensions for different types
    ALLOWED_EXTENSIONS = {
        'image': {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'},
        'document': {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'},
        'video': {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'},
        'audio': {'mp3', 'wav', 'ogg', 'm4a'},
        'archive': {'zip', 'rar', '7z'},
    }

    @staticmethod
    def allowed_file(filename, allowed_extensions=None):
        """Check if file extension is allowed"""
        if '.' not in filename:
            return False

        ext = filename.rsplit('.', 1)[1].lower()

        if allowed_extensions:
            return ext in allowed_extensions

        # Check against all allowed extensions
        for category in FileService.ALLOWED_EXTENSIONS.values():
            if ext in category:
                return True

        return False

    @staticmethod
    def upload_course_material(file, tenant_id, course_id, **kwargs):
        """Upload course material file"""
        if not FileService.allowed_file(file.filename):
            raise ValueError("File type not allowed")

        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"

        # Create upload directory
        upload_dir = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            'tenants',
            tenant_id,
            'courses',
            course_id,
            'materials'
        )
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        return {
            'filename': filename,
            'unique_filename': unique_filename,
            'file_path': file_path,
            'file_url': f"/uploads/tenants/{tenant_id}/courses/{course_id}/materials/{unique_filename}",
            'size_bytes': os.path.getsize(file_path)
        }

    @staticmethod
    def upload_user_avatar(file, user_id, tenant_id):
        """Upload user avatar"""
        allowed_extensions = FileService.ALLOWED_EXTENSIONS['image']

        if not FileService.allowed_file(file.filename, allowed_extensions):
            raise ValueError("Only image files are allowed for avatars")

        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"avatar_{user_id}.{ext}"

        # Create upload directory
        upload_dir = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            'tenants',
            tenant_id,
            'avatars'
        )
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        return f"/uploads/tenants/{tenant_id}/avatars/{unique_filename}"

    @staticmethod
    def upload_certificate_template(file, tenant_id, template_name):
        """Upload certificate template"""
        allowed_extensions = FileService.ALLOWED_EXTENSIONS['image'].union({'pdf'})

        if not FileService.allowed_file(file.filename, allowed_extensions):
            raise ValueError("Only image and PDF files are allowed for certificate templates")

        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"cert_template_{template_name or uuid.uuid4()}.{ext}"

        # Create upload directory
        upload_dir = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            'tenants',
            tenant_id,
            'certificates',
            'templates'
        )
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        return f"/uploads/tenants/{tenant_id}/certificates/templates/{unique_filename}"

    @staticmethod
    def generate_signed_url(file_path, tenant_id, user_id, expires_in=3600):
        """Generate signed URL for secure file access"""
        # In a real implementation, this would use cloud storage signed URLs
        # For local filesystem, we'll just return the file path for now
        return file_path
