from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas, auth

# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Event CRUD
def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(**event.dict(), creator_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(
    db: Session, 
    search: str = None, 
    event_type: str = None, 
    date_from: str = None, 
    date_to: str = None,
    page: int = 1,
    page_size: int = 10
):
    query = db.query(models.Event)
    
    if search:
        query = query.filter(or_(
            models.Event.title.ilike(f"%{search}%"),
            models.Event.description.ilike(f"%{search}%")
        ))
    
    if event_type and event_type.lower() != "all":
        query = query.filter(models.Event.type == event_type.lower())
        
    if date_from:
        query = query.filter(models.Event.date >= date_from)
    
    if date_to:
        query = query.filter(models.Event.date <= date_to)
        
    # Apply pagination
    offset = (page - 1) * page_size
    return query.order_by(models.Event.date.asc()).offset(offset).limit(page_size).all()

def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def delete_event(db: Session, event_id: int):
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False

# Registration CRUD
def create_registration(db: Session, event_id: int, user_id: int):
    db_reg = models.Registration(event_id=event_id, user_id=user_id)
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg

def delete_registration(db: Session, event_id: int, user_id: int):
    db_reg = db.query(models.Registration).filter(
        models.Registration.event_id == event_id,
        models.Registration.user_id == user_id
    ).first()
    if db_reg:
        db.delete(db_reg)
        db.commit()
        return True
    return False

def get_event_registrations(db: Session, event_id: int):
    return db.query(models.Registration).filter(models.Registration.event_id == event_id).all()

def get_user_registrations(db: Session, user_id: int):
    return db.query(models.Registration).filter(models.Registration.user_id == user_id).all()

def is_user_registered(db: Session, event_id: int, user_id: int):
    if not user_id:
        return False
    return db.query(models.Registration).filter(
        models.Registration.event_id == event_id,
        models.Registration.user_id == user_id
    ).count() > 0
