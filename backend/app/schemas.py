from datetime import datetime
from typing import Optional, List

from sqlmodel import SQLModel


# ---------- AUTH / USER ----------

class UserCreate(SQLModel):
    email: str
    password: str


class UserRead(SQLModel):
    id: int
    email: str
    full_name: Optional[str] = None
    sport_interest: Optional[str] = None
    skill_level: Optional[str] = None
    location: Optional[str] = None


class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    sport_interest: Optional[str] = None
    skill_level: Optional[str] = None
    location: Optional[str] = None


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# ---------- MATCHES ----------

class MatchCreate(SQLModel):
    sport_type: str
    date_time: datetime
    location: str
    max_players: int


class MatchRead(SQLModel):
    id: int
    sport_type: str
    date_time: datetime
    location: str
    max_players: int
    status: str
    created_by: int
    current_players: int


class MatchDetail(MatchRead):
    participants: List[UserRead]


# ---------- CHAT ----------

class ChatMessageCreate(SQLModel):
    message: str


class ChatMessageRead(SQLModel):
    id: int
    match_id: int
    sender_id: int
    message: str
    created_at: datetime


# ---------- NOTIFICATIONS ----------

class NotificationRead(SQLModel):
    id: int
    title: str
    message: str
    created_at: datetime
    read_at: Optional[datetime] = None
