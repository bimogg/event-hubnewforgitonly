import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import admin, auth, chats, events, internship, organizer, profiles, teams
from app.core.config import get_settings
from app.scrapers.scheduler import start_scheduler, stop_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    # Startup
    logger.info("Starting EventHub application...")
    await start_scheduler()
    yield
    # Shutdown
    logger.info("Shutting down EventHub application...")
    await stop_scheduler()


app = FastAPI(
    title=settings.app.project_name,
    debug=settings.app.debug,
    lifespan=lifespan,
)

# CORS middleware - разрешаем все origins для разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3004",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:5173",
        "*"  # Для разработки разрешаем все
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(events.router)
app.include_router(teams.router)
app.include_router(chats.router)
app.include_router(organizer.router)
app.include_router(admin.router)
app.include_router(internship.router)

