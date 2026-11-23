# SearchMate --- Living Project Memory

**Document purpose:** Persistent handover and project-state record for
the developer and AI coding agents\
**Project:** SearchMate\
**Last updated:** 2026-11-22\
**Implementation progress:** **NOT STARTED**\
**Current phase:** **Phase 0 --- Planning and repository inspection (not
yet verified complete)**\
**Latest verified test status:** **NOT RUN --- no implementation or test
execution has been verified**

> **Accuracy rule:** This document records confirmed project decisions
> separately from implementation status. The existence of a planned file
> or feature in the architecture is not evidence that it has been
> created. Never mark a task, test, or feature complete without checking
> the actual repository and recording the verification performed.

------------------------------------------------------------------------

## 1. Project Summary

SearchMate is an AI-assisted research-paper analysis web application for
college students and beginner researchers. It helps users understand
multiple research papers together rather than only summarising them
individually.

The intended workflow is:

**Create collection → Upload PDFs → Validate and extract text →
Understand each paper → Compare papers → Explore evidence-backed
insights.**

The product experience should guide users through:

**Upload → Understand → Explore → Discover**

### Main intended capabilities

-   Create and manage a research collection.
-   Upload and process up to 5 text-based research-paper PDFs per
    collection.
-   Extract PDF text page by page and preserve original page numbers.
-   Generate beginner-friendly, structured explanations of individual
    papers.
-   Identify shared themes, keywords, methods, findings, and
    differences.
-   Compare papers in a readable format.
-   Display stated limitations and, where implemented, recurring
    limitations as *potential* research gaps.
-   Link important generated insights to supporting papers and page
    references where available.
-   Provide clear processing states and actionable errors.

Collection Q&A, advanced gap grouping, project-idea generation, and
publication-year trend visualisation are optional/stretch capabilities
and must not delay the core MVP.

### Intended users

-   Undergraduate and postgraduate students beginning research.
-   Students preparing mini-projects, capstone projects, seminars, or
    literature reviews.
-   Beginner researchers comparing a small set of papers.
-   Secondary users may include mentors and student project teams.

------------------------------------------------------------------------

## 2. Current Development Phase

### Phase 0 --- Planning and repository inspection

**Status: NOT VERIFIED COMPLETE**

The development plan starts with inspecting the actual repository before
creating or changing code. The current conversation contains the project
specification documents, but no repository inspection result has been
recorded.

Phase 0 checklist:

-   [ ] Read the PRD, architecture, AI coding rules, development phases,
    and design specification.
-   [ ] Inspect the actual repository and identify existing
    frontend/backend code.
-   [ ] Check the current Git branch and working-tree status.
-   [ ] Inspect package manifests, environment files, and existing
    tests.
-   [ ] Confirm whether the repository is empty or already contains an
    implementation.
-   [ ] Record the installed Node.js, package-manager, and Python
    versions.
-   [ ] Create a phase checklist/task board.
-   [ ] Record configuration requirements without exposing real secrets.
-   [ ] Confirm MVP scope versus optional features.

**Do not advance the recorded phase until the repository has actually
been inspected and the Phase 0 definition of done has been verified.**

### Overall implementation progress

`<badge color="warning">`{=html}NOT STARTED`</badge>`{=html}

No application feature is currently recorded as implemented. This is an
initial project-memory baseline, not a claim that code has been
inspected or tests have been run.

------------------------------------------------------------------------

## 3. Confirmed Decisions and Rationale

