from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging
from datetime import datetime, timedelta
from collections import Counter
from src.infrastructure.db import SessionLocal
from src.domain.models import Resource, Project, Intern
from src.domain.models.escalation import Escalation
from src.domain.models.kpi import KPI

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/dashboard', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_dashboard():
    try:
        session = SessionLocal()
        # Fetch all projects
        projects = session.query(Project).all()
        project_cards = []
        for project in projects:
            # Fetch KPIs from KPI table for this project
            kpi_objs = session.query(KPI).filter(KPI.project_id == project.id).all()
            kpis = []
            for kpi in kpi_objs:
                kpis.append({
                    'name': getattr(kpi, 'name', ''),
                    'title': getattr(kpi, 'title', ''),
                    'value': getattr(kpi, 'value', None)
                })
            project_cards.append({
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'customer': project.customer,
                'status': project.status,
                'healthStatus': getattr(project, 'health_status', 'Unknown'),
                'onTimePercentage': getattr(project, 'on_time_percentage', None),
                'progress': getattr(project, 'progress', 0),
                'teamSize': getattr(project, 'team_size', 0),
                'kpis': kpis
            })
        # Active projects: filter by status
        active_projects = [p for p in project_cards if p['status'] in ['On Track', 'At Risk', 'Critical', 'Delayed', 'active', 'Active']]
        # KPIs placeholder (can be expanded)
        dashboard_kpis = {
            'totalProjects': len(project_cards),
            'activeProjects': len(active_projects),
            'criticalProjects': len([p for p in project_cards if p['status'] == 'Critical']),
            'onTrackProjects': len([p for p in project_cards if p['status'] == 'On Track'])
        }
        return jsonify({
            'projectCards': project_cards,
            'active_projects': active_projects,
            'dashboard_kpis': dashboard_kpis
        })
    except Exception as e:
        logging.error(f"Dashboard error: {e}")
        return jsonify({'error': str(e)}), 500

