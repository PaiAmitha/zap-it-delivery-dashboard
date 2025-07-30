
# --- Escalation Endpoints for Frontend Integration ---
# GET /escalations                -> List all escalations (returns { escalations: [...] })
# POST /escalations               -> Create escalation (returns { escalation: {...} })
# GET /escalations/<id>           -> Get single escalation (returns { escalation: {...} })
# PUT /escalations/<id>           -> Update escalation (returns { escalation: {...} })
# DELETE /escalations/<id>        -> Delete escalation (returns { deleted: true, id: ... })

# To integrate other endpoints, use the same pattern:
# - Wrap list responses in arrays (e.g., { resources: [...] })
# - Wrap single item responses in objects (e.g., { resource: {...} })
# - For deletes, return { deleted: true, id: ... }

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging
from src.infrastructure.db import SessionLocal
from src.domain.models.escalation import Escalation

escalation_bp = Blueprint('escalations', __name__)

# --- Escalation CRUD Endpoints ---
@escalation_bp.route('/escalations', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_escalations():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    escalations = db.query(Escalation).all()
    # Ensure frontend compatibility: wrap in 'escalations' array
    data = [e.to_dict() for e in escalations]
    db.close()
    return jsonify({'escalations': data})

@escalation_bp.route('/escalations', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_escalation():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    escalation = Escalation(**data)
    db.add(escalation)
    db.commit()
    db.refresh(escalation)
    result = escalation.to_dict()
    db.close()
    # Wrap in 'escalation' for frontend compatibility
    return jsonify({'escalation': result}), 201

@escalation_bp.route('/escalations/<int:escalation_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_escalation_by_id(escalation_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    escalation = db.query(Escalation).filter(Escalation.id == escalation_id).first()
    if not escalation:
        db.close()
        return jsonify({'error': 'Escalation not found'}), 404
    data = escalation.to_dict()
    db.close()
    # Wrap in 'escalation' for frontend compatibility
    return jsonify({'escalation': data})

@escalation_bp.route('/escalations/<int:escalation_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_escalation(escalation_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    escalation = db.query(Escalation).filter(Escalation.id == escalation_id).first()
    if not escalation:
        db.close()
        return jsonify({'error': 'Escalation not found'}), 404
    for key, value in data.items():
        setattr(escalation, key, value)
    db.commit()
    db.refresh(escalation)
    result = escalation.to_dict()
    db.close()
    # Wrap in 'escalation' for frontend compatibility
    return jsonify({'escalation': result})

@escalation_bp.route('/escalations/<int:escalation_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_escalation(escalation_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    escalation = db.query(Escalation).filter(Escalation.id == escalation_id).first()
    if not escalation:
        db.close()
        return jsonify({'error': 'Escalation not found'}), 404
    db.delete(escalation)
    db.commit()
    db.close()
    # Return deleted id for UI
    return jsonify({'deleted': True, 'id': escalation_id})
