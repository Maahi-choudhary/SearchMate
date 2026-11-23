from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Paper, PaperPage, EvidenceChunk

class PaperRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, collection_id: str, filename: str, storage_path: str) -> Paper:
        paper = Paper(
            collection_id=collection_id,
            filename=filename,
            storage_path=storage_path,
            status="uploaded"
        )
        self.db.add(paper)
        self.db.commit()
        self.db.refresh(paper)
        return paper

    def get_by_id(self, paper_id: str) -> Optional[Paper]:
        return self.db.query(Paper).filter(Paper.id == paper_id).first()

    def get_by_collection(self, collection_id: str) -> List[Paper]:
        return self.db.query(Paper).filter(Paper.collection_id == collection_id).order_by(Paper.created_at.desc()).all()

    def update_status(self, paper_id: str, status: str, error_code: Optional[str] = None):
        paper = self.get_by_id(paper_id)
        if paper:
            paper.status = status
            paper.error_code = error_code
            self.db.commit()
            self.db.refresh(paper)
        return paper

    def update_metadata(self, paper_id: str, title: Optional[str], authors: Optional[List[str]], publication_year: Optional[int], abstract: Optional[str]):
        paper = self.get_by_id(paper_id)
        if paper:
            if title is not None:
                paper.title = title
            if authors is not None:
                paper.authors_json = authors
            if publication_year is not None:
                paper.publication_year = publication_year
            if abstract is not None:
                paper.abstract = abstract
            self.db.commit()
            self.db.refresh(paper)
        return paper

    def save_pages(self, paper_id: str, pages: List[dict]):
        # Clear existing
        self.db.query(PaperPage).filter(PaperPage.paper_id == paper_id).delete()
        for p in pages:
            page_obj = PaperPage(
                paper_id=paper_id,
                page_number=p["page_number"],
                text=p["text"]
            )
            self.db.add(page_obj)
        self.db.commit()

    def save_chunks(self, paper_id: str, chunks: List[dict]):
        # Clear existing
        self.db.query(EvidenceChunk).filter(EvidenceChunk.paper_id == paper_id).delete()
        for idx, c in enumerate(chunks):
            chunk_obj = EvidenceChunk(
                paper_id=paper_id,
                page_number=c["page_number"],
                chunk_index=idx,
                text=c["text"]
            )
            self.db.add(chunk_obj)
        self.db.commit()

    def delete(self, paper_id: str) -> bool:
        paper = self.get_by_id(paper_id)
        if paper:
            self.db.delete(paper)
            self.db.commit()
            return True
        return False
