import re
from datetime import datetime

class Validators:
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_phone(phone):
        """Validate phone number format"""
        # Basic international phone validation
        pattern = r'^\+?[1-9]\d{1,14}$'
        return bool(re.match(pattern, phone.replace(' ', '').replace('-', '')))

    @staticmethod
    def validate_date(date_string, format='%Y-%m-%d'):
        """Validate date string format"""
        try:
            datetime.strptime(date_string, format)
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_password_strength(password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"

        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"

        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"

        if not re.search(r'[0-9]', password):
            return False, "Password must contain at least one number"

        return True, "Password is strong"

    @staticmethod
    def validate_course_code(code):
        """Validate course code format"""
        pattern = r'^[A-Z]{3,4}\d{3}$'
        return bool(re.match(pattern, code))

    @staticmethod
    def sanitize_input(text):
        """Basic input sanitization"""
        if not text:
            return text

        # Remove potentially dangerous characters
        text = re.sub(r'[<>]', '', text)
        # Trim whitespace
        text = text.strip()

        return text
