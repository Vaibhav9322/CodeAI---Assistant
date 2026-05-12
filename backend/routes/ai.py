from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from middleware.auth import get_current_user
from models.user import User
from services import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

SUPPORTED_LANGUAGES = {"python", "javascript", "java", "cpp", "c"}


def validate_language(lang: str):
    if lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported language. Choose from: {', '.join(SUPPORTED_LANGUAGES)}")


class GenerateRequest(BaseModel):
    prompt: str
    language: str = "python"


class ExplainRequest(BaseModel):
    code: str
    language: str = "python"


class DebugRequest(BaseModel):
    code: str
    language: str = "python"
    error: Optional[str] = ""


class ConvertRequest(BaseModel):
    code: str
    from_language: str
    to_language: str


class OptimizeRequest(BaseModel):
    code: str
    language: str = "python"


@router.post("/generate")
def generate_code(req: GenerateRequest, current_user: User = Depends(get_current_user)):
    validate_language(req.language)
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    try:
        return {"response": ai_service.generate_code(req.prompt, req.language)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/explain")
def explain_code(req: ExplainRequest, current_user: User = Depends(get_current_user)):
    validate_language(req.language)
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    try:
        return {"response": ai_service.explain_code(req.code, req.language)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/debug")
def debug_code(req: DebugRequest, current_user: User = Depends(get_current_user)):
    validate_language(req.language)
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    try:
        return {"response": ai_service.debug_code(req.code, req.language, req.error)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/convert")
def convert_code(req: ConvertRequest, current_user: User = Depends(get_current_user)):
    validate_language(req.from_language)
    validate_language(req.to_language)
    if req.from_language == req.to_language:
        raise HTTPException(status_code=400, detail="Source and target languages must be different")
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    try:
        return {"response": ai_service.convert_code(req.code, req.from_language, req.to_language)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


@router.post("/optimize")
def optimize_code(req: OptimizeRequest, current_user: User = Depends(get_current_user)):
    validate_language(req.language)
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    try:
        return {"response": ai_service.optimize_code(req.code, req.language)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
