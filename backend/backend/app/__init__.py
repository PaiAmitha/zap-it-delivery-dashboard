from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api

from .config import Config

db = SQLAlchemy()
migrate = Migrate()
api = Api()

def create_app():
    from app.api.auth import LoginResource
    api.add_resource(LoginResource, '/api/login')
    from app.api.finance import FinanceResource
    api.add_resource(FinanceResource, '/api/finance')
    from app.api.dashboard import DashboardResource
    api.add_resource(DashboardResource, '/api/dashboard')
    from app.api.escalation import EscalationListResource, EscalationResource
    api.add_resource(EscalationListResource, '/api/escalations')
    api.add_resource(EscalationResource, '/api/escalations/<string:escalation_id>')
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    # Import and register resources here
    from app.api.user import UserListResource, UserResource
    from app.api.employee import EmployeeListResource, EmployeeResource
    api.add_resource(UserListResource, '/api/users')
    api.add_resource(UserResource, '/api/users/<string:user_id>')
    from app.api.project import ProjectListResource, ProjectResource
    api.add_resource(EmployeeListResource, '/api/employees')
    api.add_resource(EmployeeResource, '/api/employees/<string:employee_id>')
    api.add_resource(ProjectListResource, '/api/projects')
    api.add_resource(ProjectResource, '/api/projects/<string:project_id>')

    return app