The following decisions are established by the project documents. They
should be treated as the approved baseline unless the owner explicitly
approves a change.

  ----------------------------------------------------------------------------
  Area                    Confirmed decision           Rationale
  ----------------------- ---------------------------- -----------------------
  Architecture            Modular monolith             Easier for one
                                                       developer to build,
                                                       test, and deploy than
                                                       microservices

  Frontend                React + Vite                 Component-based UI and
                                                       quick development setup

  Styling                 Tailwind CSS                 Consistent, responsive
                                                       styling

  Icons                   Lucide React                 Consistent line-icon
                                                       system

  Backend                 Python + FastAPI             Suitable for PDF
                                                       processing, AI
                                                       integration, and REST
                                                       APIs

  PDF extraction          PyMuPDF (`fitz`)             Page-by-page text
                                                       extraction with page
                                                       references

  Validation              Pydantic                     Validate API data and
                                                       structured AI output

  ORM                     SQLAlchemy                   Organised persistence
                                                       layer and future
                                                       database flexibility

  MVP database            SQLite                       Simple, local, and
                                                       low-cost for an
                                                       individual-developer
                                                       prototype

  AI provider             Gemini behind a provider     One initial hosted
                          adapter                      model integration while
                                                       keeping the provider
                                                       replaceable

  Similarity baseline     scikit-learn TF-IDF + cosine Lightweight approach
                          similarity                   suitable for small
                                                       collections

  Background processing   FastAPI background task for  Avoids adding a
                          the small MVP                separate queue system
                                                       prematurely

  Backend tests           Pytest + HTTPX               Test backend logic and
                                                       API endpoints

  Frontend tests          Vitest where configured      Test important UI
                                                       behaviour if frontend
                                                       test setup is added

  Frontend hosting        Vercel or Netlify            Straightforward static
                                                       frontend hosting

  Backend hosting         Render or another Python     Straightforward FastAPI
                          host                         deployment

  MVP file storage        Private local upload         Simple prototype
                          directory / persistent disk  storage; deployment
                                                       must account for
                                                       persistence

  Collection limit        Maximum 5 PDFs               Keeps the MVP workload
                                                       manageable

  Suggested file limit    10 MB per PDF                Initial upload limit,
                                                       adjustable after
                                                       testing

  User journey            Upload → Understand →        Keeps the experience
                          Explore → Discover           guided and
                                                       beginner-friendly

  Evidence                Preserve paper IDs and       Makes generated
                          original page references     insights verifiable

  Missing information     Show "Not found in paper"    Prevents guessed
                                                       metadata or findings

  AI integrity            Separate author-stated facts Makes the origin and
                          from AI interpretation       certainty of claims
                                                       clearer

  Research gaps           Describe as                  A small uploaded
                          potential/collection-based   collection cannot prove
                          gaps                         global novelty

  Security                Keep provider keys on the    Prevents exposing
                          backend                      secrets in browser code

  Scope                   Complete the evidence-first  Reduces delivery risk
                          core MVP before optional     and avoids premature
                          features                     complexity
  ----------------------------------------------------------------------------

### Architecture choices requiring approval before change

Do not independently replace the database, storage approach, AI
provider, architecture style, or core technology stack. Do not introduce
microservices, a distributed queue, a vector database, OCR, or a full
authentication system for the initial MVP without explicit approval.

### Design decisions

The design specification proposes a calm, modern academic workspace:

-   Proposed primary teal: `#0F766E`
-   Proposed ink/navy: `#172B4D`
-   Proposed page background: `#F8FAFC`
-   Proposed surface: `#FFFFFF`
-   Proposed body text: `#334155`
-   Proposed font: Inter with system sans-serif fallback
-   Proposed spacing base: 4px
-   Proposed Tailwind breakpoints: `sm 640px`, `md 768px`, `lg 1024px`,
    `xl 1280px`, `2xl 1536px`

These exact visual tokens are design recommendations, not values
mandated by the original PRD or architecture. Preserve the accessibility
and usability goals if tokens are adjusted.

------------------------------------------------------------------------

## 4. Implemented Features

**Initial status: NONE VERIFIED.**

No code implementation has been reported or inspected as part of
creating this baseline. The following are planned capabilities, not
completed features:

-   [ ] Frontend application shell and navigation
-   [ ] Backend FastAPI application and health endpoint
-   [ ] Database setup and collection persistence
-   [ ] Collection create/read/delete operations
-   [ ] PDF upload and validation
-   [ ] Private PDF storage
-   [ ] Page-by-page PDF text extraction
-   [ ] Paper processing statuses
-   [ ] Gemini provider adapter
-   [ ] Structured single-paper analysis
-   [ ] Paper detail/results UI
-   [ ] Cross-paper themes and similarity
-   [ ] Paper comparison
-   [ ] Evidence and citation links
-   [ ] Paper deletion and dependent-data cleanup
-   [ ] Automated tests
-   [ ] Deployment and smoke tests
-   [ ] README setup/deployment instructions

