from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

from .. import security
from ..config import settings
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import UserCreate, UserRead, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db=Depends(get_db)):
    existing = db.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
    )
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


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db),
):
    user = db.exec(select(User).where(User.email == form_data.username)).first()

    if not user or not security.verify_password(
        form_data.password, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = security.create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        sport_interest=current_user.sport_interest,
        skill_level=current_user.skill_level,
        location=current_user.location,
    )
