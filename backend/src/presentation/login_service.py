import json
from flask import Blueprint, request, jsonify
import os

login_bp = Blueprint('login', __name__)

USERDATA_PATH = os.path.join(os.path.dirname(__file__), '../../..', 'src', 'data', 'userData.json')

def load_users():
    with open(USERDATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data.get('users', [])

@login_bp.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # NOTE: Password check is skipped for demo; add real password logic for production
    users = load_users()
    user = next((u for u in users if u['email'] == email), None)
    if user:
        return jsonify({
            'token': 'dummy-token',
            'user': user
        })
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
