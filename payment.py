from app.extensions import db
from app.models.base import BaseModel
from datetime import datetime

class Payment(BaseModel):
    __tablename__ = 'payments'

    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    invoice_id = db.Column(db.String(36), db.ForeignKey('invoices.id'))

    amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')

    payment_method = db.Column(db.Enum('card', 'bank_transfer', 'offline', 'wallet', 'stripe', 'paypal'), nullable=False)
    status = db.Column(db.Enum('initiated', 'pending', 'completed', 'failed', 'refunded', 'cancelled'), default='initiated')

    gateway_transaction_id = db.Column(db.String(200))
    gateway_response = db.Column(db.JSON)

    paid_at = db.Column(db.DateTime)
    refunded_at = db.Column(db.DateTime)

    # CHANGED: Renamed from 'metadata' to 'payment_metadata'
    payment_metadata = db.Column(db.JSON, default=lambda: {
        'description': None,
        'tax_amount': 0,
        'discount_amount': 0,
    })

    # Relationships
    tenant = db.relationship('Tenant')
    user = db.relationship('User')
    invoice = db.relationship('Invoice', back_populates='payments')

    def to_dict(self):
        data = super().to_dict()
        # Convert Decimal to float for JSON serialization
        if data.get('amount'):
            data['amount'] = float(data['amount'])
        return data

class Invoice(BaseModel):
    __tablename__ = 'invoices'

    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')

    line_items = db.Column(db.JSON, nullable=False)  # [{ description, amount, quantity }]
    status = db.Column(db.Enum('draft', 'sent', 'paid', 'overdue', 'cancelled'), default='draft')

    sent_at = db.Column(db.DateTime)
    paid_at = db.Column(db.DateTime)

    # CHANGED: Renamed from 'metadata' to 'invoice_metadata'
    invoice_metadata = db.Column(db.JSON, default=lambda: {
        'notes': None,
        'terms': None,
        'tax_rate': 0,
    })

    # Relationships
    tenant = db.relationship('Tenant')
    user = db.relationship('User')
    payments = db.relationship('Payment', back_populates='invoice', lazy='dynamic')

    @property
    def amount_paid(self):
        return sum(payment.amount for payment in self.payments.filter_by(status='completed'))

    @property
    def balance_due(self):
        return self.total_amount - self.amount_paid

    def to_dict(self):
        data = super().to_dict()
        # Convert Decimal to float for JSON serialization
        if data.get('total_amount'):
            data['total_amount'] = float(data['total_amount'])
        data['amount_paid'] = float(self.amount_paid)
        data['balance_due'] = float(self.balance_due)
        return data
