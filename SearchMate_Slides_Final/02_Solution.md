# Proposed Solution

SearchMate is an AI-assisted web application that analyses multiple
uploaded research-paper PDFs together and explains how they relate.

### Main capabilities

-   **Multiple PDF upload:** Upload and analyse up to 5 research papers
    in one collection.
-   **Paper information extraction:** Extract title, authors,
    publication year, abstract, keywords, objective, methodology,
    dataset, findings, limitations, and future-work statements where
    available.
-   **Theme discovery:** Identify recurring research themes, shared
    keywords, and overlapping topics.
-   **Paper comparison:** Compare methodologies, datasets, findings, and
    limitations across papers.
-   **Relationship exploration:** Show connections between papers and
    themes in a simple relationship view; an interactive graph can be
    used as an enhancement.
-   **Gap and limitation discovery:** Find limitations shared by
    multiple papers and topics that appear repeatedly mentioned but
    insufficiently explored in the uploaded collection.
-   **Conflicting findings:** Identify results that differ and explain
    possible reasons when supported by paper details.
-   **Research trends:** Show how keywords or themes appear across
    publication years.
-   **Future directions:** Suggest possible research directions and
    project ideas based on identified gaps and limitations.
-   **Research Q&A:** Let users ask questions about individual papers or
    the collection and receive answers supported by paper references.

### Interactive Research Graph --- Priority and Features

**Essential (MVP)** - Paper nodes and theme nodes, each with stable
identity and readable labels. - Labelled relationship lines connecting
papers and themes; every connection explains why the items are linked. -
Click-to-view details for a paper, theme, or relationship. - Evidence
references linking relationships to source papers and page numbers where
available. - Zoom, pan, fit/reset controls. - Search across paper
titles, theme names, and available keywords. - Filters for node types
and relationship types. - A list/table alternative for users who prefer
not to use a graph.

**Advanced (Post-MVP)** - Potential research-gap nodes linked to
supporting limitations and papers. - Conflicting-finding links with
claim-level evidence and contextual comparison. - Publication-year
filters. - Custom layouts such as force-directed, hierarchical, and
circular. - Relationship-strength visualization using a documented
similarity/evidence measure and a visible legend.

**Evidence rule:** Visual proximity must never imply a relationship.
Computed similarity must be labelled as system analysis, not as an
author-stated fact. A gap in the uploaded collection is not proof of
global novelty.

**Evidence-first approach:** Important claims should link to the source
paper and, where possible, its page or section. Missing information is
shown as "Not found in paper."
