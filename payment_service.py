from app.models import db, Payment, Invoice, User
import uuid
from datetime import datetime, timedelta

class PaymentService:
    @staticmethod
    def create_invoice(tenant_id, user_id, due_date, line_items, **kwargs):
        """Create a new invoice"""

        # Calculate total amount
        total_amount = sum(item.get('amount', 0) * item.get('quantity', 1) for item in line_items)

        # Apply tax if provided
        tax_rate = kwargs.get('tax_rate', 0)
        tax_amount = total_amount * (tax_rate / 100)
        total_amount += tax_amount

        # Generate invoice number
        invoice_number = PaymentService.generate_invoice_number()

        invoice = Invoice(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            user_id=user_id,
            invoice_number=invoice_number,
            due_date=due_date,
            total_amount=total_amount,
            line_items=line_items,
            invoice_metadata={
                'notes': kwargs.get('notes'),
                'terms': kwargs.get('terms'),
                'tax_rate': tax_rate,
                'tax_amount': tax_amount
            }
        )

        db.session.add(invoice)
        db.session.commit()

        return invoice

    @staticmethod
    def create_payment(tenant_id, user_id, invoice_id, amount, payment_method, **kwargs):
        """Create a payment record"""

        payment = Payment(
            id=str(uuid.uuid4()),
            tenant_id=tenant_id,
            user_id=user_id,
            invoice_id=invoice_id,
            amount=amount,
            payment_method=payment_method,
            payment_metadata={
                'description': kwargs.get('description'),
                'tax_amount': kwargs.get('tax_amount', 0),
                'discount_amount': kwargs.get('discount_amount', 0),
            }
        )

        # For online payments, we'd integrate with Stripe/PayPal here
        if payment_method in ['stripe', 'paypal', 'card']:
            payment.gateway_response = {
                'status': 'pending',
                'next_action': 'redirect_to_gateway'
            }

        db.session.add(payment)
        db.session.commit()

        return payment

    @staticmethod
    def confirm_payment(payment_id, gateway_transaction_id=None):
        """Confirm a payment as completed"""

        payment = Payment.query.get(payment_id)
        if not payment:
            raise ValueError("Payment not found")

        payment.status = 'completed'
        payment.paid_at = datetime.utcnow()

        if gateway_transaction_id:
            payment.gateway_transaction_id = gateway_transaction_id

        # Update related invoice status
        invoice = payment.invoice
        if invoice.amount_paid >= invoice.total_amount:
            invoice.status = 'paid'
            invoice.paid_at = datetime.utcnow()

        db.session.commit()

        return payment

    @staticmethod
    def handle_stripe_webhook(payload, signature):
        """Handle Stripe webhook events"""
        # This is a simplified version - in a real app, you'd verify the signature
        # and process different Stripe event types

        import json
        event = json.loads(payload)

        if event.get('type') == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Find and confirm the payment
            payment = Payment.query.filter_by(
                gateway_transaction_id=payment_intent['id']
            ).first()

            if payment:
                PaymentService.confirm_payment(payment.id, payment_intent['id'])

        return event

    @staticmethod
    def upgrade_subscription(tenant_id, plan, payment_method_id=None):
        """Upgrade tenant subscription"""

        from app.services.tenant_service import TenantService

        tenant = TenantService.update_subscription(tenant_id, plan)

        # If immediate payment is required, create an invoice and payment
        if payment_method_id and plan != 'free':
            line_items = [{
                'description': f'{plan.capitalize()} Plan Subscription',
                'amount': PaymentService.get_plan_price(plan),
                'quantity': 1
            }]

            due_date = datetime.utcnow().date() + timedelta(days=7)

            invoice = PaymentService.create_invoice(
                tenant_id=tenant_id,
                user_id=tenant.users.filter_by(role='admin').first().id,
                due_date=due_date,
                line_items=line_items,
                notes=f'Subscription upgrade to {plan} plan'
            )

            payment = PaymentService.create_payment(
                tenant_id=tenant_id,
                user_id=invoice.user_id,
                invoice_id=invoice.id,
                amount=invoice.total_amount,
                payment_method='stripe'
            )

            return {
                'tenant': tenant,
                'invoice': invoice,
                'payment': payment
            }

        return {'tenant': tenant}

    @staticmethod
    def generate_invoice_number():
        """Generate unique invoice number"""
        timestamp = int(datetime.utcnow().timestamp())
        return f"INV-{timestamp}-{str(uuid.uuid4())[:6].upper()}"

    @staticmethod
    def get_plan_price(plan):
        """Get monthly price for a plan"""
        prices = {
            'free': 0,
            'starter': 29,
            'professional': 79,
            'enterprise': 199
        }
        return prices.get(plan, 0)
