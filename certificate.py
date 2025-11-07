from app.extensions import db
from app.models.base import BaseModel
from datetime import datetime
import hashlib

class Certificate(BaseModel):
    __tablename__ = 'certificates'

    enrollment_id = db.Column(db.String(36), db.ForeignKey('enrollments.id'), nullable=False)
    template_id = db.Column(db.String(36))  # Reference to certificate template

    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    cert_number = db.Column(db.String(100), unique=True, nullable=False)

    pdf_path = db.Column(db.String(500))  # Path to generated PDF
    verification_hash = db.Column(db.String(64), unique=True, nullable=False)

    # CHANGED: Renamed from 'metadata' to 'certificate_metadata'
    certificate_metadata = db.Column(db.JSON, default=lambda: {
        'grade': None,
        'hours_completed': 0,
        'issue_date': None,
        'expiry_date': None,
        'qr_code_url': None,
    })

    # Relationships
    enrollment = db.relationship('Enrollment', back_populates='certificate')

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.verification_hash:
            self.generate_verification_hash()
        if not self.cert_number:
            self.generate_cert_number()

    def generate_verification_hash(self):
        """Generate unique verification hash for certificate validation"""
        base_string = f"{self.enrollment_id}{self.issued_at}{datetime.utcnow()}"
        self.verification_hash = hashlib.sha256(base_string.encode()).hexdigest()

    def generate_cert_number(self):
        """Generate unique certificate number"""
        timestamp = int(datetime.utcnow().timestamp())
        self.cert_number = f"CERT-{timestamp}-{self.id[:8].upper()}"

    def to_dict(self):
        data = super().to_dict()
        data['verification_url'] = f"/verify/certificate/{self.verification_hash}"
        return data
