import os
from app.core.config import settings
from app.core.logging import logger
from app.services.ai.base_provider import BaseAIProvider
from app.services.ai.groq_provider import GroqProvider
from app.services.ai.gemini_provider import GeminiProvider, GENAI_AVAILABLE
from app.services.ai.heuristic_provider import HeuristicProvider

def get_ai_provider() -> BaseAIProvider:
    """
    Selects and initializes the appropriate AI provider based on configuration.
    Priority:
    1. Groq (or typo alias GEOQ_API_KEY)
    2. xAI Grok (if XAI_API_KEY is configured)
    3. Google Gemini (if GEMINI_API_KEY is configured)
    4. HeuristicProvider (offline, standalone fallback)
    """
    # 1. Check Groq API Key (checking GROQ_API_KEY, GEOQ_API_KEY alias)
    groq_key = (
        (settings.GROQ_API_KEY or "").strip() 
        or os.getenv("GROQ_API_KEY", "").strip() 
        or os.getenv("GEOQ_API_KEY", "").strip()
    )
    
    if groq_key:
        logger.info("Initializing GroqProvider with configured API key.")
        return GroqProvider(
            api_key=groq_key,
            model_name=settings.GROQ_MODEL
        )

    # 2. Check xAI / Grok API Key
    xai_key = (
        (settings.XAI_API_KEY or "").strip()
        or os.getenv("XAI_API_KEY", "").strip()
        or os.getenv("GROK_API_KEY", "").strip()
    )
    if xai_key:
        logger.info("Initializing GroqProvider adapted for xAI Grok API endpoint.")
        return GroqProvider(
            api_key=xai_key,
            model_name=settings.XAI_MODEL,
            base_url="https://api.x.ai/v1"
        )

    # 3. Check Google Gemini API Key
    gemini_key = (settings.GEMINI_API_KEY or "").strip() or os.getenv("GEMINI_API_KEY", "").strip()
    if gemini_key and GENAI_AVAILABLE:
        try:
            logger.info("Initializing GeminiProvider with configured API key.")
            return GeminiProvider(api_key=gemini_key, model_name=settings.GEMINI_MODEL)
        except Exception as e:
            logger.warning(f"Failed to initialize GeminiProvider: {e}. Falling back to HeuristicProvider.")
            return HeuristicProvider()

    # 4. Standalone Heuristic fallback
    logger.info("No external AI provider API key found (GROQ_API_KEY, XAI_API_KEY, or GEMINI_API_KEY). Utilizing standalone HeuristicProvider.")
    return HeuristicProvider()
