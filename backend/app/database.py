from sqlmodel import SQLModel, create_engine, Session
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:password@localhost:5432/sports_mvp"
)

engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    try:
        SQLModel.metadata.create_all(engine)
        print("✅ Database initialized")
    except Exception as e:
        print("⚠️ Database init skipped:", e)


def get_db():
    with Session(engine) as session:
        yield session