Update this section only after inspecting the implementation. A UI
mockup, placeholder endpoint, or hard-coded sample response must not be
described as a working end-to-end feature.

------------------------------------------------------------------------

## 5. Important Files and Their Responsibilities

### 5.1 Project reference documents

These project documents are the current planning baseline:

  -----------------------------------------------------------------------
  File                                Responsibility
  ----------------------------------- -----------------------------------
  `SearchMate_PRD.md`                 Product vision, users, user
                                      stories, functional/non-functional
                                      requirements, MVP scope, and
                                      success criteria

  `SearchMate_Architecture.md`        Approved technical stack, system
                                      architecture, data flow,
                                      frontend/backend structure, API and
                                      persistence design

  `rules.md`                          Engineering constitution for AI
                                      coding agents: code organisation,
                                      naming, security, testing, AI
                                      integrity, and change control

  `phases.md`                         Ordered implementation phases,
                                      tasks, dependencies, testing
                                      checkpoints, definitions of done,
                                      and MVP acceptance checklist

  `design.md`                         Visual direction, design tokens,
                                      typography, spacing, responsive
                                      layout, reusable UI components,
                                      page structure, states, and
                                      accessibility
  -----------------------------------------------------------------------

Use the actual repository filenames if they differ. The names above are
logical document names; confirm the repository's real paths during Phase
0.

### 5.2 Planned frontend files

The architecture suggests the following structure. These are planned
responsibilities, not confirmation that the files exist.

  -----------------------------------------------------------------------------------
  Planned path                                    Responsibility
  ----------------------------------------------- -----------------------------------
  `frontend/src/app/App.jsx`                      Main frontend application
                                                  entry/composition

  `frontend/src/app/routes.jsx`                   Route definitions

  `frontend/src/components/Navbar.jsx`            Shared navigation

  `frontend/src/components/FileUploader.jsx`      PDF selection and upload
                                                  interaction

  `frontend/src/components/UploadProgress.jsx`    Upload/processing progress

  `frontend/src/components/PaperCard.jsx`         Paper summary/list item

  `frontend/src/components/CitationLink.jsx`      Source-paper/page navigation

  `frontend/src/components/ThemeCard.jsx`         Shared theme presentation

  `frontend/src/components/ComparisonTable.jsx`   Side-by-side paper comparison

  `frontend/src/components/EmptyState.jsx`        Empty-state presentation

  `frontend/src/components/ErrorMessage.jsx`      Actionable error presentation

  `frontend/src/pages/HomePage.jsx`               Landing page

  `frontend/src/pages/WorkspacePage.jsx`          Workspace and upload experience

  `frontend/src/pages/CollectionPage.jsx`         Collection overview

  `frontend/src/pages/PaperDetailPage.jsx`        Individual paper analysis

  `frontend/src/pages/ComparePage.jsx`            Cross-paper comparison

  `frontend/src/pages/DiscoverPage.jsx`           Discovery/optional exploration
                                                  experience

  `frontend/src/services/api.js`                  Frontend API communication

  `frontend/src/hooks/`                           Reusable React hooks

  `frontend/src/utils/`                           Small pure frontend helpers

  `frontend/src/styles/`                          Global styles and design tokens
  -----------------------------------------------------------------------------------

