from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from database.db import get_db
from models.user import User
from models.chat import Chat, Message
from models.snippet import CodeSnippet
from middleware.auth import get_current_user, hash_password, verify_password

router = APIRouter(prefix="/users", tags=["users"])


class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return user_to_dict(current_user)


@router.put("/me")
def update_profile(
    req: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if req.new_password:
        if not req.current_password or not verify_password(req.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        if len(req.new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
        current_user.hashed_password = hash_password(req.new_password)

    if req.username and req.username != current_user.username:
        if db.query(User).filter(User.username == req.username, User.id != current_user.id).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = req.username

    if req.email and req.email != current_user.email:
        if db.query(User).filter(User.email == req.email, User.id != current_user.id).first():
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = req.email

    db.commit()
    db.refresh(current_user)
    return user_to_dict(current_user)


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_chats = db.query(Chat).filter(Chat.user_id == current_user.id).count()
    total_messages = (
        db.query(Message)
        .join(Chat)
        .filter(Chat.user_id == current_user.id)
        .count()
    )
    total_snippets = db.query(CodeSnippet).filter(CodeSnippet.user_id == current_user.id).count()

    from datetime import datetime, timezone
    days_active = max(1, (datetime.now(timezone.utc) - current_user.created_at.replace(tzinfo=timezone.utc)).days + 1) if current_user.created_at else 1

    return {
        "total_chats": total_chats,
        "total_messages": total_messages,
        "total_snippets": total_snippets,
        "days_active": days_active,
    }
