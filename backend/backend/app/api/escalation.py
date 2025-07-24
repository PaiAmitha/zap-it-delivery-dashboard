from marshmallow import Schema, fields
from flask_restful import Resource, reqparse
from app import db
from app.models.project import Project
from app.schemas.core import ProjectSchema
from app.utils.rbac import permission_required


class Escalation(db.Model):
    __tablename__ = 'escalations'
    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    customer = db.Column(db.String(120), nullable=True)
    project = db.Column(db.String(120), nullable=True)
    owner = db.Column(db.String(120), nullable=True)
    priority = db.Column(db.String(32), nullable=True)
    status = db.Column(db.String(32), nullable=True)
    dateRaised = db.Column(db.String(32), nullable=True)
    resolutionETA = db.Column(db.String(32), nullable=True)
    description = db.Column(db.Text, nullable=True)


class EscalationSchema(Schema):
    id = fields.Str(dump_only=True)
    title = fields.Str(required=True)
    customer = fields.Str()
    project = fields.Str()
    owner = fields.Str()
    priority = fields.Str()
    status = fields.Str()
    dateRaised = fields.Str()
    resolutionETA = fields.Str()
    description = fields.Str()


escalation_schema = EscalationSchema()
escalations_schema = EscalationSchema(many=True)


class EscalationListResource(Resource):
    from app.utils.auth import jwt_required

    @jwt_required
    def get(self):
        from flask import request
        query = Escalation.query
        # Filtering
        escalation_id = request.args.get('id')
        if escalation_id:
            query = query.filter(Escalation.id == escalation_id)
        customer = request.args.get('customer')
        if customer:
            query = query.filter(Escalation.customer == customer)
        project = request.args.get('project')
        if project:
            query = query.filter(Escalation.project == project)
        priority = request.args.get('priority')
        if priority:
            query = query.filter(Escalation.priority == priority)
        status = request.args.get('status')
        if status:
            query = query.filter(Escalation.status == status)
        # Search
        search = request.args.get('search')
        if search:
            query = query.filter(Escalation.title.ilike(f"%{search}%"))
        # Pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False)
        return {
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'escalations': escalations_schema.dump(pagination.items)
        }, 200

    @jwt_required
    @permission_required('escalations', 'edit')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('title', required=True)
        parser.add_argument('customer')
        parser.add_argument('project')
        parser.add_argument('owner')
        parser.add_argument('priority')
        parser.add_argument('status')
        parser.add_argument('dateRaised')
        parser.add_argument('resolutionETA')
        parser.add_argument('description')
        args = parser.parse_args()
        escalation = Escalation(**args)
        db.session.add(escalation)
        db.session.commit()
        return escalation_schema.dump(escalation), 201


class EscalationResource(Resource):
    from app.utils.auth import jwt_required
    from app.utils.rbac import permission_required

    def get(self, escalation_id):
        escalation = Escalation.query.get_or_404(escalation_id)
        return escalation_schema.dump(escalation), 200

    @jwt_required
    @permission_required('escalations', 'edit')
    def put(self, escalation_id):
        escalation = Escalation.query.get_or_404(escalation_id)
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('title', required=True)
        parser.add_argument('customer')
        parser.add_argument('project')
        parser.add_argument('owner')
        parser.add_argument('priority')
        parser.add_argument('status')
        parser.add_argument('dateRaised')
        parser.add_argument('resolutionETA')
        parser.add_argument('description')
        args = parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(escalation, key, value)
        db.session.commit()
        return escalation_schema.dump(escalation), 200

    @jwt_required
    @permission_required('escalations', 'edit')
    def delete(self, escalation_id):
        escalation = Escalation.query.get_or_404(escalation_id)
        db.session.delete(escalation)
        db.session.commit()
        return '', 204