### 5.3 Planned backend files

  --------------------------------------------------------------------------------------
  Planned path                                       Responsibility
  -------------------------------------------------- -----------------------------------
  `backend/app/main.py`                              FastAPI application setup and
                                                     router registration

  `backend/app/core/config.py`                       Environment-based configuration

  `backend/app/core/database.py`                     SQLAlchemy engine/session/database
                                                     setup

  `backend/app/core/logging.py`                      Safe application logging

  `backend/app/api/routes/collections.py`            Collection HTTP endpoints

  `backend/app/api/routes/papers.py`                 Paper upload/list/detail/delete
                                                     endpoints

  `backend/app/api/routes/analysis.py`               Paper and collection analysis
                                                     endpoints

  `backend/app/api/routes/questions.py`              Collection Q&A endpoints if/when
                                                     implemented

  `backend/app/models/`                              SQLAlchemy persistence models for
                                                     collections, papers, pages,
                                                     analysis, and citations

  `backend/app/schemas/`                             Pydantic request, response, and
                                                     AI-output schemas

  `backend/app/services/pdf_service.py`              PDF validation and page-level text
                                                     extraction

  `backend/app/services/paper_analysis_service.py`   Single-paper analysis workflow

  `backend/app/services/relationship_service.py`     Cross-paper themes, similarity, and
                                                     relationships

  `backend/app/services/retrieval_service.py`        Evidence retrieval for collection
                                                     questions if implemented

  `backend/app/services/research_idea_service.py`    Optional research idea generation

  `backend/app/services/ai/base_provider.py`         Replaceable AI provider interface

  `backend/app/services/ai/gemini_provider.py`       Gemini-specific provider
                                                     integration

  `backend/app/repositories/`                        Database query/persistence
                                                     operations separated from business
                                                     logic

  `backend/app/utils/`                               Small backend utilities

  `backend/uploads/`                                 Private runtime PDF storage;
                                                     uploaded user papers must not be
                                                     committed

  `backend/tests/`                                   Backend automated tests

  `backend/requirements.txt`                         Python dependencies

  `backend/.env.example`                             Placeholder environment-variable
                                                     documentation only
  --------------------------------------------------------------------------------------

### 5.4 Root-level files

  -----------------------------------------------------------------------
  Planned path                        Responsibility
  ----------------------------------- -----------------------------------
  `.gitignore`                        Exclude secrets, virtual
                                      environments, dependencies,
                                      uploads, local databases, caches,
                                      and build output

  `README.md`                         Project overview, prerequisites,
                                      local setup, run commands,
                                      configuration, and deployment
                                      instructions

  `memory.md`                         This living project-state record
  -----------------------------------------------------------------------

Do not create all suggested files mechanically. Follow the actual
repository structure and add only files needed for the current phase.

------------------------------------------------------------------------

## 6. Known Bugs and Limitations

### Known bugs

**No implementation has been inspected, so no application bugs have been
verified or logged yet.**

-   Known confirmed bugs: None recorded.
-   Bug triage status: Not started.
-   Do not interpret "none recorded" as proof that the application is
    bug-free.

Add each discovered bug with: - Short ID/title - Affected file/module -
Steps to reproduce - Expected behaviour - Actual behaviour -
Severity/priority - Status (`open`, `in progress`, `fixed`,
`verified`) - Verification evidence (test name, command, or manual
steps)

### Confirmed MVP limitations and boundaries

-   The initial workflow targets small collections of up to 5 PDFs.
-   Suggested maximum PDF size is 10 MB per file.
-   Initial PDF support is for text-based PDFs; OCR for scanned
    documents is out of scope.
-   SearchMate analyses user-uploaded papers; it is not a full
    internet-wide academic search engine.
-   The MVP does not replace expert supervision or a formal literature
    review.
-   The system cannot prove a research gap is globally novel.
-   AI-generated claims must be grounded in uploaded papers and linked
    to evidence where available.
-   Missing information must not be guessed.
-   AI-provider quotas, latency, availability, and possible costs may
    affect processing.
-   SQLite and local upload storage are prototype choices; production
    deployment must configure persistent storage and reassess database
    suitability for concurrent/multi-user use.
-   Full authentication and advanced infrastructure are not part of the
    initial MVP unless explicitly approved.

### Risks to verify during implementation

-   PDF extraction quality varies by document structure and formatting.
-   AI responses may be malformed, incomplete, or unsupported; schema
    and evidence validation are required.
-   A failed PDF must not invalidate successfully processed papers.
-   Background processing status must not report completion before
    analysis validation and persistence succeed.
-   Secrets and private paper contents must not leak through frontend
    bundles, API responses, logs, or Git.
