from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

import models, schemas, crud, auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EventFlow API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "EventFlow API running"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.AuthResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud.create_user(db, user)
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"token": access_token, "user": new_user}

@app.post("/auth/login", response_model=schemas.AuthResponse)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Reusing UserLogin for login (email/password)
    user = crud.get_user_by_email(db, email=user_data.email)
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"token": access_token, "user": user}

@app.get("/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- EVENTS ENDPOINTS ---

@app.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_event = crud.create_event(db, event, current_user.id)
    # Enrich response
    new_event.registration_count = 0
    new_event.is_registered = False
    return new_event

@app.get("/events", response_model=List[schemas.EventResponse])
def list_events(
    search: Optional[str] = None,
    type: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional)
):
    events = crud.get_events(db, search, type, date_from, date_to, page, page_size)
    for event in events:
        event.registration_count = len(event.registrations)
        event.is_registered = crud.is_user_registered(db, event.id, current_user.id if current_user else None)
    return events

@app.get("/events/{event_id}", response_model=schemas.EventResponse)
def get_event_detail(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional)
):
    event = crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.registration_count = len(event.registrations)
    event.is_registered = crud.is_user_registered(db, event.id, current_user.id if current_user else None)
    return event

@app.delete("/events/{event_id}")
def delete_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your event")
    
    crud.delete_event(db, event_id)
    return {"detail": "Event deleted successfully"}

# --- REGISTRATIONS ENDPOINTS ---

@app.post("/events/{event_id}/register", response_model=schemas.RegistrationResponse)
def register_for_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if crud.is_user_registered(db, event_id, current_user.id):
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    return crud.create_registration(db, event_id, current_user.id)

@app.delete("/events/{event_id}/register")
def unregister_from_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not crud.is_user_registered(db, event_id, current_user.id):
        raise HTTPException(status_code=400, detail="Not registered for this event")
    
    crud.delete_registration(db, event_id, current_user.id)
    return {"detail": "Unregistered successfully"}

@app.get("/events/{event_id}/registrations", response_model=List[schemas.RegistrationResponse])
def list_event_registrations(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return crud.get_event_registrations(db, event_id)

@app.get("/my/registrations", response_model=List[schemas.EventResponse])
def list_my_registrations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    registrations = crud.get_user_registrations(db, current_user.id)
    events = []
    for reg in registrations:
        event = reg.event
        event.registration_count = len(event.registrations)
        event.is_registered = True
        events.append(event)
    return events
