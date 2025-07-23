from app.models.core import User, Project, Employee
from app.schemas.core import UserSchema, ProjectSchema, EmployeeSchema
from flask_restful import Resource, reqparse
from app import db
from flask_jwt_extended import jwt_required
from app.utils.rbac import permission_required

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users), 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True)
        parser.add_argument('email', required=True)
        args = parser.parse_args()
        user = User(username=args['username'], email=args['email'])
        db.session.add(user)
        db.session.commit()
        return user_schema.dump(user), 201

class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user_schema.dump(user), 200

    @jwt_required
    @permission_required('salaries', 'edit')
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        parser = reqparse.RequestParser()
        parser.add_argument('salary', type=float)
        parser.add_argument('stipend', type=float)
        args = parser.parse_args()
        if args['salary'] is not None:
            user.salary = args['salary']
        if args['stipend'] is not None:
            user.stipend = args['stipend']
        db.session.commit()
        return user_schema.dump(user), 200
