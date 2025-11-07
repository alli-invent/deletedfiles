from app.extensions import db
import uuid
from datetime import datetime

class BaseModel(db.Model):
    __abstract__ = True
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert model instance to dictionary"""
        data = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            data[column.name] = value
        return data

    def save(self):
        """Save the current instance to database"""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete the current instance from database"""
        db.session.delete(self)
        db.session.commit()
