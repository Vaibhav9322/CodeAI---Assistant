from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database.db import create_tables
from database.config import settings
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.chats import router as chats_router
from routes.ai import router as ai_router
from routes.snippets import router as snippets_router

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="CodeAI API",
    description="AI-powered coding assistant for students and beginners",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "CodeAI API"}


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(chats_router)
app.include_router(ai_router)
app.include_router(snippets_router)
