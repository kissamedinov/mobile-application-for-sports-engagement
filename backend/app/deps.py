from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select

from .database import get_db
from .config import settings
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db(session: Session = Depends(get_db)):
    return session


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        raise credentials_exception
    return user
