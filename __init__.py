from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from app.config import Config
from app.extensions import db, jwt
from app.middleware.tenant_middleware import TenantMiddleware

login_manager = LoginManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Apply tenant middleware
    TenantMiddleware(app)

    # Register blueprints
    from app.routes.tenants import tenants_bp
    from app.routes.auth import auth_bp
    from app.routes.courses import courses_bp
    from app.routes.enrollments import enrollments_bp
    from app.routes.assessments import assessments_bp
    from app.routes.payments import payments_bp
    from app.routes.uploads import uploads_bp

    app.register_blueprint(tenants_bp, url_prefix='/api/tenants')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(courses_bp, url_prefix='/api/courses')
    app.register_blueprint(enrollments_bp, url_prefix='/api/enrollments')  # FIXED
    app.register_blueprint(assessments_bp, url_prefix='/api/assessments')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(uploads_bp, url_prefix='/api/uploads')

    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        return User.query.get(user_id)

    @login_manager.unauthorized_handler
    def unauthorized():
        return {'error': 'Authentication required'}, 401

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500

    return app
