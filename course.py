from app.extensions import db
from app.models.base import BaseModel

class Course(BaseModel):
    __tablename__ = 'courses'

    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    instructor_id = db.Column(db.String(36), db.ForeignKey('users.id'))

    code = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    short_description = db.Column(db.Text)
    full_description = db.Column(db.Text)

    syllabus = db.Column(db.JSON, default=lambda: {
        'modules': [],
        'learning_objectives': [],
        'prerequisites': []
    })

    delivery = db.Column(db.Enum('online', 'offline', 'hybrid'), nullable=False)
    duration_weeks = db.Column(db.Integer)
    level = db.Column(db.Enum('beginner', 'intermediate', 'advanced'))

    price_decimal = db.Column(db.Numeric(10, 2), default=0)
    currency = db.Column(db.String(3), default='USD')

    is_published = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)

    # CHANGED: Renamed from 'metadata' to 'course_metadata'
    course_metadata = db.Column(db.JSON, default=lambda: {
        'tags': [],
        'category': 'general',
        'difficulty': 'beginner',
        'language': 'en',
        'thumbnail_url': None,
        'video_preview_url': None,
    })

    # Relationships
    tenant = db.relationship('Tenant', back_populates='courses')
    instructor = db.relationship('User', back_populates='created_courses')
    batches = db.relationship('Batch', back_populates='course', lazy='dynamic')
    materials = db.relationship('Material', back_populates='course', lazy='dynamic')
    modules = db.relationship('Module', back_populates='course', lazy='dynamic')
    enrollments = db.relationship('Enrollment', back_populates='course', lazy='dynamic')
    assessments = db.relationship('Assessment', back_populates='course', lazy='dynamic')

    def to_dict(self):
        data = super().to_dict()
        # Convert Decimal to float for JSON serialization
        if data.get('price_decimal'):
            data['price_decimal'] = float(data['price_decimal'])
        return data

class Batch(BaseModel):
    __tablename__ = 'batches'

    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)
    instructor_id = db.Column(db.String(36), db.ForeignKey('users.id'))

    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    max_capacity = db.Column(db.Integer, default=30)

    location = db.Column(db.String(200))  # Physical location or online room ID
    schedule = db.Column(db.JSON, default=lambda: {
        'days': [],
        'time_slots': [],
        'timezone': 'UTC'
    })

    status = db.Column(db.Enum('upcoming', 'ongoing', 'completed', 'cancelled'), default='upcoming')

    # Relationships
    course = db.relationship('Course', back_populates='batches')
    instructor = db.relationship('User')
    enrollments = db.relationship('Enrollment', back_populates='batch', lazy='dynamic')

    @property
    def enrolled_count(self):
        return self.enrollments.filter_by(status='confirmed').count()

    @property
    def available_seats(self):
        return self.max_capacity - self.enrolled_count

class Module(BaseModel):
    __tablename__ = 'modules'

    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    order_index = db.Column(db.Integer, default=0)

    # Relationships
    course = db.relationship('Course', back_populates='modules')
    materials = db.relationship('Material', back_populates='module', lazy='dynamic')
    assessments = db.relationship('Assessment', back_populates='module', lazy='dynamic')

class Material(BaseModel):
    __tablename__ = 'materials'

    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)
    module_id = db.Column(db.String(36), db.ForeignKey('modules.id'))

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum('video', 'pdf', 'doc', 'ppt', 'scorm', 'link', 'text'), nullable=False)

    content_url = db.Column(db.String(500))
    storage_path = db.Column(db.String(500))

    duration_seconds = db.Column(db.Integer)  # For videos/audio
    size_bytes = db.Column(db.BigInteger)

    order_index = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=True)

    access_rules = db.Column(db.JSON, default=lambda: {
        'download_allowed': False,
        'release_date': None,
        'require_completion': False,
    })

    # Relationships
    course = db.relationship('Course', back_populates='materials')
    module = db.relationship('Module', back_populates='materials')
