from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import APIResponse, ErrorCodes
from app.schemas.question import QuestionRequest, QuestionResponse
from app.services.retrieval_service import RetrievalService
from app.services.ai.provider_factory import get_ai_provider

router = APIRouter()

@router.post("/collections/{collection_id}/questions", response_model=APIResponse[QuestionResponse])
def ask_collection_question(collection_id: str, payload: QuestionRequest, db: Session = Depends(get_db)):
    ai_provider = get_ai_provider()
    response = RetrievalService.answer_collection_question(
        db=db,
        collection_id=collection_id,
        question=payload.question,
        ai_provider=ai_provider
    )
    return APIResponse(
        success=True,
        data=response,
        message="Answer generated from uploaded papers" if response.grounded else "Insufficient evidence found in collection"
    )
