from flask import Blueprint, jsonify, request, make_response
from flask_cors import cross_origin
import logging
from src.infrastructure.db import SessionLocal
from src.domain.models import Project

projects_bp = Blueprint('projects', __name__)

from src.domain.models.sprint import Sprint

# --- Project Sprints Endpoints ---
@projects_bp.route('/projects/<int:project_id>/sprints', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def project_sprints(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        if request.method == 'GET':
            sprints = db.query(Sprint).filter(Sprint.project_id == project_id).all()
            sprints_data = []
            for s in sprints:
                try:
                    sprints_data.append({
                        'id': s.id,
                        'sprintNumber': s.sprint_number,
                        'name': s.name,
                        'velocity': s.velocity,
                        'predictability': s.predictability,
                        'defectLeakage': s.defect_leakage,
                        'onTimeDelivery': s.on_time_delivery,
                        'startDate': s.start_date.isoformat() if s.start_date else None,
                        'endDate': s.end_date.isoformat() if s.end_date else None,
                        'plannedStoryPoints': s.planned_story_points,
                        'completedStoryPoints': s.completed_story_points,
                        'testCasesExecuted': s.test_cases_executed,
                        'testCasesPassed': s.test_cases_passed,
                        'createdAt': s.created_at.isoformat() if s.created_at else None,
                        'updatedAt': s.updated_at.isoformat() if s.updated_at else None
                    })
                except Exception as sprint_err:
                    logging.error(f"Sprint serialization error: {s.id} {s.name} {sprint_err}")
                    continue
            return jsonify({'sprints': sprints_data})
        elif request.method == 'POST':
            data = request.get_json()
            sprint = Sprint(
                project_id=project_id,
                sprint_number=data.get('sprintNumber'),
                name=data.get('name'),
                start_date=data.get('startDate'),
                end_date=data.get('endDate'),
                velocity=data.get('velocity'),
                predictability=data.get('predictability'),
                defect_leakage=data.get('defectLeakage'),
                on_time_delivery=data.get('onTimeDelivery'),
                planned_story_points=data.get('plannedStoryPoints'),
                completed_story_points=data.get('completedStoryPoints'),
                test_cases_executed=data.get('testCasesExecuted'),
                test_cases_passed=data.get('testCasesPassed'),
                created_at=data.get('createdAt'),
                updated_at=data.get('updatedAt')
            )
            db.add(sprint)
            db.commit()
            db.refresh(sprint)
            result = {
                'id': sprint.id,
                'sprintNumber': sprint.sprint_number,
                'name': sprint.name,
                'velocity': sprint.velocity,
                'predictability': sprint.predictability,
                'defectLeakage': sprint.defect_leakage,
                'onTimeDelivery': sprint.on_time_delivery,
                'startDate': sprint.start_date.isoformat() if sprint.start_date else None,
                'endDate': sprint.end_date.isoformat() if sprint.end_date else None,
                'plannedStoryPoints': sprint.planned_story_points,
                'completedStoryPoints': sprint.completed_story_points,
                'testCasesExecuted': sprint.test_cases_executed,
                'testCasesPassed': sprint.test_cases_passed,
                'createdAt': sprint.created_at.isoformat() if sprint.created_at else None,
                'updatedAt': sprint.updated_at.isoformat() if sprint.updated_at else None
            }
            return jsonify(result), 201
    except Exception as e:
        import traceback
        print("Error in project_sprints:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project Details Endpoint ---
@projects_bp.route('/projects/<int:project_id>/details', methods=['GET', 'OPTIONS'])
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"], methods=["GET", "OPTIONS"])
def get_project_details(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        data = project.to_dict()
        # Fetch analytics and team members
        from src.domain.models import Milestone, Risk
        from src.domain.models.resource import Resource
        # Milestones
        milestones = db.query(Milestone).filter(Milestone.project_id == project_id).all()
        data['milestones'] = [m.to_dict() for m in milestones]
        # Risks
        risks = db.query(Risk).filter(Risk.project_id == project_id).all()
        data['risks'] = [r.to_dict() for r in risks]
        # Team Members
        team_members = db.query(Resource).filter(Resource.project_name == str(project_id)).all()
        data['teamMembers'] = [r.to_dict() for r in team_members]
        # Engineering Metrics
        import json
        metrics = {'development': {}, 'qa': {}}
        if hasattr(project, 'engineering_metrics') and project.engineering_metrics:
            try:
                parsed = json.loads(project.engineering_metrics)
                metrics['development'] = parsed.get('development', {})
                metrics['qa'] = parsed.get('qa', {})
            except Exception:
                pass
        data['engineeringMetrics'] = metrics
        return jsonify({'project': data})
    except Exception as e:
        import traceback
        print("Error in get_project_details:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project CRUD Endpoints ---
@projects_bp.route('/projects', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_projects():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        projects = db.query(Project).all()
        data = [p.to_dict() for p in projects]
        response = make_response(jsonify({'projects': data}))
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    except Exception as e:
        import traceback
        print("Error in get_projects:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@projects_bp.route('/projects', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_project():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        data = request.get_json()
        project = Project(**data)
        db.add(project)
        db.commit()
        db.refresh(project)
        result = project.to_dict()
        return jsonify(result), 201
    except Exception as e:
        import traceback
        print("Error in create_project:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@projects_bp.route('/projects/<int:project_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_by_id(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        data = project.to_dict()
        return jsonify(data)
    except Exception as e:
        import traceback
        print("Error in get_project_by_id:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@projects_bp.route('/projects/<int:project_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_project(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        data = request.get_json()
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        for key, value in data.items():
            setattr(project, key, value)
        db.commit()
        db.refresh(project)
        result = project.to_dict()
        return jsonify(result)
    except Exception as e:
        import traceback
        print("Error in update_project:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@projects_bp.route('/projects/<int:project_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_project(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        db.delete(project)
        db.commit()
        return jsonify({'message': 'Project deleted'})
    except Exception as e:
        import traceback
        print("Error in delete_project:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project Milestones Endpoint ---
@projects_bp.route('/projects/<int:project_id>/milestones', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_milestones(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        milestones = []
        from src.domain.models import Milestone
        ms = db.query(Milestone).filter(Milestone.project_id == project_id).all()
        milestones = [m.to_dict() for m in ms]
        return jsonify({'milestones': milestones})
    except Exception as e:
        import traceback
        print("Error in get_project_milestones:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project Risks Endpoint ---
@projects_bp.route('/projects/<int:project_id>/risks', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_risks(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        risks = []
        from src.domain.models import Risk
        rs = db.query(Risk).filter(Risk.project_id == project_id).all()
        risks = [r.to_dict() for r in rs]
        return jsonify({'risks': risks})
    except Exception as e:
        import traceback
        print("Error in get_project_risks:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project Team Members Endpoint ---
@projects_bp.route('/projects/<int:project_id>/team-members', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_team_members(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
        from src.domain.models.resource import Resource
        # Query resources assigned to this project
        team_members = db.query(Resource).filter(Resource.project_name == str(project_id)).all()
        team_members_data = [r.to_dict() for r in team_members]
        return jsonify({'teamMembers': team_members_data})
    except Exception as e:
        import traceback
        print("Error in get_project_team_members:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# --- Project Engineering Metrics Endpoint ---
@projects_bp.route('/projects/<int:project_id>/engineering-metrics', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_project_engineering_metrics(project_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    try:
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
        return jsonify({'engineeringMetrics': metrics})
    except Exception as e:
        import traceback
        print("Error in get_project_engineering_metrics:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

