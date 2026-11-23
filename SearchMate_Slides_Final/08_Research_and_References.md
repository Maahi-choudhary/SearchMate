# Research Basis & References

### Project research basis

The SearchMate concept is based on the problem that beginner researchers
need more than isolated paper summaries: they need to understand themes,
methods, findings, limitations, disagreements, and possible next steps
across a collection.

### Requirements and feature basis

The following supplied project documents define the current product and
technical plan: 1. `SearchMate_PRD.md` --- product vision, target users,
user stories, functional requirements, priorities, and success criteria.
2. `SearchMate_Architecture.md` --- planned system architecture,
technology stack, data flow, and API structure. 3. `phases.md` ---
development phases, task dependencies, and acceptance checkpoints. 4.
`design.md` --- user experience, screen structure, accessibility, and
visual direction. 5. `rules.md` --- engineering practices, testing
expectations, and AI integrity requirements. 6. `security.md` --- upload
security, privacy, secrets, validation, and AI-specific risks. 7.
`memory.md` --- project decisions and implementation status.

### Research and evidence principles

-   Extracted information should be linked to its source paper and page
    where possible.
-   Missing information should be labelled "Not found in paper."
-   Distinguish author-stated limitations from AI interpretations and
    potential collection-based gaps.
-   A gap in a small uploaded collection is not proof of global novelty.
-   Explain differing findings only when supporting paper details are
    available.

### External references

The supplied project documents do not include a verified bibliography of
external academic publications or a completed competitor benchmark. Add
external academic and competitor references only after conducting and
verifying that research; do not invent citations.

### Interactive graph scope decision

The current graph priority is: - **Essential / MVP:** paper and theme
nodes; labelled relationship lines; click-to-view details; evidence
references; zoom, pan, reset; search; node-type and relationship-type
filters. - **Advanced / Post-MVP:** research-gap nodes;
conflicting-finding links; publication-year filters; custom layouts;
relationship-strength visualization.

The graph is planned as a visualization over existing evidence-backed
relationships using the current modular-monolith architecture. It does
not require a graph database. Each displayed relationship must be
traceable to source-paper evidence; similarity-based links must be
labelled as computed analysis.

### Project status

The supplied project memory records implementation as **NOT STARTED**
and tests as **NOT RUN**. The features described in these slides are
planned capabilities, not verified implemented functionality.
