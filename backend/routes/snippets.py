from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database.db import get_db
from models.snippet import CodeSnippet
from models.user import User
from middleware.auth import get_current_user

router = APIRouter(prefix="/snippets", tags=["snippets"])


class CreateSnippetRequest(BaseModel):
    title: Optional[str] = "Untitled Snippet"
    code: str
    language: Optional[str] = "plaintext"


def snippet_to_dict(s: CodeSnippet) -> dict:
    return {
        "id": s.id,
        "title": s.title,
        "code": s.code,
        "language": s.language,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }


@router.post("")
def create_snippet(req: CreateSnippetRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    snippet = CodeSnippet(user_id=current_user.id, title=req.title, code=req.code, language=req.language)
    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    return snippet_to_dict(snippet)


@router.get("")
def get_snippets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    snippets = db.query(CodeSnippet).filter(CodeSnippet.user_id == current_user.id).order_by(CodeSnippet.created_at.desc()).all()
    return [snippet_to_dict(s) for s in snippets]


@router.delete("/{snippet_id}")
def delete_snippet(snippet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    snippet = db.query(CodeSnippet).filter(CodeSnippet.id == snippet_id, CodeSnippet.user_id == current_user.id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    db.delete(snippet)
    db.commit()
    return {"message": "Snippet deleted"}
