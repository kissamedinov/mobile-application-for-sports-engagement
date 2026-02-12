from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func

from ..deps import get_current_user, get_db
from ..models import Match, MatchParticipant, User, ChatMessage, Notification
from ..schemas import (
    MatchCreate,
    MatchRead,
    MatchDetail,
    ChatMessageCreate,
    ChatMessageRead,
)

router = APIRouter(prefix="/matches", tags=["matches"])


@router.post("", response_model=MatchRead)
def create_match(
    match_in: MatchCreate,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = Match(
        sport_type=match_in.sport_type,
        date_time=match_in.date_time,
        location=match_in.location,
        max_players=match_in.max_players,
        created_by=current_user.id,
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return _match_to_read(db, match)


@router.get("", response_model=List[MatchRead])
def list_matches(
    db=Depends(get_db),
    sport: str | None = Query(default=None),
    location: str | None = Query(default=None),
):
    stmt = select(Match)
    if sport:
        stmt = stmt.where(Match.sport_type.ilike(f"%{sport}%"))
    if location:
        stmt = stmt.where(Match.location.ilike(f"%{location}%"))

    matches = db.exec(stmt.order_by(Match.date_time)).all()
    return [_match_to_read(db, m) for m in matches]


@router.get("/{match_id}", response_model=MatchDetail)
def get_match(match_id: int, db=Depends(get_db)):
    match = db.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    db.refresh(match)
    participants = match.participants

    return MatchDetail(
        **_match_to_read(db, match).dict(),
        participants=[
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "sport_interest": u.sport_interest,
                "skill_level": u.skill_level,
                "location": u.location,
            }
            for u in participants
        ],
    )


@router.post("/{match_id}/join", response_model=MatchRead)
def join_match(
    match_id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    current_count = _match_player_count(db, match.id)
    if current_count >= match.max_players:
        raise HTTPException(status_code=400, detail="Match is full")

    existing = db.get(
        MatchParticipant, {"match_id": match.id, "user_id": current_user.id}
    )
    if existing:
        return _match_to_read(db, match)

    db.add(MatchParticipant(match_id=match.id, user_id=current_user.id))

    if current_count + 1 == match.max_players:
        match.status = "full"
        db.add(
            Notification(
                user_id=match.created_by,
                title="Match is full",
                message=f"Your match #{match.id} is now full.",
            )
        )
    else:
        db.add(
            Notification(
                user_id=match.created_by,
                title="New participant joined",
                message=f"User {current_user.email} joined your match #{match.id}.",
            )
        )

    db.commit()
    db.refresh(match)
    return _match_to_read(db, match)


@router.post("/{match_id}/auto-teams")
def auto_teams(
    match_id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    db.refresh(match)
    participants = match.participants
    if len(participants) < 2:
        raise HTTPException(status_code=400, detail="Not enough participants")

    team_a = []
    team_b = []

    for idx, p in enumerate(participants):
        target = team_a if idx % 2 == 0 else team_b
        target.append(
            {
                "id": p.id,
                "full_name": p.full_name,
                "email": p.email,
                "skill_level": p.skill_level,
            }
        )

    return {"team_a": team_a, "team_b": team_b}


# -------- CHAT --------

@router.get("/{match_id}/chat", response_model=List[ChatMessageRead])
def list_chat(
    match_id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msgs = db.exec(
        select(ChatMessage)
        .where(ChatMessage.match_id == match_id)
        .order_by(ChatMessage.created_at)
    ).all()
    return msgs


@router.post("/{match_id}/chat", response_model=ChatMessageRead)
def send_chat(
    match_id: int,
    msg_in: ChatMessageCreate,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = ChatMessage(
        match_id=match_id,
        sender_id=current_user.id,
        message=msg_in.message,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


# -------- HELPERS --------

def _match_player_count(db, match_id: int) -> int:
    return db.exec(
        select(func.count(MatchParticipant.user_id)).where(
            MatchParticipant.match_id == match_id
        )
    ).one()


def _match_to_read(db, match: Match) -> MatchRead:
    count = _match_player_count(db, match.id)
    return MatchRead(
        id=match.id,
        sport_type=match.sport_type,
        date_time=match.date_time,
        location=match.location,
        max_players=match.max_players,
        status=match.status,
        created_by=match.created_by,
        current_players=count,
    )
