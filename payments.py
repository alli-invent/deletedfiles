from flask import Blueprint, request, jsonify, g
from app.models import db, Payment, Invoice, User
from app.services.payment_service import PaymentService
from app.utils.decorators import tenant_required, login_required, admin_required

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/invoices', methods=['GET'])
@tenant_required
@login_required
def get_invoices():
    """Get invoices for user or all invoices (admin)"""
    if current_user.role in ['admin', 'finance']:
        # Get all invoices for tenant
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', 'all')

        query = Invoice.query.filter_by(tenant_id=g.tenant_id)

        if status != 'all':
            query = query.filter_by(status=status)

        invoices = query.order_by(Invoice.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            'invoices': [invoice.to_dict() for invoice in invoices.items],
            'total': invoices.total,
            'pages': invoices.pages,
            'current_page': page
        })
    else:
        # Get user's invoices
        invoices = Invoice.query.filter_by(
            tenant_id=g.tenant_id,
            user_id=current_user.id
        ).order_by(Invoice.created_at.desc()).all()

        return jsonify({
            'invoices': [invoice.to_dict() for invoice in invoices]
        })

@payments_bp.route('/invoices', methods=['POST'])
@tenant_required
@admin_required
def create_invoice():
    """Create a new invoice"""
    data = request.get_json()

    required_fields = ['user_id', 'due_date', 'line_items']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Verify user belongs to tenant
    user = User.query.filter_by(
        id=data['user_id'],
        tenant_id=g.tenant_id
    ).first_or_404()

    try:
        invoice = PaymentService.create_invoice(
            tenant_id=g.tenant_id,
            user_id=data['user_id'],
            due_date=data['due_date'],
            line_items=data['line_items'],
            notes=data.get('notes'),
            tax_rate=data.get('tax_rate', 0)
        )

        return jsonify({
            'message': 'Invoice created successfully',
            'invoice': invoice.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@payments_bp.route('/invoices/<invoice_id>', methods=['GET'])
@tenant_required
@login_required
def get_invoice(invoice_id):
    """Get a specific invoice"""
    invoice = Invoice.query.filter_by(id=invoice_id).first_or_404()

    # Check access
    if invoice.user_id != current_user.id and current_user.role == 'student':
        return jsonify({'error': 'Access denied'}), 403

    return jsonify({
        'invoice': invoice.to_dict(),
        'payments': [payment.to_dict() for payment in invoice.payments]
    })

@payments_bp.route('/payments', methods=['POST'])
@tenant_required
@login_required
def create_payment():
    """Create a payment (initiate payment process)"""
    data = request.get_json()

    required_fields = ['invoice_id', 'amount', 'payment_method']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    invoice = Invoice.query.filter_by(id=data['invoice_id']).first_or_404()

    # Check ownership
    if invoice.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    try:
        payment = PaymentService.create_payment(
            tenant_id=g.tenant_id,
            user_id=current_user.id,
            invoice_id=data['invoice_id'],
            amount=data['amount'],
            payment_method=data['payment_method'],
            description=data.get('description')
        )

        # If using Stripe/PayPal, this would return a payment intent/client secret
        return jsonify({
            'message': 'Payment initiated',
            'payment': payment.to_dict(),
            'next_action': payment.gateway_response.get('next_action') if payment.gateway_response else None
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@payments_bp.route('/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = PaymentService.handle_stripe_webhook(payload, sig_header)

        # Process the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            PaymentService.confirm_payment(payment_intent['id'])

        return jsonify({'success': True})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@payments_bp.route('/subscription/upgrade', methods=['POST'])
@tenant_required
@admin_required
def upgrade_subscription():
    """Upgrade tenant subscription"""
    data = request.get_json()

    if not data or not data.get('plan'):
        return jsonify({'error': 'Plan required'}), 400

    valid_plans = ['free', 'starter', 'professional', 'enterprise']
    if data['plan'] not in valid_plans:
        return jsonify({'error': 'Invalid plan'}), 400

    try:
        subscription = PaymentService.upgrade_subscription(
            tenant_id=g.tenant_id,
            plan=data['plan'],
            payment_method_id=data.get('payment_method_id')  # For immediate payment
        )

        return jsonify({
            'message': f'Subscription upgraded to {data["plan"]}',
            'tenant': g.tenant.to_dict()
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
