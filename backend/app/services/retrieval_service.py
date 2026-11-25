from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import EvidenceChunk, Paper
from app.services.ai.base_provider import BaseAIProvider
from app.schemas.question import QuestionResponse, CitationSchema

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

class RetrievalService:
    @staticmethod
    def answer_collection_question(db: Session, collection_id: str, question: str, ai_provider: BaseAIProvider) -> QuestionResponse:
        # Load all chunks for papers in this collection
        chunks = (
            db.query(EvidenceChunk, Paper.title, Paper.filename)
            .join(Paper, EvidenceChunk.paper_id == Paper.id)
            .filter(Paper.collection_id == collection_id)
            .all()
        )

        if not chunks:
            return QuestionResponse(
                answer="No readable text chunks have been processed for papers in this collection yet.",
                citations=[],
                grounded=False,
                requires_further_reading=True
            )

        chunk_data = []
        corpus = []
        for c, p_title, p_filename in chunks:
            corpus.append(c.text)
            chunk_data.append({
                "chunk_id": c.id,
                "paper_id": c.paper_id,
                "paper_title": p_title or p_filename,
                "page_number": c.page_number,
                "text": c.text
            })

        # Rank chunks using TF-IDF similarity
        top_chunks = []
        if SKLEARN_AVAILABLE and len(corpus) > 0:
            try:
                vectorizer = TfidfVectorizer(stop_words="english")
                tfidf_docs = vectorizer.fit_transform(corpus)
                tfidf_q = vectorizer.transform([question])
                scores = cosine_similarity(tfidf_q, tfidf_docs)[0]
                
                ranked_indices = scores.argsort()[::-1]
                for idx in ranked_indices[:5]:
                    if scores[idx] > 0.04:
                        top_chunks.append(chunk_data[idx])
            except Exception:
                pass

        if not top_chunks:
            # Fallback simple keyword match
            q_terms = set(question.lower().split())
            scored = []
            for item in chunk_data:
                overlap = len(q_terms.intersection(set(item["text"].lower().split())))
                if overlap > 0:
                    scored.append((overlap, item))
            scored.sort(key=lambda x: x[0], reverse=True)
            top_chunks = [item[1] for item in scored[:4]]

        if not top_chunks:
            return QuestionResponse(
                answer="I could not find enough relevant information in your uploaded papers to answer this question.",
                citations=[],
                grounded=False,
                requires_further_reading=True
            )

        # Call AI provider with grounded evidence chunks
        try:
            result = ai_provider.answer_question(question=question, evidence_chunks=top_chunks)
        except Exception as ai_err:
            from app.services.ai.heuristic_provider import HeuristicProvider
            heuristic = HeuristicProvider()
            result = heuristic.answer_question(question=question, evidence_chunks=top_chunks)
        cited_indices = result.get("cited_chunk_indices", [])

        citations = []
        if cited_indices:
            for idx in cited_indices:
                if 0 <= idx < len(top_chunks):
                    ch = top_chunks[idx]
                    citations.append(CitationSchema(
                        paper_id=ch["paper_id"],
                        paper_title=ch["paper_title"],
                        page_number=ch["page_number"],
                        evidence_id=ch["chunk_id"],
                        text_snippet=ch["text"][:150] + "..."
                    ))
        else:
            # If AI didn't return explicit indices but grounded was true, cite the top matching chunk
            if result.get("grounded", False) and top_chunks:
                ch = top_chunks[0]
                citations.append(CitationSchema(
                    paper_id=ch["paper_id"],
                    paper_title=ch["paper_title"],
                    page_number=ch["page_number"],
                    evidence_id=ch["chunk_id"],
                    text_snippet=ch["text"][:150] + "..."
                ))

        return QuestionResponse(
            answer=result.get("answer", "No answer could be established."),
            citations=citations,
            grounded=result.get("grounded", len(citations) > 0),
            requires_further_reading=not result.get("grounded", False)
        )
