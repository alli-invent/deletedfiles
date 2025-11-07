import json
from datetime import datetime, date
from decimal import Decimal

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for handling Python objects"""
    def default(self, obj):
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

def format_currency(amount, currency='USD'):
    """Format currency amount"""
    if currency == 'USD':
        return f"${amount:,.2f}"
    elif currency == 'EUR':
        return f"€{amount:,.2f}"
    elif currency == 'GBP':
        return f"£{amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def format_duration(minutes):
    """Format duration in minutes to human readable format"""
    if minutes < 60:
        return f"{minutes} min"

    hours = minutes // 60
    remaining_minutes = minutes % 60

    if remaining_minutes == 0:
        return f"{hours} hour{'s' if hours > 1 else ''}"
    else:
        return f"{hours}h {remaining_minutes}m"

def calculate_progress(completed_items, total_items):
    """Calculate progress percentage"""
    if total_items == 0:
        return 0
    return round((completed_items / total_items) * 100, 2)

def generate_random_string(length=8):
    """Generate random string for various uses"""
    import random
    import string
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def paginate_query(query, page, per_page):
    """Paginate SQLAlchemy query"""
    return query.paginate(page=page, per_page=per_page, error_out=False)

def get_pagination_info(paginated_obj):
    """Get pagination metadata from paginated object"""
    return {
        'page': paginated_obj.page,
        'per_page': paginated_obj.per_page,
        'total': paginated_obj.total,
        'pages': paginated_obj.pages,
        'has_next': paginated_obj.has_next,
        'has_prev': paginated_obj.has_prev,
        'next_num': paginated_obj.next_num,
        'prev_num': paginated_obj.prev_num
    }