-   A host's ephemeral filesystem may lose uploaded files unless
    persistent storage is configured.

------------------------------------------------------------------------

## 7. Pending Tasks

The authoritative detailed task breakdown is in `phases.md`. This
section is a compact project-state checklist and should be updated as
work progresses.

### P0 --- MVP tasks

-   [ ] Phase 0: inspect repository and confirm current state.
-   [ ] Phase 1: create/confirm React + Vite frontend and FastAPI
    backend skeleton.
-   [ ] Phase 1: configure Tailwind, Lucide React, environment
    configuration, `.gitignore`, and local development.
-   [ ] Phase 1: verify frontend and backend start and communicate.
-   [ ] Phase 2: configure SQLAlchemy and SQLite.
-   [ ] Phase 2: define collection, paper, page, analysis, and citation
    persistence models as needed.
-   [ ] Phase 2: define Pydantic schemas and `/api/v1` API contracts.
-   [ ] Phase 2: implement and test collection operations.
-   [ ] Phase 3: implement secure PDF upload and validation.
-   [ ] Phase 3: enforce file-size and per-collection limits.
-   [ ] Phase 3: extract and persist page text with original page
    numbers.
-   [ ] Phase 3: implement processing status, paper deletion, and
    cleanup.
-   [ ] Phase 4: implement the replaceable AI provider interface and
    Gemini adapter.
-   [ ] Phase 4: validate structured AI output and persist paper
    analysis/evidence.
-   [ ] Phase 5: build the frontend upload and paper-results workflow.
-   [ ] Phase 6: implement cross-paper themes, similarity, comparison,
    and evidence links.
-   [ ] Phase 7: test reliability, security, failure handling, and
    usability.
-   [ ] Phase 8: deploy, document setup, and run MVP smoke tests.

### P1 / stretch --- Only after core MVP

-   [ ] Collection Q&A using evidence retrieval.
-   [ ] Recurring limitation grouping and potential-gap exploration.
-   [ ] Evidence-grounded project idea suggestions.
-   [ ] Publication-year timeline/trend view.

### Explicitly avoid for the initial MVP unless approved

-   Microservices
-   Distributed task queues
-   Vector database
-   OCR pipeline
-   Full authentication/role system
-   Complex network visualisations
-   Unbounded academic web search

------------------------------------------------------------------------

## 8. Latest Verified Test Status

**Status: NOT RUN / NOT VERIFIED**

  -----------------------------------------------------------------------
  Check                   Latest status           Evidence
  ----------------------- ----------------------- -----------------------
  Repository inspection   Not verified            No repository
                                                  inspection recorded

  Frontend                Not run                 No command output
  installation/build                              recorded

  Frontend tests          Not run                 No test execution
                                                  recorded

  Backend dependency      Not run                 No command output
  installation                                    recorded

  Backend startup         Not run                 No startup result
                                                  recorded

  API health endpoint     Not run                 No endpoint result
                                                  recorded

  Database initialization Not run                 No verification
                                                  recorded

  PDF upload/extraction   Not run                 No test execution
  tests                                           recorded

  AI provider integration Not run                 No provider call or
                                                  mock test recorded

  End-to-end workflow     Not run                 No end-to-end run
                                                  recorded

  Deployment smoke test   Not run                 No deployment
                                                  verification recorded
  -----------------------------------------------------------------------

**Never change a status to PASS based only on code generation or an
agent's statement.** Record the exact command, environment, date,
result, and any skipped checks. If a check has not been executed, keep
it as `NOT RUN`.

Suggested future test record:

  ------------------------------------------------------------------------------
  Date              Command/test             Result            Notes
  ----------------- ------------------------ ----------------- -----------------
  YYYY-MM-DD        `command or test name`   PASS / FAIL / NOT Environment,
                                             RUN               output summary,
                                                               failures

  ------------------------------------------------------------------------------

------------------------------------------------------------------------

## 9. Next Recommended Action

**Start with Phase 0: inspect the actual SearchMate repository before
writing application code.**

1.  Open the project folder in the coding environment.
2.  Inspect the existing files, Git status, package manifests,
    environment files, and test setup.
