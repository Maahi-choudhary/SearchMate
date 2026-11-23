import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    PROJECT_NAME: str = "SearchMate"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./searchmate.db"
    
    # Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10
    MAX_PAPERS_PER_COLLECTION: int = 5
    
    # AI Providers
    # Choices: "groq", "gemini", "xai", "heuristic"
    AI_PROVIDER: str = "groq"
    
    # Groq Cloud Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Google Gemini Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # xAI Grok Configuration
    XAI_API_KEY: str = ""
    XAI_MODEL: str = "grok-beta"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
