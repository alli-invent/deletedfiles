import os
from app import create_app
from app.config import config

# Get the configuration class based on environment
env = os.environ.get('FLASK_ENV', 'default')

# Safety check for production
if env == 'production':
    required_vars = ['SECRET_KEY', 'JWT_SECRET_KEY']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables in production: {', '.join(missing_vars)}")

app = create_app(config.get(env, config['default']))

if __name__ == '__main__':
    app.run(
        host=os.environ.get('HOST', '0.0.0.0'),
        port=int(os.environ.get('PORT', 5000)),
        debug=(env == 'development')
    )
