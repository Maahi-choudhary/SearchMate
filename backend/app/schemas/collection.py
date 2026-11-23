from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.paper import PaperResponse

class CollectionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

class CollectionResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    paper_count: int = 0

    class Config:
        from_attributes = True

class ThemeResponse(BaseModel):
    id: str
    name: str
    description: str
    keywords: List[str]
    paper_ids: List[str]

class InsightEvidenceResponse(BaseModel):
    paper_id: str
    paper_title: str
    page_number: Optional[int] = None
    evidence_text: Optional[str] = None

class InsightResponse(BaseModel):
    id: str
    type: str  # recurring_limitation, potential_gap, idea
    title: str
    description: str
    confidence_label: str
    evidences: List[InsightEvidenceResponse]

class CollectionOverviewResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    papers: List[PaperResponse]
    themes: List[ThemeResponse]
    insights: List[InsightResponse]
    collection_summary: Optional[str] = None