3.  Confirm whether the repository is empty or contains starter code.
4.  Record the actual findings in this document.
5.  Then complete Phase 1 according to `phases.md`, without overwriting
    existing work.

Do not start by implementing AI analysis or adding optional features.
First establish the actual project state and a runnable frontend/backend
foundation.

------------------------------------------------------------------------

## 10. Instructions for Updating This File After Each Meaningful Coding Session

Treat `memory.md` as the handover source for the next coding session.
Update it at the end of every meaningful implementation, debugging,
testing, or architecture session.

### Required update procedure

1.  **Inspect the actual changes**
    -   Review modified and newly created files.
    -   Check `git status` and the diff.
    -   Do not rely only on the coding agent's summary.
2.  **Update the current phase**
    -   Keep the phase unchanged until its definition of done and
        testing checkpoint are verified.
    -   Mark individual tasks complete only when the corresponding work
        exists and has been checked.
    -   Record blockers and partially completed tasks.
3.  **Update implemented features**
    -   List only features that are present in the repository.
    -   Distinguish a working feature from a UI placeholder, mock
        response, stub, or incomplete integration.
    -   Include relevant file paths.
4.  **Record confirmed decisions**
    -   Add decisions only after they are explicitly approved or
        confirmed.
    -   Include the reason and date.
    -   Mark proposed ideas as proposals, not decisions.
    -   Ask for approval before recording an architecture-changing
        choice as confirmed.
5.  **Record bugs and limitations**
    -   Add reproducible bugs with steps, expected/actual behaviour,
        severity, and status.
    -   Move fixed bugs to `fixed` only after verifying the fix.
    -   Keep known product limitations separate from implementation
        bugs.
6.  **Record test results honestly**
    -   Include the exact command or test name, date, result, and short
        notes.
    -   Use `PASS`, `FAIL`, `NOT RUN`, or `BLOCKED`.
    -   Never infer a passing test from successful code generation or a
        successful build.
    -   State which checks were skipped and why.
7.  **Update pending tasks**
    -   Remove or check off only verified completed work.
    -   Add newly discovered work and blockers.
    -   Keep P0 MVP tasks above P1/stretch tasks.
8.  **Set the next recommended action**
    -   Name one concrete next task.
    -   Prefer the earliest unfinished dependency in `phases.md`.
    -   Include the expected verification step where useful.
9.  **Update the document metadata**
    -   Set `Last updated` to the current date.
    -   Update overall implementation progress only when supported by
        repository evidence.
    -   Keep this document concise enough to scan, but detailed enough
        to resume work without guessing.

### Suggested session update template

Append or adapt this block when a session produces meaningful progress:

``` markdown
### Session update — YYYY-MM-DD

**Phase:** Phase N — Name  
**Work completed:**
- [Verified change and file path]

**Work in progress:**
- [Incomplete change and remaining work]

**Tests run:**
- `exact command` — PASS / FAIL / BLOCKED / NOT RUN
- Notes: [short result]

**Bugs discovered/fixed:**
- [Issue, status, and verification]

**Decisions confirmed:**
- [Decision and rationale, or “None”]

**Blockers:**
- [Blocker, or “None”]

**Next action:**
- [One concrete next step]
```

### Handover rules for AI coding agents

-   Read `memory.md`, `rules.md`, the relevant sections of the
    PRD/architecture/design documents, and the current code before
    making changes.
-   The actual repository is the source of truth for implementation
    status; this memory file is a maintained summary, not proof that
    code exists.
-   If this file conflicts with the repository, inspect the repository
    and correct this file.
-   If this file conflicts with the PRD, architecture, or rules, stop
    and resolve the conflict rather than silently choosing.
-   Never fabricate completed work, test results, files, bugs, or
    decisions.
-   Make the smallest safe change and preserve existing work.
-   Ask before changing approved architecture, stack, storage, database,
    or external services.

------------------------------------------------------------------------

