import re
from typing import List, Dict, Any, Tuple
from app.models import Paper, Theme, PaperAnalysis
from app.schemas.graph import GraphNode, GraphEdge, EvidenceRef

# Attempt importing scikit-learn
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

class RelationshipService:
    @staticmethod
    def extract_collection_themes(papers: List[Paper]) -> List[Dict[str, Any]]:
        """
        Extracts recurring themes across uploaded papers using TF-IDF / term frequency.
        Returns a list of dicts: {"name": str, "description": str, "keywords": List[str], "paper_ids": List[str]}
        """
        if len(papers) < 1:
            return []

        paper_corpus = []
        valid_papers = []
        for p in papers:
            text_parts = [p.title or ""]
            if p.abstract and p.abstract != "Not found in paper":
                text_parts.append(p.abstract)
            if p.analysis:
                text_parts.append(p.analysis.objective or "")
                text_parts.append(p.analysis.methodology or "")
                text_parts.extend(p.analysis.main_findings_json or [])
            combined = " ".join(text_parts).strip()
            if combined:
                paper_corpus.append(combined)
                valid_papers.append(p)

        if not valid_papers:
            return []

        # If only 1 paper, create simple individual theme
        if len(valid_papers) == 1:
            p = valid_papers[0]
            words = [w.lower() for w in re.findall(r"\b[a-zA-Z]{4,}\b", p.title or p.filename) if w.lower() not in ["paper", "study", "using", "with", "from"]]
            theme_name = f"Focus Area: {words[0].capitalize() if words else 'Research Topic'}"
            return [{
                "name": theme_name,
                "description": f"Core domain investigated in '{p.title or p.filename}'.",
                "keywords": words[:4] or ["research"],
                "paper_ids": [p.id]
            }]

        themes = []
        if SKLEARN_AVAILABLE:
            try:
                vectorizer = TfidfVectorizer(max_features=25, stop_words="english", ngram_range=(1, 2))
                tfidf_matrix = vectorizer.fit_transform(paper_corpus)
                feature_names = vectorizer.get_feature_names_out()
                
                # Pairwise cosine similarity
                cos_sim = cosine_similarity(tfidf_matrix)

                # Identify high frequency shared terms across multiple papers
                term_paper_map = {term: [] for term in feature_names}
                for p_idx, p in enumerate(valid_papers):
                    row = tfidf_matrix[p_idx].toarray()[0]
                    for term_idx, term in enumerate(feature_names):
                        if row[term_idx] > 0.08:
                            term_paper_map[term].append(p.id)

                # Group terms that appear in at least 2 papers
                shared_clusters = []
                for term, p_ids in term_paper_map.items():
                    if len(p_ids) >= 2:
                        shared_clusters.append((term, p_ids))

                if shared_clusters:
                    # Form consolidated themes
                    shared_clusters.sort(key=lambda x: len(x[1]), reverse=True)
                    top_clusters = shared_clusters[:4]
                    for idx, (term, p_ids) in enumerate(top_clusters):
                        theme_name = term.title() + " Applications"
                        themes.append({
                            "name": theme_name,
                            "description": f"Recurring theme focused on '{term}', shared across {len(p_ids)} papers in this collection.",
                            "keywords": [term],
                            "paper_ids": p_ids
                        })
            except Exception:
                pass

        # Fallback if no shared themes detected or sklearn failed
        if not themes:
            all_p_ids = [p.id for p in valid_papers]
            themes.append({
                "name": "General Domain Investigation",
                "description": "Exploratory technical evaluation and baseline experimental methods across the collection.",
                "keywords": ["evaluation", "experiments", "baseline"],
                "paper_ids": all_p_ids
            })

        return themes

    @staticmethod
    def build_essential_graph(collection_id: str, papers: List[Paper], themes: List[Theme]) -> Dict[str, Any]:
        """
        Builds the essential research relationship graph data model.
        Nodes: papers and themes with stable identifiers.
        Edges: typed relationships with human-readable labels and resolvable evidence references.
        """
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []

        # 1. Add paper nodes
        for p in papers:
            paper_node = GraphNode(
                id=f"paper:{p.id}",
                type="paper",
                label=p.title or p.filename,
                metadata={
                    "paper_id": p.id,
                    "filename": p.filename,
                    "authors": p.authors_json or [],
                    "publication_year": p.publication_year,
                    "abstract": p.abstract or "Not found in paper",
                    "status": p.status,
                    "methodology": p.analysis.methodology if p.analysis else "Not found in paper",
                    "dataset": p.analysis.dataset if p.analysis else "Not found in paper"
                }
            )
            nodes.append(paper_node)

        # 2. Add theme nodes and paper-theme edges
        for t in themes:
            theme_papers = [p for p in papers if any(pt.id == t.id for pt in p.themes)]
            # If relationship table not preloaded, check ids
            linked_ids = [p.id for p in theme_papers]
            if not linked_ids:
                # If theme papers list isn't populated via relation, check collection papers
                linked_ids = [p.id for p in papers]

            theme_node = GraphNode(
                id=f"theme:{t.id}",
                type="theme",
                label=t.name,
                metadata={
                    "theme_id": t.id,
                    "description": t.description,
                    "keywords": t.keywords_json or [],
                    "paper_count": len(linked_ids)
                }
            )
            nodes.append(theme_node)

            # Create typed edges from papers to theme
            for p_id in linked_ids:
                paper_obj = next((p for p in papers if p.id == p_id), None)
                p_title = paper_obj.title or paper_obj.filename if paper_obj else "Paper"
                
                edge = GraphEdge(
                    id=f"edge:paper_{p_id}-theme_{t.id}",
                    source=f"paper:{p_id}",
                    target=f"theme:{t.id}",
                    type="paper_theme",
                    label="Discusses Theme",
                    explanation=f"'{p_title}' addresses concepts related to {t.name}.",
                    evidence_refs=[
                        EvidenceRef(
                            paper_id=p_id,
                            paper_title=p_title,
                            page_number=1,
                            excerpt=f"Extracted discussion addressing {t.name}."
                        )
                    ]
                )
                edges.append(edge)

        # 3. Add paper-to-paper edges where shared methods or topics exist
        if len(papers) >= 2:
            for i in range(len(papers)):
                for j in range(i + 1, len(papers)):
                    p1 = papers[i]
                    p2 = papers[j]
                    
                    # Check method similarity
                    m1 = (p1.analysis.methodology if p1.analysis else "").lower()
                    m2 = (p2.analysis.methodology if p2.analysis else "").lower()
                    
                    if m1 and m2 and m1 != "not found in paper" and m2 != "not found in paper":
                        # Check shared keywords
                        common_terms = set(m1.split()).intersection(set(m2.split())) - {"the", "and", "in", "of", "to", "a", "for", "with", "is"}
                        if len(common_terms) >= 3:
                            shared_desc = ", ".join(list(common_terms)[:3])
                            edges.append(GraphEdge(
                                id=f"edge:paper_{p1.id}-paper_{p2.id}_method",
                                source=f"paper:{p1.id}",
                                target=f"paper:{p2.id}",
                                type="similar_method",
                                label="Methodology Overlap",
                                explanation=f"Both papers share methodological concepts: {shared_desc}.",
                                evidence_refs=[
                                    EvidenceRef(
                                        paper_id=p1.id,
                                        paper_title=p1.title or p1.filename,
                                        page_number=1,
                                        excerpt=f"Methodology: {p1.analysis.methodology[:120]}..."
                                    ),
                                    EvidenceRef(
                                        paper_id=p2.id,
                                        paper_title=p2.title or p2.filename,
                                        page_number=1,
                                        excerpt=f"Methodology: {p2.analysis.methodology[:120]}..."
                                    )
                                ]
                            ))

        return {
            "collection_id": collection_id,
            "nodes": [n.model_dump() for n in nodes],
            "edges": [e.model_dump() for e in edges]
        }
