from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EvidenceRef(BaseModel):
    paper_id: str
    paper_title: str
    page_number: Optional[int] = None
    evidence_id: Optional[str] = None
    excerpt: Optional[str] = None

class GraphNode(BaseModel):
    id: str  # e.g. "paper:<uuid>" or "theme:<uuid>"
    type: str  # "paper" | "theme"
    label: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    id: str  # e.g. "edge:<source>-<target>"
    source: str
    target: str
    type: str  # "paper_theme", "shared_topic", "keyword_overlap", "similar_method", "differing_finding"
    label: str
    explanation: str
    evidence_refs: List[EvidenceRef] = Field(default_factory=list)

class GraphResponse(BaseModel):
    collection_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
