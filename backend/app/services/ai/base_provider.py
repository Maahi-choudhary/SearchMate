from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIProvider(ABC):
    @abstractmethod
    def analyze_paper(self, paper_text: str, filename: str) -> Dict[str, Any]:
        """
        Extracts structured paper metadata and beginner-friendly explanations.
        Expected return dict:
        {
            "title": str or None,
            "authors": List[str],
            "publication_year": int or None,
            "abstract": str or None,
            "research_problem": str,
            "objective": str,
            "methodology": str,
            "dataset": str,
            "main_findings": List[str],
            "limitations": List[str],
            "future_work": List[str],
            "beginner_explanation": str
        }
        """
        pass

    @abstractmethod
    def answer_question(self, question: str, evidence_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Answers a question strictly grounded in the provided evidence chunks.
        Expected return dict:
        {
            "answer": str,
            "cited_chunk_indices": List[int],
            "grounded": bool
        }
        """
        pass
