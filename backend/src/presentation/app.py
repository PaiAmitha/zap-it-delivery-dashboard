import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, jsonify
from flask_cors import CORS
from src.infrastructure.db import SessionLocal, init_db, engine
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from src.domain.models import Resource, Project, Employee, Intern
from src.domain.models.escalation import Escalation
from src.domain.models.milestone import Milestone
from src.domain.models.risk import Risk
from src.domain.models.kpi import KPI
from src.domain.models.finance import Finance
from src.domain.models import Resource, Project, Employee, Intern, Escalation, Milestone, Risk, KPI, Finance
from src.application.crud import get_all, get_by_id, create_instance, update_instance, delete_instance
from config.config import Config
import json
import logging


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True, origins="*")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Map emails to passwords
USER_PASSWORDS = {
    "hr@zapcg.com": "hr123",
    "manager@zapcg.com": "manager123",
    "ceo@zapcg.com": "Leadership@123",
    "cio@zapcg.com": "Leadership@123",
    "cto@zapcg.com": "Leadership@123",
    "santhanakrishnan.b@zapcg.com": "EM123",
    "sushama.mohandasan@zapcg.com": "Finance123"
}

USER_DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    '..', '..', '..', 'zap-it-delivery-dashboard', 'src', 'data', 'userData.json'
)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        # Authenticate
        if email in USER_PASSWORDS and USER_PASSWORDS[email] == password:
            # Load user profile from JSON
            try:
                with open(USER_DATA_PATH, 'r', encoding='utf-8') as f:
                    users = json.load(f)["users"]
            except Exception as e:
                logging.error(f"Error reading userData.json: {e}")
                return jsonify({"error": "User data file not found or unreadable."}), 500
            user_profile = next((u for u in users if u["email"] == email), None)
            if user_profile:
                return jsonify({
                    "token": f"token-{user_profile['id']}",
                    "user": user_profile
                })
            return jsonify({"error": "User profile not found"}), 404
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# Generic CRUD endpoints for each model

for model, route in [
    (Resource, 'resources'),
    (Project, 'projects'),
    (Employee, 'employees'),
    (Intern, 'interns'),
    (Escalation, 'escalations'),
    (Milestone, 'milestones'),
    (Risk, 'risks'),
    (KPI, 'kpis'),
    (Finance, 'finance')
]:
    def make_routes(model, route):
        @app.route(f'/{route}', methods=['GET'], endpoint=f'list_all_{route}')
        def list_all():
            db = SessionLocal()
            items = get_all(model, db)
            db.close()
            return jsonify([
                {k: v for k, v in item.__dict__.items() if not k.startswith('_')}
            for item in items])

        @app.route(f'/{route}/<int:item_id>', methods=['GET'], endpoint=f'get_one_{route}')
        def get_one(item_id):
            db = SessionLocal()
            item = get_by_id(model, db, item_id)
            db.close()
            if item:
                return jsonify(item.__dict__)
            return jsonify({'error': f'{route[:-1].capitalize()} not found'}), 404

        @app.route(f'/{route}', methods=['POST'], endpoint=f'create_{route}')
        def create():
            db = SessionLocal()
            data = request.json
            item = create_instance(model, db, **data)
            db.close()
            return jsonify(item.__dict__), 201

        @app.route(f'/{route}/<int:item_id>', methods=['PUT'], endpoint=f'update_{route}')
        def update(item_id):
            db = SessionLocal()
            data = request.json
            item = update_instance(model, db, item_id, **data)
            db.close()
            return jsonify(item.__dict__)

        @app.route(f'/{route}/<int:item_id>', methods=['DELETE'], endpoint=f'delete_{route}')
        def delete(item_id):
            db = SessionLocal()
            item = delete_instance(model, db, item_id)
            db.close()
            return jsonify({'deleted': True})
    make_routes(model, route)

