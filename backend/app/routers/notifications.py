from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from ..deps import get_current_user, get_db
from ..models import Notification, User
from ..schemas import NotificationRead

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationRead])
def list_notifications(
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = db.exec(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    ).all()
    return notifications


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = db.get(Notification, notification_id)
    if not notif or notif.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.read_at = datetime.utcnow()
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
