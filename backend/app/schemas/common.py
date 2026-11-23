from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str

class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[ErrorDetail] = None

# Predefined error codes from Architecture & Security Policy
class ErrorCodes:
    INVALID_FILE_TYPE = "INVALID_FILE_TYPE"
    FILE_TOO_LARGE = "FILE_TOO_LARGE"
    PDF_CORRUPT = "PDF_CORRUPT"
    PDF_ENCRYPTED = "PDF_ENCRYPTED"
    PDF_TEXT_NOT_FOUND = "PDF_TEXT_NOT_FOUND"
    PAPER_LIMIT_REACHED = "PAPER_LIMIT_REACHED"
    AI_PROVIDER_ERROR = "AI_PROVIDER_ERROR"
    AI_INVALID_RESPONSE = "AI_INVALID_RESPONSE"
    NOT_ENOUGH_EVIDENCE = "NOT_ENOUGH_EVIDENCE"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    INTERNAL_ERROR = "INTERNAL_ERROR"
