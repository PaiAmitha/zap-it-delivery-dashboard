# --- Flask app setup ---
from flask import Flask, request, jsonify
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
import logging
logging.basicConfig(level=logging.DEBUG)
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)

CORS(app, supports_credentials=True, origins="*", allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], max_age=timedelta(days=1))
CORS(app, supports_credentials=True, origins="*", allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], max_age=timedelta(days=1))

from .dashboard_service import dashboard_bp
from .projects_service import projects_bp
from .resource_service import resource_bp
from .escalation_service import escalation_bp
from .login_service import login_bp

# Apply CORS to all blueprints
from flask_cors import CORS
CORS(dashboard_bp, supports_credentials=True, origins="*")
CORS(projects_bp, supports_credentials=True, origins="*")
CORS(resource_bp, supports_credentials=True, origins="*")
CORS(escalation_bp, supports_credentials=True, origins="*")
from .resource_kpi_api import resource_kpi_bp
CORS(resource_kpi_bp, supports_credentials=True, origins="*")

app.register_blueprint(dashboard_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(resource_bp, url_prefix='/api')
app.register_blueprint(escalation_bp)
app.register_blueprint(login_bp)
app.register_blueprint(resource_kpi_bp)


# --- Locations endpoint for frontend compatibility ---
@app.route('/locations', methods=['GET'])
def get_locations():
    locations = [
        "Bangalore",
        "Pune",
        "Hyderabad",
        "Chennai",
        "Delhi",
        "Mumbai"
    ]
    return jsonify({"locations": locations})

# --- Global OPTIONS handler for CORS preflight ---
## Removed global OPTIONS handler; Flask-CORS will handle OPTIONS requests automatically.
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return ('', 200)
    

from .extensions import db
from flask_migrate import Migrate

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Neeraj%40123@localhost:5432/It_Delivery_Dashboard'
db.init_app(app)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)

