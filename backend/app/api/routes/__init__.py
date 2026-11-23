from fastapi import APIRouter
from app.api.routes.collections import router as collections_router
from app.api.routes.papers import router as papers_router
from app.api.routes.questions import router as questions_router
from app.api.routes.graph import router as graph_router

api_router = APIRouter()

api_router.include_router(collections_router, prefix="/collections", tags=["collections"])
api_router.include_router(papers_router, tags=["papers"])
api_router.include_router(questions_router, tags=["questions"])
api_router.include_router(graph_router, tags=["graph"])
