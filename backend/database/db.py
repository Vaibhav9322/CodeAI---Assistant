from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from database.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from models import user, chat, snippet  # noqa: F401
    Base.metadata.create_all(bind=engine)
