
from src.domain.models import Resource, Project, Employee, Intern, Escalation, KPI, Finance
from sqlalchemy.orm import Session

def get_all(model, db: Session):
    return db.query(model).all()

def get_by_id(model, db: Session, id: int):
    return db.query(model).filter(model.id == id).first()

def create_instance(model, db: Session, **kwargs):
    instance = model(**kwargs)
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return instance

def update_instance(model, db: Session, id: int, **kwargs):
    instance = db.query(model).filter(model.id == id).first()
    for key, value in kwargs.items():
        setattr(instance, key, value)
    db.commit()
    db.refresh(instance)
    return instance

def delete_instance(model, db: Session, id: int):
    instance = db.query(model).filter(model.id == id).first()
    db.delete(instance)
    db.commit()
    return instance
