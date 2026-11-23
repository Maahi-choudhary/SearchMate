from typing import List, Dict, Any
from app.models import Paper

class ResearchIdeaService:
    @staticmethod
    def generate_insights_and_gaps(papers: List[Paper]) -> List[Dict[str, Any]]:
        insights = []
        if not papers:
            return []

        # 1. Collect stated limitations
        all_limitations = []
        for p in papers:
            if p.analysis and p.analysis.limitations_json:
                for lim in p.analysis.limitations_json:
                    all_limitations.append({
                        "paper_id": p.id,
                        "paper_title": p.title or p.filename,
                        "text": lim
                    })

        # 2. Identify recurring limitations
        if len(papers) >= 2 and all_limitations:
            # Group by recurring themes: dataset constraint, computation, generalizability
            dataset_limits = [l for l in all_limitations if any(w in l["text"].lower() for w in ["data", "dataset", "sample", "size", "benchmark", "domain"])]
            compute_limits = [l for l in all_limitations if any(w in l["text"].lower() for w in ["comput", "gpu", "latency", "scale", "overhead", "memory"])]
            gen_limits = [l for l in all_limitations if any(w in l["text"].lower() for w in ["generaliz", "robust", "real-world", "noisy", "unseen"])]

            if len(dataset_limits) >= 2:
                p_ids = list(dict.fromkeys([l["paper_id"] for l in dataset_limits]))
                insights.append({
                    "type": "recurring_limitation",
                    "title": "Recurring Limitation: Dataset Diversity & Scale",
                    "description": "Multiple papers explicitly note that evaluation was restricted to specific benchmark datasets or small sample sizes, limiting validation on diverse populations.",
                    "confidence_label": "needs_verification",
                    "evidences": [{"paper_id": pid, "evidence_text": "Dataset limitation cited"} for pid in p_ids]
                })

            if len(compute_limits) >= 2:
                p_ids = list(dict.fromkeys([l["paper_id"] for l in compute_limits]))
                insights.append({
                    "type": "recurring_limitation",
                    "title": "Recurring Limitation: High Computational Overhead",
                    "description": "Authors across several studies note intensive resource requirements during training or inference, highlighting challenges for resource-constrained or edge deployment.",
                    "confidence_label": "needs_verification",
                    "evidences": [{"paper_id": pid, "evidence_text": "Computational overhead cited"} for pid in p_ids]
                })

            # 3. Derive Potential Research Gaps (Explicitly labeled as potential gap within this collection)
            p_all_ids = [p.id for p in papers[:3]]
            insights.append({
                "type": "potential_gap",
                "title": "Potential Gap: Cross-Domain Evaluation & Robustness",
                "description": "Within this uploaded collection, there is an apparent gap in evaluating models across out-of-distribution or multimodal domains. (Note: This is an exploratory finding based on your collection and requires literature verification).",
                "confidence_label": "exploratory",
                "evidences": [{"paper_id": pid, "evidence_text": "Cross-domain evaluation underexplored"} for pid in p_all_ids]
            })

            # 4. Generate Beginner-Friendly Project Directions / Ideas
            lead_paper = papers[0]
            second_paper = papers[1] if len(papers) > 1 else papers[0]
            insights.append({
                "type": "idea",
                "title": f"Project Direction: Hybrid Evaluation of {lead_paper.title or lead_paper.filename[:30]}",
                "description": (
                    f"Problem: Evaluate whether the methods proposed in '{lead_paper.title or lead_paper.filename[:40]}' "
                    f"can be adapted to address the specific limitations stated by '{second_paper.title or second_paper.filename[:40]}'.\n\n"
                    "Why worth investigating: Provides a practical bridge between the strengths of both approaches while addressing recurring dataset constraints.\n\n"
                    "First step for validation: Replicate the baseline metric on an open-source dataset and measure latency variance."
                ),
                "confidence_label": "exploratory",
                "evidences": [
                    {"paper_id": lead_paper.id, "evidence_text": "Base methodology reference"},
                    {"paper_id": second_paper.id, "evidence_text": "Target limitation reference"}
                ]
            })
        else:
            # Single paper / initial exploration insight
            p = papers[0]
            insights.append({
                "type": "potential_gap",
                "title": f"Exploratory Focus on '{p.title or p.filename}'",
                "description": "Add more papers to this collection to unlock cross-paper recurring limitation detection and comparison insights.",
                "confidence_label": "exploratory",
                "evidences": [{"paper_id": p.id, "evidence_text": "Initial collection paper"}]
            })

        return insights
