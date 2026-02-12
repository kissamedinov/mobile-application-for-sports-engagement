from datetime import datetime
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


class MatchParticipant(SQLModel, table=True):
    match_id: int = Field(foreign_key="match.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    full_name: Optional[str] = None
    sport_interest: Optional[str] = None
    skill_level: Optional[str] = None
    location: Optional[str] = None

    matches_created: List["Match"] = Relationship(back_populates="creator")
    matches_participating: List["Match"] = Relationship(
        back_populates="participants",
        link_model=MatchParticipant,
    )
    notifications: List["Notification"] = Relationship(back_populates="user")


class Match(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sport_type: str
    date_time: datetime
    location: str
    max_players: int
    status: str = Field(default="open")  # open, full, closed
    created_by: int = Field(foreign_key="user.id")

    creator: Optional[User] = Relationship(back_populates="matches_created")
    participants: List[User] = Relationship(
        back_populates="matches_participating",
        link_model=MatchParticipant,
    )
    chat_messages: List["ChatMessage"] = Relationship(back_populates="match")


class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    match_id: int = Field(foreign_key="match.id")
    sender_id: int = Field(foreign_key="user.id")
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    match: Optional[Match] = Relationship(back_populates="chat_messages")
    # TODO: add sender relationship if needed on UI


class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None

    user: Optional[User] = Relationship(back_populates="notifications")