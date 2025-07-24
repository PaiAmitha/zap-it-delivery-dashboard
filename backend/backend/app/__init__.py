from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from .config import Config
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
rest_api = Api()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS for frontend at localhost:8080
    CORS(app, origins=["http://localhost:8080"], supports_credentials=True)

    db.init_app(app)
    migrate.init_app(app, db)
    rest_api.init_app(app)
    jwt.init_app(app)

    # ✅ Import models
    from app.models.user import User
    from app.models.employee import Employee
    from app.models.project import Project

    # ✅ Import and register blueprints
    from .routes import all_routes
    for bp in all_routes:
        app.register_blueprint(bp)

    # ✅ Import and register RESTful API resources (excluding login)
    from app.api.finance import FinanceResource
    from app.api.dashboard import DashboardResource
    from app.api.escalation import EscalationListResource, EscalationResource
    from app.api.user import UserListResource, UserResource
    from app.api.employee import EmployeeListResource, EmployeeResource
    from app.api.project import ProjectListResource, ProjectResource

    rest_api.add_resource(FinanceResource, '/api/finance')
    rest_api.add_resource(DashboardResource, '/api/dashboard')
    rest_api.add_resource(EscalationListResource, '/api/escalations')
    rest_api.add_resource(EscalationResource,
                          '/api/escalations/<string:escalation_id>')
    rest_api.add_resource(UserListResource, '/api/users')
    rest_api.add_resource(UserResource, '/api/users/<string:user_id>')
    rest_api.add_resource(EmployeeListResource, '/api/employees')
    rest_api.add_resource(
        EmployeeResource, '/api/employees/<string:employee_id>')
    rest_api.add_resource(ProjectListResource, '/api/projects')
    rest_api.add_resource(ProjectResource, '/api/projects/<string:project_id>')

    return app
