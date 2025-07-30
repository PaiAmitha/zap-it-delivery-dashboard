
# --- Flask app setup ---
from flask import Flask, request
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*", allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], max_age=timedelta(days=1))

# --- Register blueprints from service files ---
from .dashboard_service import dashboard_bp
from .projects_service import projects_bp
from .resource_service import resource_bp
from .escalation_service import escalation_bp

app.register_blueprint(dashboard_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(resource_bp)
app.register_blueprint(escalation_bp)

# --- Example: keep login and locations endpoints here ---
# ...existing code for login and locations endpoints...

# --- Global OPTIONS handler for CORS preflight ---
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return ('', 200)

if __name__ == '__main__':
    app.run(debug=True)

