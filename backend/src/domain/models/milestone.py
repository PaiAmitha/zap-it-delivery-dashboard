from src.presentation.extensions import db

class Milestone(db.Model):
    __tablename__ = 'milestones'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.String)
    status = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    progress = db.Column(db.Integer)
    date = db.Column(db.Date)
    milestone_type = db.Column(db.String)
    owner = db.Column(db.String)
    completion_date = db.Column(db.Date)
    notes = db.Column(db.String)
    risk_level = db.Column(db.String)
    # Add more fields as needed for analytics/reporting

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