@app.route('/dashboard', methods=['GET'])
def dashboard():
    import logging
    db = SessionLocal()
    try:
        billable_resources = db.query(Resource).filter_by(billable_status=True).all()
        non_billable_resources = db.query(Resource).filter_by(billable_status=False).all()
        employees = db.query(Employee).all()
        projects = db.query(Project).all()
        active_projects = [p for p in projects if getattr(p, 'status', None) == 'active']
        interns = db.query(Intern).all()
        kpis = db.query(KPI).all()
        finances = db.query(Finance).all()
        escalations = db.query(Escalation).all()
        milestones = db.query(Milestone).all()
        risks = db.query(Risk).all()

        data = {
            'billable_count': len(billable_resources),
            'utilization_rate': sum([getattr(e, 'utilization_rate', 0) or 0 for e in employees]) / len(employees) if employees else 0,
            'avg_billing_rate': sum([getattr(e, 'billing_rate', 0) or 0 for e in employees]) / len(employees) if employees else 0,
            'monthly_revenue': sum([getattr(e, 'monthly_revenue_generated', 0) or 0 for e in employees]),
            'productivity_score': sum([getattr(e, 'performance_rating', 0) or 0 for e in employees]) / len(employees) if employees else 0,
            'utilization_trend': [],
            'client_allocation': [],
            'productivity_trend': [],
            'billable_resources': [
                {
                    'name': getattr(r, 'full_name', ''),
                    'designation': getattr(r, 'designation', ''),
                    'client': getattr(r, 'client', ''),
                    'utilization': getattr(r, 'utilization_rate', 0),
                    'billingRate': getattr(r, 'billing_rate', 0),
                    'productivity': getattr(r, 'performance_rating', 0)
                } for r in billable_resources
            ],
            'total_resources': db.query(Resource).count(),
            'active_resources': 0,  # No status field in Resource
            'inactive_resources': 0,  # No status field in Resource
            'monthly_growth': 0,
            'billable_resources_count': len(billable_resources),
            'non_billable_resources_count': len(non_billable_resources),
            'department_data': [],
            'designation_data': [],
            'location_data': [],
            'monthly_growth_data': [],
            'non_billable_cost_drain': sum([getattr(r, 'monthly_salary_cost', 0) or 0 for r in non_billable_resources]),
            'avg_bench_days': sum([getattr(r, 'bench_days', 0) or 0 for r in non_billable_resources]) / len(non_billable_resources) if non_billable_resources else 0,
            'reallocation_opportunities': 0,
            'bench_reason_data': [],
            'bench_aging_data': [],
            'weekly_movement_data': [],
            'non_billable_location_distribution': [],
            'non_billable_resources_list': [
                {
                    'name': getattr(r, 'full_name', ''),
                    'designation': getattr(r, 'designation', ''),
                    'reason': getattr(r, 'bench_reason', ''),
                    'benchDays': getattr(r, 'bench_days', 0),
                    'location': getattr(r, 'location', ''),
                    'monthlyCost': getattr(r, 'monthly_salary_cost', 0),
                    'suggestion': ''
                } for r in non_billable_resources
            ],
            'active_projects': [
                {
                    'id': p.id,
                    'name': getattr(p, 'name', ''),
                    'customer': getattr(p, 'client', ''),
                    'category': getattr(p, 'project_type', ''),
                    'healthStatus': getattr(p, 'health_status', ''),
                    'onTimePercentage': 0,
                    'description': getattr(p, 'description', ''),
                    'progress': 0,
                    'teamSize': getattr(p, 'team_size', 0)
                } for p in active_projects
            ],
            'total_interns': len(interns),
            'interns_assigned': len([i for i in interns if getattr(i, 'status', None) == 'assigned']),
            'interns_unassigned': len([i for i in interns if getattr(i, 'status', None) != 'assigned']),
            'intern_conversion_rate': 0,
            'avg_learning_hours': 0,
            'avg_productive_hours': 0,
            'intern_conversion_funnel': [],
            'intern_monthly_conversion': [],
            'intern_learning_vs_productive': [],
            'intern_location_distribution': [],
            'intern_details_list': [
                {
                    'name': getattr(i, 'name', ''),
                    'designation': getattr(i, 'designation', ''),
                    'project': getattr(i, 'assigned_project', ''),
                    'mentor': getattr(i, 'mentor_name', ''),
                    'status': getattr(i, 'status', ''),
                    'department': getattr(i, 'department', ''),
                    'learningHours': 0,
                    'productiveHours': 0,
                    'feedback': getattr(i, 'feedback', ''),
                    'conversionPotential': getattr(i, 'conversion_potential', '')
                } for i in interns
            ],
        }
        db.close()
        return jsonify(data)
    except Exception as e:
        db.close()
        logging.error(f"Dashboard error: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