## 11. Change Log

  -----------------------------------------------------------------------
  Date                                Update
  ----------------------------------- -----------------------------------
  2026-11-22                          Created initial project-memory
                                      baseline from the SearchMate PRD,
                                      architecture, rules, development
                                      phases, and design specification.
                                      Implementation marked NOT STARTED;
                                      no code or tests claimed.

  -----------------------------------------------------------------------

## Feature-scope update --- requested capability alignment (2026-11-22)

The product scope has been clarified to include the following planned
capabilities. This is a requirements update only; it does **not** change
the verified implementation status above.

### Confirmed intended capabilities

-   Upload multiple research-paper PDFs into one collection (current MVP
    boundary remains a maximum of five supported text-based PDFs).
-   Extract abstracts and keywords, alongside the existing metadata,
    objectives, methodologies, datasets, findings, limitations, and
    future-work fields.
-   Identify recurring research themes and overlapping topics/keywords.
-   Compare methodologies and other paper attributes, including
    datasets, findings, and limitations.
-   Explore paper/theme relationships through readable grouped views; an
    interactive relationship graph is a post-MVP enhancement with
    evidence-linked nodes and edges.
-   Identify topics that recur but appear insufficiently explored within
    the uploaded collection, using separate evidence for recurrence and
    limited exploration.
-   Find limitations shared by multiple papers and use those
    limitations/gaps to suggest possible future research directions and
    project ideas.
-   Compare apparently conflicting findings and explain possible
    differences only when supported by paper context. SearchMate
    contextualises conflicts; it does not claim to prove which result is
    correct.
-   Show publication-year distributions and cautious topic movement
    summaries. Claims of emergence/decline require enough papers and a
    meaningful year range.
-   Let users ask questions about individual papers or the collection
    and receive answers grounded in uploaded papers with paper/page
    references; return an insufficient-evidence response when needed.

### Intended product differentiator

The intended USP is a single beginner-friendly, evidence-first workflow
connecting multi-paper understanding, comparison, relationship
exploration, potential-gap discovery, grounded Q&A, and research/project
direction suggestions. This is product positioning, not a verified
competitor benchmark.

### Scope and status safeguards

-   Existing MVP limits and architecture decisions remain unchanged
    unless the owner approves a change.
-   The interactive graph, richer underexplored-topic detection, and
    advanced trend interpretation remain stretch/post-MVP unless their
    prerequisites and acceptance criteria are met.
-   Do not infer implementation from this requirements update.
    Implementation progress remains **NOT STARTED** and tests remain
    **NOT RUN** until verified in the actual repository.

------------------------------------------------------------------------

## Project Memory Update --- Interactive Graph Priority Decision (2026-11-22)

### Confirmed scope decision

The interactive research graph is now split into two delivery levels:

**Essential --- MVP** - Paper and theme nodes. - Labelled relationship
lines. - Click-to-view node and edge details. - Evidence references with
paper/page information where available. - Zoom, pan, fit/reset. - Search
across paper titles, themes, and available keywords. - Filters for node
types and relationship types. - Accessible list/table alternative.

**Advanced --- Post-MVP** - Potential research-gap nodes. -
Conflicting-finding nodes/links with contextual evidence. -
Publication-year graph filters. - Custom layouts (force-directed,
hierarchical, circular). - Relationship-strength visualization using a
documented measure.

### Architecture and implementation constraints

-   The graph is a view over existing relationship-analysis output.
-   Use JSON nodes/edges through the existing FastAPI modular monolith.
-   Reuse SQLite and existing paper/theme/evidence records.
-   No graph database, microservice, vector database, or distributed
    queue is required.
-   Keep grouped theme cards, paper comparison, and a list/table
    alternative.
-   Evidence traceability is mandatory for every displayed relationship.

### Implementation status

This is a **scope and planning decision only**. It does not mean the
graph has been implemented. The project implementation status remains
**NOT STARTED** and tests remain **NOT RUN** unless a later verified
coding session updates those facts.

### Handover notes

Before coding, inspect the current repository and align the proposed
graph response model and endpoint with the actual schema. Select a graph
library only after reviewing licence, maintenance, bundle size, keyboard
accessibility, and reduced-motion support. Complete the essential graph
within the MVP phases; defer advanced graph modes until after MVP
acceptance.
