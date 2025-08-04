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
                # Safely handle None for numeric fields
                on_time_percentage = getattr(project, 'on_time_percentage', None)
                if on_time_percentage is None:
                    on_time_percentage = 0
                progress = getattr(project, 'progress', None)
                if progress is None:
                    progress = 0
                team_size = getattr(project, 'team_size', None)
                if team_size is None:
                    team_size = 0
            # Safely handle None for numeric fields
            on_time_percentage = getattr(project, 'on_time_percentage', None)
            if on_time_percentage is None:
                on_time_percentage = 0
            progress = getattr(project, 'progress', None)
            if progress is None:
                progress = 0
            team_size = getattr(project, 'team_size', None)
            if team_size is None:
                team_size = 0
            project_cards.append({
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'customer': project.customer,
                'status': project.status,
                'healthStatus': getattr(project, 'health_status', 'Unknown'),
                'onTimePercentage': on_time_percentage,
                'progress': progress,
                'teamSize': team_size,
                'kpis': kpis
            })
        # Active projects: filter by status
        active_projects = [p for p in project_cards if p['status'] in ['On Track', 'At Risk', 'Critical', 'Delayed', 'active', 'Active']]
        dashboard_kpis = {
            'totalProjects': len(project_cards),
            'activeProjects': len(active_projects),
            'criticalProjects': len([p for p in project_cards if p['status'] == 'Critical']),
            'onTrackProjects': len([p for p in project_cards if p['status'] == 'On Track'])
        }

        # Resource analytics aggregation
        resources = session.query(Resource).all()
        total_resources = len(resources)
        active_resources = len([r for r in resources if getattr(r, 'status', None) and getattr(r, 'status').lower() == 'active'])
        non_billable_resources = [r for r in resources if not getattr(r, 'billable_status', True)]
        non_billable_resources_count = len(non_billable_resources)
        utilization_rate = round((active_resources / total_resources) * 100, 1) if total_resources else 0
        non_billable_cost_drain = sum((getattr(r, 'monthly_cost', 0) or 0) for r in non_billable_resources)
        # Skills analytics
        skills = []
        for r in resources:
            skills.extend(r.skills.split(',') if r.skills else [])
        skill_counts = Counter(skills)
        skillData = [{'skill': k, 'count': v} for k, v in skill_counts.items()]
        # Seniority analytics
        seniority_counts = Counter([r.seniority_level for r in resources if r.seniority_level])
        seniorityData = [{'seniority': k, 'count': v} for k, v in seniority_counts.items()]
        # Bench aging analytics
        agingData = []
        for r in resources:
            if r.bench_aging_bucket:
                agingData.append({'bucket': r.bench_aging_bucket, 'count': r.bench_days if r.bench_days is not None else 0, 'riskLevel': r.bench_risk_level or ''})
        bench_aging_data = agingData if agingData else [
            {"bucket": "< 30", "count": 5, "riskLevel": "low"},
            {"bucket": "30-59", "count": 3, "riskLevel": "medium"},
            {"bucket": "60-89", "count": 2, "riskLevel": "high"},
            {"bucket": ">= 90", "count": 1, "riskLevel": "critical"},
        ]

        # Department breakdown
        department_counts = Counter([r.department for r in resources if r.department])
        total_departments = sum(department_counts.values())
        departmentData = [
            {
                'name': k,
                'count': v,
                'percentage': round((v / total_departments) * 100) if total_departments else 0
            }
            for k, v in department_counts.items()
        ]

        # Designation breakdown
        designation_counts = Counter([r.designation for r in resources if r.designation])
        designationData = [{'name': k, 'count': v} for k, v in designation_counts.items()]

        # Location breakdown
        location_counts = Counter([r.location for r in resources if r.location])
        total_locations = sum(location_counts.values())
        locationData = [
            {
                'name': k,
                'count': v,
                'percentage': round((v / total_locations) * 100) if total_locations else 0
            }
            for k, v in location_counts.items()
        ]

        # Monthly growth breakdown (by joining_date)
        monthly_growth_data = []
        month_map = {}
        for r in resources:
            if r.joining_date:
                month = r.joining_date.strftime('%b %Y')
                month_map[month] = month_map.get(month, 0) + 1
        for month, count in sorted(month_map.items()):
            monthly_growth_data.append({'month': month, 'count': count})

        # Engagement analytics (by current_engagement)
        engagement_counts = Counter([r.current_engagement for r in resources if r.current_engagement])
        engagementData = [{'engagement': k, 'count': v} for k, v in engagement_counts.items()]

        # Interns
        internsData = [r.to_dict() for r in resources if getattr(r, 'is_intern', False)]

        # Upcoming releases (by release_date)
        upcomingReleases = [r.to_dict() for r in resources if r.release_date and r.release_date > datetime.now().date()]

        # Billable Resources Analytics for BillableResourcesKPI
        billable_resources = [r for r in resources if getattr(r, 'billable_status', False)]
        billable_resources_data = [r.to_dict() for r in billable_resources]

        # Utilization Trend (dummy: monthly utilization for billable resources)
        utilization_trend = []
        utilization_by_month = {}
        for r in billable_resources:
            if r.joining_date:
                month = r.joining_date.strftime('%b %Y')
                utilization = getattr(r, 'utilization_rate', 0) or getattr(r, 'utilization_percentage', 0) or 0
                if month not in utilization_by_month:
                    utilization_by_month[month] = []
                utilization_by_month[month].append(utilization)
        for month, utils in sorted(utilization_by_month.items()):
            avg_util = round(sum(utils) / len(utils), 1) if utils else 0
            utilization_trend.append({'month': month, 'average_utilization': avg_util})

        # Client-wise Resource Allocation
        client_allocation = []
        client_counts = Counter([r.client for r in billable_resources if getattr(r, 'client', None)])
        total_billable = len(billable_resources)
        for client, count in client_counts.items():
            client_allocation.append({
                'client': client,
                'count': count,
                'percentage': round((count / total_billable) * 100) if total_billable else 0
            })

        # Productivity vs Allocation Trend (dummy: monthly productivity score for billable resources)
        productivity_trend = []
        productivity_by_month = {}
        for r in billable_resources:
            if r.joining_date:
                month = r.joining_date.strftime('%b %Y')
                productivity = getattr(r, 'productivity_score', 0) or 0
                if month not in productivity_by_month:
                    productivity_by_month[month] = []
                productivity_by_month[month].append(productivity)
        for month, scores in sorted(productivity_by_month.items()):
            avg_prod = round(sum(scores) / len(scores), 1) if scores else 0
            productivity_trend.append({'month': month, 'average_productivity': avg_prod})

        # Patch: Format analytics arrays for frontend expectations
        # Weekly Utilization Trend
        utilization_trend_chart = [
            {'week': item['month'], 'utilization': item['average_utilization']} for item in utilization_trend
        ]
        # Client-wise Resource Allocation
        client_allocation_chart = [
            {'client': item['client'], 'resources': item['count']} for item in client_allocation
        ]
        # Productivity vs Allocation Trend
        productivity_trend_chart = [
            {'month': item['month'], 'productivity': item['average_productivity'], 'allocation': item['average_productivity']} for item in productivity_trend
        ]
        # Billable Resources Detail
        billable_resources_detail = []
        for r in billable_resources:
            billable_resources_detail.append({
                'full_name': getattr(r, 'full_name', None),
                'designation': getattr(r, 'designation', None),
                'client': getattr(r, 'client', None),
                'utilization_rate': getattr(r, 'utilization_rate', None) or getattr(r, 'utilization_percentage', None),
                'billing_rate': getattr(r, 'billing_rate', None),
                'productivity': getattr(r, 'productivity_score', None)
            })

        # Non-Billable Resources Analytics for NonBillableResourcesKPI
        # Bench Reason Distribution
        bench_reason_data = []
        bench_reason_counts = Counter([r.bench_reason for r in non_billable_resources if getattr(r, 'bench_reason', None)])
        for reason, count in bench_reason_counts.items():
            bench_reason_data.append({
                'reason': reason,
                'count': count,
                'cost': sum(getattr(r, 'monthly_cost', 0) or 0 for r in non_billable_resources if getattr(r, 'bench_reason', None) == reason)
            })

        # Bench Aging Analysis
        bench_aging_data_chart = []
        for item in bench_aging_data:
            bench_aging_data_chart.append({
                'bucket': item.get('bucket'),
                'count': item.get('count'),
                'cost': sum(getattr(r, 'monthly_cost', 0) or 0 for r in non_billable_resources if getattr(r, 'bench_aging_bucket', None) == item.get('bucket')),
                'riskLevel': item.get('riskLevel')
            })

        # Weekly Bench Movement Report
        weekly_movement_data = []
        # Dummy: group by week of bench_start_date
        week_map = {}
        for r in non_billable_resources:
            if r.bench_start_date:
                week = r.bench_start_date.strftime('%U %Y')
                week_map[week] = week_map.get(week, 0) + 1
        for week, count in sorted(week_map.items()):
            weekly_movement_data.append({'week': week, 'moved': count, 'added': count})

        # Location-wise Distribution
        non_billable_location_distribution = []
        location_counts = Counter([r.location for r in non_billable_resources if getattr(r, 'location', None)])
        for location, count in location_counts.items():
            non_billable_location_distribution.append({
                'location': location,
                'count': count,
                'cost': sum(getattr(r, 'monthly_cost', 0) or 0 for r in non_billable_resources if getattr(r, 'location', None) == location)
            })

        # Non-billable resources list
        non_billable_resources_list = []
        for r in non_billable_resources:
            non_billable_resources_list.append({
                'name': getattr(r, 'full_name', None),
                'designation': getattr(r, 'designation', None),
                'reason': getattr(r, 'bench_reason', None),
                'benchDays': getattr(r, 'bench_days', None),
                'location': getattr(r, 'location', None),
                'monthlyCost': getattr(r, 'monthly_cost', None),
                'suggestion': getattr(r, 'suggestion', None)
            })

        # Avg Bench Days
        avg_bench_days = 0
        if non_billable_resources:
            total_bench_days = sum(getattr(r, 'bench_days', 0) or 0 for r in non_billable_resources)
            avg_bench_days = round(total_bench_days / len(non_billable_resources), 1)
        # Reallocation Opportunities
        reallocation_opportunities = len([r for r in non_billable_resources if getattr(r, 'reallocation_opportunity', False)])

        # Interns Analytics for InternsKPI
        interns = [r for r in resources if getattr(r, 'is_intern', False)]
        total_interns = len(interns)
        interns_assigned = len([r for r in interns if getattr(r, 'assigned_project', None)])
        interns_unassigned = total_interns - interns_assigned
        intern_conversion_rate = round((interns_assigned / total_interns) * 100, 1) if total_interns else 0
        avg_learning_hours = round(sum(getattr(r, 'learning_hours', 0) or 0 for r in interns) / total_interns, 1) if total_interns else 0
        avg_productive_hours = round(sum(getattr(r, 'productive_hours', 0) or 0 for r in interns) / total_interns, 1) if total_interns else 0
        # Conversion funnel
        intern_conversion_funnel = [
            {'name': 'Total', 'value': total_interns, 'fill': '#8884d8'},
            {'name': 'Assigned', 'value': interns_assigned, 'fill': '#82ca9d'},
            {'name': 'Unassigned', 'value': interns_unassigned, 'fill': '#ffc658'}
        ]
        # Monthly conversion
        intern_monthly_conversion = []
        month_map = {}
        for r in interns:
            if getattr(r, 'internship_start_date', None):
                month = r.internship_start_date.strftime('%b %Y')
                month_map[month] = month_map.get(month, 0) + 1
        for month, count in sorted(month_map.items()):
            intern_monthly_conversion.append({'month': month, 'conversionRate': count})
        # Learning vs productive
        intern_learning_vs_productive = []
        for r in interns:
            intern_learning_vs_productive.append({
                'intern': getattr(r, 'full_name', None),
                'learning': getattr(r, 'learning_hours', 0) or 0,
                'productive': getattr(r, 'productive_hours', 0) or 0
            })
        # Location distribution
        intern_location_distribution = []
        location_counts = Counter([r.location for r in interns if getattr(r, 'location', None)])
        for location, count in location_counts.items():
            intern_location_distribution.append({'location': location, 'count': count})
        # Intern details list
        intern_details_list = []
        for r in interns:
            intern_details_list.append({
                'name': getattr(r, 'full_name', None),
                'designation': getattr(r, 'designation', None),
                'project': getattr(r, 'assigned_project', None),
                'mentor': getattr(r, 'mentor_name', None),
                'status': getattr(r, 'status', None),
                'department': getattr(r, 'department', None),
                'learningHours': getattr(r, 'learning_hours', 0) or 0,
                'productiveHours': getattr(r, 'productive_hours', 0) or 0,
                'feedback': getattr(r, 'performance_feedback', None),
                'conversionPotential': getattr(r, 'conversion_potential', None)
            })

        # Financial Overview Analytics for Resource Management
        # Monthly financials
        monthlyFinancials = []
        month_map = {}
        for r in resources:
            if r.joining_date and r.monthly_cost:
                month = r.joining_date.strftime('%b %Y')
                if month not in month_map:
                    month_map[month] = {'total': 0, 'billable': 0, 'nonBillable': 0, 'intern': 0}
                month_map[month]['total'] += r.monthly_cost or 0
                if getattr(r, 'billable_status', False):
                    month_map[month]['billable'] += r.monthly_cost or 0
                elif getattr(r, 'is_intern', False):
                    month_map[month]['intern'] += r.monthly_cost or 0
                else:
                    month_map[month]['nonBillable'] += r.monthly_cost or 0
        for month, data in sorted(month_map.items()):
            monthlyFinancials.append({
                'month': month,
                'total': data['total'],
                'billable': data['billable'],
                'nonBillable': data['nonBillable'],
                'intern': data['intern']
            })
        # YTD totals
        ytdTotals = {'total': 0, 'billable': 0, 'nonBillable': 0, 'intern': 0}
        for r in resources:
            ytdTotals['total'] += r.monthly_cost or 0
            if getattr(r, 'billable_status', False):
                ytdTotals['billable'] += r.monthly_cost or 0
            elif getattr(r, 'is_intern', False):
                ytdTotals['intern'] += r.monthly_cost or 0
            else:
                ytdTotals['nonBillable'] += r.monthly_cost or 0

        return jsonify({
            'projectCards': project_cards,
            'active_projects': active_projects,
            'dashboard_kpis': dashboard_kpis,
            'total_resources': total_resources,
            'active_resources': active_resources,
            'non_billable_resources_count': non_billable_resources_count,
            'utilization_rate': utilization_rate,
            'bench_reason_data': bench_reason_data,
            'bench_aging_data': bench_aging_data_chart,
            'weekly_movement_data': weekly_movement_data,
            'non_billable_location_distribution': non_billable_location_distribution,
            'non_billable_resources_list': non_billable_resources_list,
            'monthly_growth_data': monthly_growth_data,
            'non_billable_cost_drain': non_billable_cost_drain,
            'skillData': skillData,
            'seniorityData': seniorityData,
            'agingData': agingData,
            'departmentData': departmentData,
            'designationData': designationData,
            'locationData': locationData,
            'engagementData': engagementData,
            'internsData': internsData,
            'upcomingReleases': upcomingReleases,
            'billable_resources': billable_resources_detail,
            'billable_resources_count': len(billable_resources_detail),
            'utilization_trend': utilization_trend_chart,
            'client_allocation': client_allocation_chart,
            'productivity_trend': productivity_trend_chart,
            'avg_bench_days': avg_bench_days,
            'reallocation_opportunities': reallocation_opportunities,
            'total_interns': total_interns,
            'interns_assigned': interns_assigned,
            'interns_unassigned': interns_unassigned,
            'intern_conversion_rate': intern_conversion_rate,
            'avg_learning_hours': avg_learning_hours,
            'avg_productive_hours': avg_productive_hours,
            'intern_conversion_funnel': intern_conversion_funnel,
            'intern_monthly_conversion': intern_monthly_conversion,
            'intern_learning_vs_productive': intern_learning_vs_productive,
            'intern_location_distribution': intern_location_distribution,
            'intern_details_list': intern_details_list,
            'monthlyFinancials': monthlyFinancials,
            'ytdTotals': ytdTotals
        })
    except Exception as e:
        logging.error(f"Dashboard error: {e}")
        return jsonify({'error': str(e)}), 500

