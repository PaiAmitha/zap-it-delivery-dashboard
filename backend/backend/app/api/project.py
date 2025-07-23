from flask_restful import Resource, reqparse
from app.models.project import Project
from app.schemas.core import ProjectSchema
from app import db

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

class ProjectListResource(Resource):
    from app.utils.auth import jwt_required
    from app.utils.rbac import permission_required
    @jwt_required
    @permission_required('projects', 'edit')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('project_name', required=True)
        parser.add_argument('customer')
        parser.add_argument('health_status')
        parser.add_argument('current_stage')
        parser.add_argument('on_time_percentage', type=int)
        parser.add_argument('end_date')
        parser.add_argument('risk_level')
        parser.add_argument('dm_po')
        parser.add_argument('owner_id')
        args = parser.parse_args()
        project = Project(**args)
        db.session.add(project)
        db.session.commit()
        return project_schema.dump(project), 201

    @jwt_required
    def get(self):
        from flask import request
        query = Project.query
        # Filtering
        customer = request.args.get('customer')
        if customer:
            query = query.filter(Project.customer == customer)
        health_status = request.args.get('health_status')
        if health_status:
            query = query.filter(Project.health_status == health_status)
        risk_level = request.args.get('risk_level')
        if risk_level:
            query = query.filter(Project.risk_level == risk_level)
        # Search
        search = request.args.get('search')
        if search:
            query = query.filter(Project.project_name.ilike(f"%{search}%"))
        # Pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        return {
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'items': projects_schema.dump(pagination.items)
        }, 200

class ProjectResource(Resource):
    from app.utils.auth import jwt_required
    from app.utils.rbac import permission_required
    @jwt_required
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)
        return project_schema.dump(project), 200

    @jwt_required
    @permission_required('projects', 'edit')
    def put(self, project_id):
        project = Project.query.get_or_404(project_id)
        parser = reqparse.RequestParser()
        # Add all fields as in post
        parser.add_argument('id', required=True)
        parser.add_argument('project_name', required=True)
        parser.add_argument('customer')
        parser.add_argument('health_status')
        parser.add_argument('current_stage')
        parser.add_argument('on_time_percentage', type=int)
        parser.add_argument('end_date')
        parser.add_argument('risk_level')
        parser.add_argument('dm_po')
        parser.add_argument('owner_id')
        args = parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(project, key, value)
        db.session.commit()
        return project_schema.dump(project), 200

    @jwt_required
    @permission_required('projects', 'edit')
    def delete(self, project_id):
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return '', 204
