
from src.domain.models import Resource, Project, Employee, Intern, Escalation, KPI, Finance
from sqlalchemy.orm import Session

def get_all(model, db: Session):
    return db.query(model).all()

def get_by_id(model, db: Session, id: int):
    return db.query(model).filter(model.id == id).first()

def create_instance(model, db: Session, **kwargs):
    # Only allow valid fields
    valid_fields = {col.name for col in model.__table__.columns}
    filtered_kwargs = {k: v for k, v in kwargs.items() if k in valid_fields}
    # Exclude primary key columns from required fields check
    # Exclude all primary key columns from required fields
    pk_names = {col.name for col in model.__table__.columns if col.primary_key}
    missing_fields = [col.name for col in model.__table__.columns
                     if not col.nullable and col.default is None and col.name not in filtered_kwargs and col.name not in pk_names]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    instance = model(**filtered_kwargs)
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return instance

def update_instance(model, db: Session, id: int, **kwargs):
    instance = db.query(model).filter(model.id == id).first()
    if not instance:
        raise ValueError(f"{model.__name__} with id {id} not found.")
    valid_fields = {col.name for col in model.__table__.columns}
    for key, value in kwargs.items():
        if key in valid_fields:
            setattr(instance, key, value)
        else:
            raise ValueError(f"Invalid field: {key}")
    db.commit()
    db.refresh(instance)
    return instance

def delete_instance(model, db: Session, id: int):
    instance = db.query(model).filter(model.id == id).first()
    db.delete(instance)
    db.commit()
    return instance
