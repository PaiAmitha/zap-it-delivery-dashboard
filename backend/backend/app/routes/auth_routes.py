from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies
from werkzeug.security import check_password_hash
from datetime import timedelta

from app.models import User
from app import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    print("User:", user)
    print("Stored password hash:", user.password)

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(
        identity=user.id,  # ✅ Must be a string or int
        expires_delta=timedelta(hours=1)
    )

    response = jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'department': user.department,
            'avatar': user.avatar
        }
    })

    set_access_cookies(response, access_token)
    return response, 200
