def permission_required(permission, action):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            try:
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                user = User.query.get(data['user_id'])
                if not user or not user.permissions:
                    return jsonify({'message': 'Insufficient permissions!'}), 403
                perm = user.permissions.get(permission, {})
                if not perm.get(action, False):
                    return jsonify({'message': 'Insufficient permissions!'}), 403
            except Exception:
                return jsonify({'message': 'Token is invalid!'}), 401
            return f(*args, **kwargs)
        return decorated
    return decorator
from functools import wraps
from flask import request, jsonify
import jwt
from flask import current_app
from app.models.user import User

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            try:
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                user = User.query.get(data['user_id'])
                if not user or user.role not in roles:
                    return jsonify({'message': 'Insufficient permissions!'}), 403
            except Exception:
                return jsonify({'message': 'Token is invalid!'}), 401
            return f(*args, **kwargs)
        return decorated
    return decorator
