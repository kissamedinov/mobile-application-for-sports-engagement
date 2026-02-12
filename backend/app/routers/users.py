from fastapi import APIRouter, Depends
from sqlmodel import select

from ..deps import get_current_user, get_db
from ..models import User
from ..schemas import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.patch("/me", response_model=UserRead)
def update_me(
    update_in: UserUpdate,
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.exec(select(User).where(User.id == current_user.id)).first()

    if update_in.full_name is not None:
        user.full_name = update_in.full_name
    if update_in.sport_interest is not None:
        user.sport_interest = update_in.sport_interest
    if update_in.skill_level is not None:
        user.skill_level = update_in.skill_level
    if update_in.location is not None:
        user.location = update_in.location

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        sport_interest=user.sport_interest,
        skill_level=user.skill_level,
        location=user.location,
    )
