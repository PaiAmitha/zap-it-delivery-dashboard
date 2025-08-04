


from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, Table
from sqlalchemy.orm import relationship

from src.domain.models.base import Base

# Association tables for many-to-many relationships
project_resource = Table('project_resource', Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('resource_id', Integer, ForeignKey('resources.id'))
)



class Resource(Base):
    __tablename__ = 'resources'
    id = Column(Integer, primary_key=True)
    resource_id = Column(String, unique=True)
    employee_id = Column(String, unique=True, nullable=False)
    fullName = Column(String, nullable=False)
    designation = Column(String)
    department = Column(String)
    seniorityLevel = Column(String)
    experience = Column(Integer)
    location = Column(String)
    joiningDate = Column(Date)
    employmentType = Column(String)
    reportingManager = Column(String)

    skills = Column(String)  # Comma-separated string
    billableStatus = Column(Boolean)
    currentEngagement = Column(String)
    engagementDescription = Column(String)
    engagementStartDate = Column(Date)
    engagementEndDate = Column(Date)
    agingInNonBillable = Column(Integer)
    currentBenchStatus = Column(Boolean)
    engagementDetail = Column(String)

    isIntern = Column(Boolean)
    internshipStartDate = Column(Date)
    internshipEndDate = Column(Date)
    assignedProject = Column(String)
    mentorName = Column(String)
    stipend = Column(Float)

    monthlySalaryCost = Column(Float)
    billingRate = Column(Float)
    monthlyRevenueGenerated = Column(Float)
    costCenter = Column(String)
    totalYTDCost = Column(Float)
    totalYTDRevenue = Column(Float)

    # Relationships
    projects = relationship('Project', secondary=project_resource, back_populates='resources')

    def to_dict(self):
        return {
            'resourceId': self.resource_id,
            'employeeId': self.employee_id,
            'fullName': self.fullName,
            'designation': self.designation,
            'department': self.department,
            'seniorityLevel': self.seniorityLevel,
            'experience': self.experience,
            'location': self.location,
            'joiningDate': self.joiningDate.isoformat() if self.joiningDate else None,
            'employmentType': self.employmentType,
            'reportingManager': self.reportingManager,
            'skills': self.skills.split(',') if self.skills else [],
            'billableStatus': self.billableStatus,
            'currentEngagement': self.currentEngagement,
            'engagementDescription': self.engagementDescription,
            'engagementStartDate': self.engagementStartDate.isoformat() if self.engagementStartDate else None,
            'engagementEndDate': self.engagementEndDate.isoformat() if self.engagementEndDate else None,
            'agingInNonBillable': self.agingInNonBillable,
            'currentBenchStatus': self.currentBenchStatus,
            'engagementDetail': self.engagementDetail,
            'isIntern': self.isIntern,
            'internshipStartDate': self.internshipStartDate.isoformat() if self.internshipStartDate else None,
            'internshipEndDate': self.internshipEndDate.isoformat() if self.internshipEndDate else None,
            'assignedProject': self.assignedProject,
            'mentorName': self.mentorName,
            'stipend': self.stipend,
            'monthlySalaryCost': self.monthlySalaryCost,
            'billingRate': self.billingRate,
            'monthlyRevenueGenerated': self.monthlyRevenueGenerated,
            'costCenter': self.costCenter,
            'totalYTDCost': self.totalYTDCost,
            'totalYTDRevenue': self.totalYTDRevenue
        }

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    status = Column(String)
    priority = Column(String)
    budget = Column(Float)
    required_skills = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    health_status = Column(String)
    profit_margin = Column(Float)
    utilization_rate = Column(Float)
    resources = relationship('Resource', secondary=project_resource, back_populates='projects')
    # employees = relationship('Employee', secondary=project_employee, back_populates='projects')
    escalations = relationship('Escalation', back_populates='project')
    finances = relationship('Finance', back_populates='project')



class Intern(Base):
    __tablename__ = 'interns'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    duration = Column(String)
    department = Column(String)
    mentor = Column(String)
    conversion_status = Column(String)
    status = Column(String)
    feedback = Column(String)
    education = Column(String)
    stipend = Column(Float)
    conversion_potential = Column(String)


class Escalation(Base):
    __tablename__ = 'escalations'
    id = Column(Integer, primary_key=True, autoincrement=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    escalation_type = Column(String)
    escalation_date = Column(Date)
    resolution_date = Column(Date)
    resolution_status = Column(String)
    escalation_notes = Column(String)
    impact = Column(String)
    severity = Column(String)
    actions_taken = Column(String)
    follow_up = Column(String)
    title = Column(String)
    customer = Column(String)
    project = Column(String)
    description = Column(String)
    date_raised = Column(Date)
    resolution_eta = Column(Date)
    risk_level = Column(String)
    project = relationship('Project', back_populates='escalations')
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Milestone(Base):
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'progress': self.progress,
            'status': self.status,
            'date': self.date.isoformat() if self.date else None,
            'project_id': self.project_id
        }
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    progress = Column(Integer)
    status = Column(String)
    date = Column(Date)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'progress': self.progress,
            'status': self.status,
            'date': self.date.isoformat() if self.date else None,
            'project_id': self.project_id
        }

class Risk(Base):
    def to_dict(self):
        return {
            'id': self.id,
            'issue': self.issue,
            'owner': self.owner,
            'priority': self.priority,
            'status': self.status,
            'project_id': self.project_id
        }
    __tablename__ = 'risks'
    id = Column(Integer, primary_key=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

    def to_dict(self):
        return {
            'id': self.id,
            'issue': self.issue,
            'owner': self.owner,
            'priority': self.priority,
            'status': self.status,
            'project_id': self.project_id
        }

class KPI(Base):
    __tablename__ = 'kpis'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    value = Column(Float)
    subtitle = Column(String)
    trend = Column(String)
    icon = Column(String)
    entity_type = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

class Sprint(Base):
    __tablename__ = 'sprints'
    id = Column(Integer, primary_key=True)
    sprint_number = Column(Integer)
    velocity = Column(Float)
    predictability = Column(Float)
    defect_leakage = Column(Float)
    on_time_delivery = Column(Float)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

    def to_dict(self):
        return {
            'id': self.id,
            'sprintNumber': self.sprint_number,
            'velocity': self.velocity,
            'predictability': self.predictability,
            'defectLeakage': self.defect_leakage,
            'onTimeDelivery': self.on_time_delivery,
            'project_id': self.project_id
        }

class TeamMember(Base):
    __tablename__ = 'team_members'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String)
    department = Column(String)
    location = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'department': self.department,
            'location': self.location,
            'project_id': self.project_id
        }

class EngineeringMetric(Base):
    __tablename__ = 'engineering_metrics'
    id = Column(Integer, primary_key=True)
    development = Column(String)  # JSON string
    qa = Column(String)           # JSON string
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'development': json.loads(self.development) if self.development else {},
            'qa': json.loads(self.qa) if self.qa else {},
            'project_id': self.project_id
        }
class Finance(Base):
    __tablename__ = 'finance'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='finances')
    sow_value = Column(Float)
    billing_rate = Column(Float)
    actual_cost_to_date = Column(Float)
    billable_resources = Column(Integer)
    non_billable_resources = Column(Integer)
    shadow_resources = Column(Integer)
    monthly_burn = Column(Float)
    projected_completion = Column(String)
    net_position = Column(Float)
    health_status = Column(String)
    profit_margin = Column(Float)
    utilization_rate = Column(Float)
    billable_cost = Column(Float)
    non_billable_cost = Column(Float)
    shadow_cost = Column(Float)
