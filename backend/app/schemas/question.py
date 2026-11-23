from typing import List, Optional
from pydantic import BaseModel, Field

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)

class CitationSchema(BaseModel):
    paper_id: str
    paper_title: str
    page_number: Optional[int] = None
    evidence_id: Optional[str] = None
    text_snippet: Optional[str] = None

class QuestionResponse(BaseModel):
    answer: str
    citations: List[CitationSchema]
    grounded: bool
    requires_further_reading: bool = False
