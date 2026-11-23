from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import PaperAnalysis, Theme, PaperTheme, ResearchInsight, InsightEvidence

class AnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_paper_analysis(self, paper_id: str, analysis_data: dict) -> PaperAnalysis:
        existing = self.db.query(PaperAnalysis).filter(PaperAnalysis.paper_id == paper_id).first()
        if existing:
            for k, v in analysis_data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            analysis = PaperAnalysis(paper_id=paper_id, **analysis_data)
            self.db.add(analysis)
            self.db.commit()
            self.db.refresh(analysis)
            return analysis

    def get_paper_analysis(self, paper_id: str) -> Optional[PaperAnalysis]:
        return self.db.query(PaperAnalysis).filter(PaperAnalysis.paper_id == paper_id).first()

    def replace_collection_themes(self, collection_id: str, themes_data: List[dict]):
        # Delete old themes for collection
        old_themes = self.db.query(Theme).filter(Theme.collection_id == collection_id).all()
        for t in old_themes:
            self.db.delete(t)
        self.db.commit()

        # Add new themes
        for t_info in themes_data:
            theme = Theme(
                collection_id=collection_id,
                name=t_info["name"],
                description=t_info["description"],
                keywords_json=t_info.get("keywords", [])
            )
            self.db.add(theme)
            self.db.flush()
            for p_id in t_info.get("paper_ids", []):
                pt = PaperTheme(
                    paper_id=p_id,
                    theme_id=theme.id,
                    evidence_text=t_info.get("evidence_text", "")
                )
                self.db.add(pt)
        self.db.commit()

    def replace_collection_insights(self, collection_id: str, insights_data: List[dict]):
        # Delete old insights for collection
        old_insights = self.db.query(ResearchInsight).filter(ResearchInsight.collection_id == collection_id).all()
        for ins in old_insights:
            self.db.delete(ins)
        self.db.commit()

        # Add new insights
        for ins_info in insights_data:
            insight = ResearchInsight(
                collection_id=collection_id,
                type=ins_info["type"],
                title=ins_info["title"],
                description=ins_info["description"],
                confidence_label=ins_info.get("confidence_label", "exploratory")
            )
            self.db.add(insight)
            self.db.flush()
            for ev in ins_info.get("evidences", []):
                evidence = InsightEvidence(
                    insight_id=insight.id,
                    paper_id=ev["paper_id"],
                    page_number=ev.get("page_number"),
                    evidence_text=ev.get("evidence_text")
                )
                self.db.add(evidence)
        self.db.commit()
