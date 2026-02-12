from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Security
    SECRET_KEY: str = "super-secret-key-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/sports_mvp"

    class Config:
        env_file = ".env"


settings = Settings()
