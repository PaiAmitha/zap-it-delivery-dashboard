from flask import request
from flask_restful import Resource
from app.models.user import User
from app import db
import jwt
import datetime
from werkzeug.security import check_password_hash
from flask import current_app

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return {'message': 'Invalid credentials'}, 401
        payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        }
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        return {'token': token, 'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'department': user.department,
            'avatar': user.avatar,
            'permissions': user.permissions
        }}, 200
