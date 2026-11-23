# Feasibility

### Technical feasibility

-   The project uses established technologies such as React, FastAPI,
    PyMuPDF, SQLite, and scikit-learn.
-   A modular-monolith architecture keeps development and maintenance
    manageable.
-   A limit of 5 text-based PDFs per collection keeps the initial
    workload small.
-   TF-IDF and cosine similarity provide a lightweight baseline for
    identifying related terms and themes.
-   Structured AI output and evidence validation can help make generated
    analysis traceable.

### Development feasibility

**Core MVP priorities:** - Multiple PDF upload and validation. - PDF
text extraction and paper metadata. - Beginner-friendly paper
explanations. - Shared themes, keywords, and readable paper
relationships. - Methodology and finding comparison. - Evidence
references and error handling. - Essential interactive graph:
paper/theme nodes, labelled edges, details/evidence panel,
zoom/pan/reset, search, and node/relationship filters.

**Post-MVP graph enhancements:** research-gap nodes, conflicting-finding
links, publication-year graph filters, custom layouts, and
relationship-strength visualization.

**Additional capabilities to phase in:** - Recurring limitation grouping
and potential-gap exploration. - Conflict explanations. -
Publication-year trend view. - Project idea suggestions. -
Collection-based question answering. - Interactive relationship graph
enhancement.

### Risks and constraints

-   PDF extraction quality varies across documents.
-   AI may generate incomplete or unsupported claims; outputs and
    citations must be checked.
-   AI provider latency, quotas, and cost may affect processing.
-   A small collection cannot prove that a research gap is globally
    novel.
-   Scanned PDFs require OCR, which is outside the initial MVP.

**Planning target in the PRD:** Approximately 1--2 weeks for an
individual developer. This is an estimate, not a guarantee.
