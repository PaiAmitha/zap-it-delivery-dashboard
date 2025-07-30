
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging
from src.infrastructure.db import SessionLocal
from src.domain.models import Project

projects_bp = Blueprint('projects', __name__)

# --- Project CRUD Endpoints ---
@projects_bp.route('/projects', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_projects():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    projects = db.query(Project).all()
    data = [p.to_dict() for p in projects]
    db.close()
    return jsonify({'projects': data})

@projects_bp.route('/projects', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_project():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    project = Project(**data)
    db.add(project)
    db.commit()
    db.refresh(project)
    result = project.to_dict()
    db.close()
    return jsonify(result), 201

@projects_bp.route('/projects/<int:project_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_by_id(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        db.close()
        return jsonify({'error': 'Project not found'}), 404
    data = project.to_dict()
    db.close()
    return jsonify(data)

@projects_bp.route('/projects/<int:project_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_project(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        db.close()
        return jsonify({'error': 'Project not found'}), 404
    for key, value in data.items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    result = project.to_dict()
    db.close()
    return jsonify(result)

@projects_bp.route('/projects/<int:project_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_project(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        db.close()
        return jsonify({'error': 'Project not found'}), 404
    db.delete(project)
    db.commit()

# --- Project Milestones Endpoint ---
@projects_bp.route('/projects/<int:project_id>/milestones', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_milestones(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    milestones = []
    if project and hasattr(project, 'milestones'):
        milestones = project.milestones if isinstance(project.milestones, list) else []
    db.close()
    return jsonify({'milestones': milestones})

# --- Project Risks Endpoint ---
@projects_bp.route('/projects/<int:project_id>/risks', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_risks(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    risks = []
    if project and hasattr(project, 'risks'):
        risks = project.risks if isinstance(project.risks, list) else []
    db.close()
    return jsonify({'risks': risks})

# --- Project Team Members Endpoint ---
@projects_bp.route('/projects/<int:project_id>/team-members', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_team_members(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    team_members = []
    if project and hasattr(project, 'teams'):
        team_members = project.teams if isinstance(project.teams, list) else []
    db.close()
    return jsonify({'teamMembers': team_members})

# --- Project Engineering Metrics Endpoint ---
@projects_bp.route('/projects/<int:project_id>/engineering-metrics', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_engineering_metrics(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    import json
    metrics = {'development': {}, 'qa': {}}
    if project and hasattr(project, 'engineering_metrics') and project.engineering_metrics:
        try:
            parsed = json.loads(project.engineering_metrics)
            metrics['development'] = parsed.get('development', {})
            metrics['qa'] = parsed.get('qa', {})
        except Exception:
            pass
    db.close()
    return jsonify({'engineeringMetrics': metrics})

