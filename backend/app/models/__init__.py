import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class PaperTheme(Base):
    __tablename__ = "paper_themes"

    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), primary_key=True)
    theme_id = Column(String(36), ForeignKey("themes.id", ondelete="CASCADE"), primary_key=True)
    evidence_text = Column(Text, nullable=True)

class Collection(Base):
    __tablename__ = "collections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    papers = relationship("Paper", back_populates="collection", cascade="all, delete-orphan")
    themes = relationship("Theme", back_populates="collection", cascade="all, delete-orphan")
    insights = relationship("ResearchInsight", back_populates="collection", cascade="all, delete-orphan")

class Paper(Base):
    __tablename__ = "papers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    storage_path = Column(String(512), nullable=False)
    title = Column(String(512), nullable=True)
    authors_json = Column(JSON, nullable=True)  # List[str]
    publication_year = Column(Integer, nullable=True)
    abstract = Column(Text, nullable=True)
    status = Column(String(50), default="uploaded")  # uploaded, validating, extracting, analysing, completed, failed
    error_code = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    collection = relationship("Collection", back_populates="papers")
    pages = relationship("PaperPage", back_populates="paper", cascade="all, delete-orphan")
    analysis = relationship("PaperAnalysis", back_populates="paper", uselist=False, cascade="all, delete-orphan")
    chunks = relationship("EvidenceChunk", back_populates="paper", cascade="all, delete-orphan")
    themes = relationship("Theme", secondary="paper_themes", back_populates="papers")
    insight_evidences = relationship("InsightEvidence", back_populates="paper", cascade="all, delete-orphan")

class PaperPage(Base):
    __tablename__ = "paper_pages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)

    paper = relationship("Paper", back_populates="pages")

class PaperAnalysis(Base):
    __tablename__ = "paper_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False, unique=True)
    research_problem = Column(Text, nullable=True)
    objective = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    dataset = Column(Text, nullable=True)
    main_findings_json = Column(JSON, default=list)  # List[str]
    limitations_json = Column(JSON, default=list)  # List[str]
    future_work_json = Column(JSON, default=list)  # List[str]
    beginner_explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    paper = relationship("Paper", back_populates="analysis")

class Theme(Base):
    __tablename__ = "themes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    keywords_json = Column(JSON, default=list)  # List[str]

    collection = relationship("Collection", back_populates="themes")
    papers = relationship("Paper", secondary="paper_themes", back_populates="themes")

class EvidenceChunk(Base):
    __tablename__ = "evidence_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)

    paper = relationship("Paper", back_populates="chunks")

class ResearchInsight(Base):
    __tablename__ = "research_insights"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # recurring_limitation, potential_gap, idea
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    confidence_label = Column(String(50), default="exploratory")  # exploratory, needs_verification
    created_at = Column(DateTime, default=datetime.utcnow)

    collection = relationship("Collection", back_populates="insights")
    evidences = relationship("InsightEvidence", back_populates="insight", cascade="all, delete-orphan")

class InsightEvidence(Base):
    __tablename__ = "insight_evidences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    insight_id = Column(String(36), ForeignKey("research_insights.id", ondelete="CASCADE"), nullable=False)
    paper_id = Column(String(36), ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=True)
    evidence_text = Column(Text, nullable=True)

    insight = relationship("ResearchInsight", back_populates="evidences")
    paper = relationship("Paper", back_populates="insight_evidences")
