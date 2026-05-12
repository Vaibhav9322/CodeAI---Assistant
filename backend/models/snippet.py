from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base


class CodeSnippet(Base):
    __tablename__ = "code_snippets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), default="Untitled Snippet")
    code = Column(Text, nullable=False)
    language = Column(String(50), default="plaintext")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="snippets")
