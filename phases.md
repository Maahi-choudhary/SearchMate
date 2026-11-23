# SearchMate --- Development Phases

**Document version:** 1.0\
**Based on:** SearchMate PRD v1.0, System Architecture v1.0, and AI
Coding Agent Rules v1.0\
**Target:** Individual developer, approximately 1--2 weeks\
**Delivery approach:** Build and verify the smallest complete
evidence-first workflow before adding optional features.

------------------------------------------------------------------------

## 1. Purpose and Implementation Strategy

This document defines the recommended development sequence for
SearchMate. Each phase depends on the foundations established by earlier
phases. Complete the definition of done and testing checkpoint for a
phase before treating its dependent phase as ready.

SearchMate's core workflow is:

**Create collection → Upload PDFs → Validate and extract text →
Understand each paper → Compare papers → Show evidence and source
references.**

The product should guide beginners through:

**Upload → Understand → Explore → Discover**

### Delivery principles

1.  Follow the approved modular-monolith architecture: React + Vite
    frontend, FastAPI backend, SQLAlchemy + SQLite, PyMuPDF, Pydantic,
    Gemini behind a replaceable provider adapter, and TF-IDF + cosine
    similarity.
2.  Keep the frontend, API, PDF extraction, persistence, AI integration,
    and analysis logic separated.
3.  Build the required MVP features before optional capabilities.
4.  Preserve paper IDs, original page numbers, and evidence references
    throughout the pipeline.
5.  Treat uploaded PDF content as untrusted input. It must never
    override application instructions.
6.  Do not claim an analysis is complete until extraction,
    structured-output validation, and persistence succeed.
7.  Ask for approval before changing the approved architecture, stack,
    database, storage approach, or external services.

------------------------------------------------------------------------

## 2. Phase Overview and Dependency Order

  ----------------------------------------------------------------------------
  Phase        Name                     Priority Estimated effort Depends on
  ------------ ---------------- ---------------- ---------------- ------------
  0            Planning and                   P0          0.5 day None
               repository                                         
               inspection                                         

  1            Project setup                  P0       0.5--1 day Phase 0
               and application                                    
               skeleton                                           

  2            Backend                        P0            1 day Phase 1
               foundation,                                        
               database, and                                      
               API contracts                                      

  3            Collection                     P0        1--2 days Phase 2
               management, PDF                                    
               upload, and                                        
               extraction                                         

  4            AI provider                    P0        1--2 days Phase 3
               integration and                                    
               single-paper                                       
               analysis                                           

  5            Frontend core                  P0        1--2 days Phases 1--4
               workflow and                                       
               paper results                                      

  6            Cross-paper                    P0        1--2 days Phases 4--5
               themes,                                            
               comparison, and                                    
               evidence links                                     

  7            Reliability,                   P0            1 day Phases 2--6
               security,                                          
               testing, and                                       
               usability                                          
               verification                                       

  8            Deployment,                    P0       0.5--1 day Phase 7
               documentation,                                     
               and MVP release                                    

  9            Optional             P1 / stretch     Only if time MVP
               discovery                                  remains milestone
               enhancements                                       
  ----------------------------------------------------------------------------

Estimates are planning guidance, not guarantees. The PRD's target is
1--2 weeks for one developer. PDF length, provider limits, debugging,
and hosting setup can affect the schedule.

------------------------------------------------------------------------

## 3. Phase 0 --- Planning and Repository Inspection

**Goal:** Understand the approved requirements and the existing
repository before creating or changing code.

### Prerequisites

-   SearchMate PRD, architecture document, and `rules.md` are available.
-   Development machine has Git and the required language runtimes
    available.

### Tasks and implementation steps

-   [ ] Read the PRD, architecture, and AI coding rules.
-   [ ] Inspect the current repository and identify existing
    frontend/backend code.
-   [ ] Check the current Git branch, working tree, package files,
    environment files, and existing tests.
-   [ ] Confirm whether the repository is empty or already contains an
    implementation.
-   [ ] Create a short task board or checklist using the phases in this
    document.
-   [ ] Record the approved stack and MVP boundaries.
-   [ ] Identify required configuration values without putting real
    secrets in source control.
-   [ ] Decide which optional requirements will be postponed until after
    the MVP.

### Deliverables

-   A repository assessment.
-   A phase checklist or task board.
-   A confirmed implementation plan and list of known blockers.

### Testing checkpoint

-   Verify that the repository can be inspected without overwriting
    existing work.
-   Verify that no existing user changes are discarded.
-   Confirm the selected runtime/package-manager versions are compatible
    with the project.

### Definition of done

-   [ ] The current project state is understood.
-   [ ] The PRD, architecture, and rules have been reviewed.
-   [ ] MVP versus optional scope is clear.
-   [ ] No architecture-changing decision has been made without
    approval.

------------------------------------------------------------------------

## 4. Phase 1 --- Project Setup and Application Skeleton

**Goal:** Create a runnable frontend and backend with a clean,
maintainable structure.

### Dependencies

-   Phase 0 complete.
-   Node.js/npm (or the repository's existing JavaScript package
    manager) and Python available.

### Tasks and implementation steps

**Repository and frontend** - \[ \] Create or confirm the `frontend/`
application using React + Vite. - \[ \] Configure Tailwind CSS and
Lucide React. - \[ \] Establish the existing or approved folder
structure: - `src/app/` - `src/components/` - `src/pages/` -
`src/services/` - `src/hooks/` - `src/utils/` - `src/styles/` - \[ \]
Add the main application entry point and route structure. - \[ \] Create
a basic responsive application shell and navigation. - \[ \] Add a
central frontend API client configuration.

**Backend** - \[ \] Create or confirm the `backend/` FastAPI
application. - \[ \] Establish the approved backend structure: -
`app/core/` - `app/api/routes/` - `app/models/` - `app/schemas/` -
`app/services/` - `app/services/ai/` - `app/repositories/` -
`app/utils/` - `tests/` - `uploads/` for private runtime files - \[ \]
Add a FastAPI application entry point and a basic health endpoint. - \[
\] Add configuration loading from environment variables. - \[ \] Add
`.env.example` with placeholder values only. - \[ \] Configure
`.gitignore` to exclude `.env`, virtual environments, `node_modules`,
uploads, local databases, caches, and build output. - \[ \] Add the
initial dependency manifests and lockfiles according to the chosen
package managers.

**Local development** - \[ \] Document commands to start the frontend
and backend. - \[ \] Configure local frontend-to-backend API access. -
\[ \] Configure development CORS for the local frontend origin only.

### Deliverables

-   React + Vite frontend that starts locally.
-   FastAPI backend that starts locally.
-   Health endpoint.
-   Initial folder structure, configuration, and ignore rules.

### Testing checkpoint

-   [ ] Frontend development server starts and renders the application
    shell.
-   [ ] Backend starts without import/configuration errors.
-   [ ] Health endpoint returns a successful response.
-   [ ] Frontend can reach the backend health endpoint.
-   [ ] No secrets or private PDFs are tracked by Git.

### Definition of done

Both applications run locally, the frontend/backend connection works,
and the project structure follows the approved architecture.

------------------------------------------------------------------------

## 5. Phase 2 --- Backend Foundation, Database, and API Contracts

**Goal:** Establish persistence and predictable API contracts before
implementing document processing.

### Dependencies

-   Phase 1 complete.
-   Backend application starts successfully.

### Tasks and implementation steps

-   [ ] Configure SQLAlchemy and the SQLite database using
    environment-based configuration.
-   [ ] Create database session and initialization utilities.
-   [ ] Define the initial persistence models for:
    -   Collections
    -   Papers
    -   Page-level extracted text
    -   Paper analysis
    -   Citations/evidence references
    -   Collection themes or relationships when needed
-   [ ] Define foreign keys and deletion behaviour for dependent
    records.
-   [ ] Create Pydantic request and response schemas.
-   [ ] Define consistent success and error response shapes.
-   [ ] Establish stable resource IDs (UUIDs or generated opaque IDs).
-   [ ] Add API route modules under `/api/v1`.
-   [ ] Implement collection create, list/read, and delete operations
    needed by the MVP.
-   [ ] Keep route handlers thin; put business logic in services and
    database access in repositories.
-   [ ] Add configuration for `DATABASE_URL`, `UPLOAD_DIR`,
    `MAX_FILE_SIZE_MB`, and `MAX_PAPERS_PER_COLLECTION`.
-   [ ] Use the recommended MVP defaults of 10 MB per PDF and 5 PDFs per
    collection unless configured otherwise.

### Deliverables

-   Working SQLite persistence.
-   Collection model and API.
-   Pydantic schemas and consistent API response conventions.
-   Repository/service separation.
-   Configuration and database setup documentation.

### Testing checkpoint

-   [ ] Database initialises correctly.
-   [ ] A collection can be created and retrieved through the API.
-   [ ] Invalid request payloads receive clear validation errors.
-   [ ] Unknown collection IDs return a stable not-found error.
-   [ ] Deleting a collection handles its dependent records safely.
-   [ ] API responses match the agreed response structure.

### Definition of done

Collections can be persisted and managed through tested API endpoints,
and the database/API foundation is ready for paper uploads.

------------------------------------------------------------------------

## 6. Phase 3 --- Collection Management, PDF Upload, and Text Extraction

**Goal:** Implement the complete document-ingestion pipeline and
preserve page-level evidence.

### Dependencies

-   Phase 2 complete.
-   Private upload directory and database models are available.

### Tasks and implementation steps

**Upload and validation** - \[ \] Implement the paper upload endpoint
using `multipart/form-data`. - \[ \] Validate file extension and actual
PDF content/signature; do not trust the filename alone. - \[ \] Enforce
the configured maximum file size. - \[ \] Enforce the maximum of 5 PDFs
per collection. - \[ \] Reject unsupported, corrupt, encrypted, and
text-empty/scanned-only PDFs with clear error codes. - \[ \] Prevent
unsupported files from entering the extraction pipeline. - \[ \]
Generate safe server-side filenames; do not use untrusted filenames as
storage paths. - \[ \] Store uploaded PDFs privately in the configured
upload directory. - \[ \] Create a paper record and track the processing
status: `uploaded`, `validating`, `extracting`, `analysing`,
`completed`, `failed`.

**PDF extraction** - \[ \] Use PyMuPDF (`fitz`) to open supported
PDFs. - \[ \] Extract text page by page. - \[ \] Preserve original page
numbers with each extracted page. - \[ \] Check whether enough readable
text was extracted. - \[ \] Persist page text and extraction metadata. -
\[ \] Keep raw PDFs separate from relational metadata. - \[ \] Ensure
one failed PDF does not invalidate successfully processed papers. - \[
\] Add a paper status endpoint for frontend polling. - \[ \] Add paper
deletion and remove the PDF plus associated page data and dependent
records.

### Deliverables

-   Working collection paper upload endpoint.
-   PDF validation service.
-   Page-level PDF text extraction service.
-   Private PDF storage.
-   Paper processing status and deletion behaviour.

### Testing checkpoint

-   [ ] Valid text-based PDF uploads successfully.
-   [ ] Non-PDF, oversized, corrupt, encrypted, and scanned/text-empty
    PDFs are rejected with the expected errors.
-   [ ] The 5-paper collection limit is enforced.
-   [ ] Extracted text retains correct original page numbers.
-   [ ] A failure in one upload does not delete or invalidate other
    successful papers.
-   [ ] Retrying an upload does not create unintended duplicate paper
    records.
-   [ ] Deleting a paper removes its file and dependent extracted data.

### Definition of done

A user can upload supported text-based PDFs into a collection, see their
processing status, and the backend stores page-level text safely for
later analysis.

------------------------------------------------------------------------

## 7. Phase 4 --- AI Provider Integration and Single-Paper Analysis

**Goal:** Turn extracted paper text into validated, beginner-friendly
structured paper explanations.

### Dependencies

-   Phase 3 complete.
-   Server-side AI provider key/configuration is available.
-   AI provider usage limits and possible costs have been checked.

### Tasks and implementation steps

**Provider boundary** - \[ \] Define a provider interface in
`services/ai/base_provider.py`. - \[ \] Implement the Gemini adapter in
`services/ai/gemini_provider.py`. - \[ \] Keep provider SDK calls inside
the adapter. - \[ \] Read provider credentials only from backend
environment variables. - \[ \] Never expose the API key in frontend code
or API responses. - \[ \] Add bounded retry handling for transient
provider/network failures only.

**Prompt and output contract** - \[ \] Store prompts and output schemas
in dedicated modules/files. - \[ \] Treat PDF text as untrusted data;
explicitly prevent document-embedded instructions from overriding
application instructions. - \[ \] Ask for structured output containing
available fields such as: - Title, authors, publication year, abstract,
keywords - Research problem and objective - Methodology and dataset/data
source - Main findings - Author-stated limitations and future work -
Beginner-friendly explanation - \[ \] Use Pydantic to validate the
provider response before saving it. - \[ \] Preserve missing fields as
null or `Not found in paper`; never ask the model to guess. - \[ \]
Retain paper IDs and page/source references for supported claims. - \[
\] Save only validated analysis. - \[ \] Mark the paper `completed` only
after extraction, required analysis validation, and persistence succeed.

### Deliverables

-   Replaceable AI provider interface.
-   Gemini provider implementation.
-   Dedicated prompt and Pydantic output schema.
-   Persisted structured paper analysis.
-   Safe provider failure handling.

### Testing checkpoint

-   [ ] Provider adapter can be tested with a mocked provider response.
-   [ ] Valid structured output passes schema validation.
-   [ ] Invalid or incomplete provider output is rejected and not marked
    completed.
-   [ ] Missing metadata remains missing rather than being invented.
-   [ ] Provider failure returns a safe, stable error.
-   [ ] Transient failures use only a small bounded retry policy.
-   [ ] API keys and PDF contents do not appear in logs or responses.

### Definition of done

At least one supported PDF can be processed into a persisted, validated
paper explanation with explicit missing fields and source references.

------------------------------------------------------------------------

## 8. Phase 5 --- Frontend Core Workflow and Paper Results

**Goal:** Allow a student to complete the upload-to-understanding
journey through a clear interface.

### Dependencies

-   Phase 1 frontend shell is available.
-   Phases 2--4 APIs and response contracts are stable enough to
    integrate.

### Tasks and implementation steps

-   [ ] Build the guided interface around **Upload → Understand →
    Explore → Discover**.
-   [ ] Create the workspace/collection screen.
-   [ ] Add a PDF uploader that accepts PDF files and shows the 10 MB
    and 5-paper limits.
-   [ ] Show per-file upload and processing states.
-   [ ] Poll the paper status endpoint while processing is active.
-   [ ] Build reusable components such as:
    -   `FileUploader`
    -   `UploadProgress`
    -   `PaperCard`
    -   `CitationLink`
    -   `EmptyState`
    -   `ErrorMessage`
-   [ ] Build the collection page and paper detail page.
-   [ ] Display title, authors, year, abstract, keywords, objective,
    methodology, dataset, findings, limitations, and beginner
    explanation when available.
-   [ ] Display `Not found in paper` for unavailable fields.
-   [ ] Show the source paper and page reference beside supported
    information where available.
-   [ ] Add clear loading, empty, success, partial-failure, and error
    states.
-   [ ] Keep the layout responsive and accessible; do not rely on colour
    alone for status.

### Deliverables

-   Usable collection/workspace screen.
-   Upload and processing UI.
-   Paper cards and paper detail view.
-   Visible source references and clear error/empty states.

### Testing checkpoint

-   [ ] A user can create/open a collection and upload PDFs from the UI.
-   [ ] Upload progress and processing statuses are displayed
    accurately.
-   [ ] Successful analysis appears without a page refresh where
    practical.
-   [ ] Failed files show a useful error while successful papers remain
    accessible.
-   [ ] Missing fields display the agreed missing-data label.
-   [ ] Citation/source links navigate to the correct paper/page
    context.
-   [ ] Core screens work at common laptop and mobile widths.

### Definition of done

A first-time user can upload supported papers and read their structured
explanations from the frontend without needing to call the API manually.

------------------------------------------------------------------------

## 9. Phase 6 --- Cross-Paper Themes, Comparison, and Evidence Links

**Goal:** Help users understand relationships across their uploaded
papers, not just read separate summaries.

### Dependencies

-   Phase 4 structured paper analysis is persisted.
-   Phase 5 can display collection and paper data.
-   Paper IDs and source references are preserved.

### Tasks and implementation steps

**Theme and similarity analysis** - \[ \] Collect keywords and key
phrases from analysed papers. - \[ \] Normalise case and remove common
stop words. - \[ \] Use scikit-learn TF-IDF and cosine similarity as the
MVP baseline. - \[ \] Identify recurring terms/themes conservatively. -
\[ \] Store each theme with the IDs of the papers that support it. - \[
\] Include a short explanation of why the papers are connected. - \[ \]
Treat similarity as a clue for exploration, not proof that papers make
the same argument.

**Comparison** - \[ \] Build a readable comparison view for selected
papers. - \[ \] Compare objective, methodology, dataset, findings, and
stated limitations where available. - \[ \] Show missing values
explicitly. - \[ \] Identify apparently different findings only when the
evidence supports the comparison. - \[ \] Do not automatically label
different results as contradictions. - \[ \] Explain differences using
supported context such as datasets, metrics, settings, or research
questions. - \[ \] Mark uncertain comparisons as
`Needs manual verification`.

**Evidence navigation** - \[ \] Ensure every important generated
relationship/insight identifies its supporting paper. - \[ \] Link theme
cards and comparison claims to their source papers. - \[ \] Show page
references when available. - \[ \] Make the source paper easy to open
from an insight.

### Deliverables

-   Theme/relationship analysis service.
-   Collection overview with grouped themes and linked papers.
-   Paper comparison table/view.
-   Evidence-aware source navigation.

### Testing checkpoint

-   [ ] Similarity logic returns expected overlaps for a small
    controlled test set.
-   [ ] Themes link to the correct supporting paper IDs.
-   [ ] Comparison fields map to the correct papers.
-   [ ] Unsupported claims are not shown as facts.
-   [ ] Apparent differences are not automatically described as
    contradictions.
-   [ ] Every displayed AI-generated research claim includes a paper
    reference.
-   [ ] Users can move from an insight to its supporting paper.

### Definition of done

A collection of multiple processed papers displays understandable shared
themes and a useful comparison, with traceable source-paper references.

------------------------------------------------------------------------

## 10. Phase 7 --- Reliability, Security, Testing, and Usability Verification

**Goal:** Harden the complete MVP workflow and verify that it behaves
safely under expected failures.

### Dependencies

-   Phases 2--6 complete.
-   Main upload, analysis, comparison, and source-navigation flows are
    integrated.

### Tasks and implementation steps

-   [ ] Run the full backend test suite using Pytest and HTTPX.
-   [ ] Run configured frontend tests using Vitest, if present.
-   [ ] Test successful and failing paths for upload, extraction,
    analysis, and comparison.
-   [ ] Verify API error responses use stable codes and safe user-facing
    messages.
-   [ ] Verify temporary files and partially written records are cleaned
    up after failures.
-   [ ] Verify failed papers can be retried without reprocessing
    successful papers.
-   [ ] Verify deletion removes uploaded files, extracted pages, and
    dependent analysis/evidence.
-   [ ] Check that logs contain useful operational metadata but no
    secrets, full PDFs, private extracted text, or sensitive questions.
-   [ ] Check file validation, configured size/count limits, and private
    storage.
-   [ ] Check that AI claims are grounded in uploaded papers and missing
    information is not guessed.
-   [ ] Check that document-embedded instructions cannot override
    application instructions.
-   [ ] Review responsive layout, readable typography, contrast, labels,
    and keyboard-accessible controls.
-   [ ] Run the existing lint, format, build, and type-check commands
    where configured.
-   [ ] Inspect the final Git diff for unrelated changes, secrets, debug
    statements, and generated files.

### Deliverables

-   Passing relevant automated tests.
-   Verified end-to-end workflow.
-   Fixed critical defects.
-   A short test report listing passed, failed, and unrun checks.

### Testing checkpoint and acceptance targets

Use a small, manually checked set of research PDFs. The PRD defines
these as prototype targets:

  -----------------------------------------------------------------------
  Measure                                                          Target
  ------------------------------ ----------------------------------------
  First-time users can upload                         At least 4 out of 5
  papers and reach analysis      
  without help                   

  Test papers with usable title,                             At least 80%
  abstract, year, and            
  keywords/key terms             

  User rating for explanation                       Average 4/5 or higher
  clarity                        

  Test users who identify a                           At least 4 out of 5
  meaningful similarity or       
  difference                     

  Displayed AI-generated                                             100%
  research claims with a         
  source-paper reference         

  Processing time for 3 short                      Target under 2 minutes
  text-based PDFs under normal   
  test conditions                

  Successful processing of                                   At least 90%
  supported PDFs in the test set 
  -----------------------------------------------------------------------

These are evaluation targets, not guarantees. Record the test conditions
and results.

### Definition of done

-   [ ] Critical workflow tests pass.
-   [ ] No known critical security, data-loss, or evidence-integrity
    defect remains.
-   [ ] Failures are handled without corrupting successful papers.
-   [ ] Test results are recorded honestly.
-   [ ] The PRD's prototype success metrics have been evaluated or
    explicitly marked as not yet measured.

------------------------------------------------------------------------

## 11. Phase 8 --- Deployment, Documentation, and MVP Release

**Goal:** Make the application reproducible locally and available
through the selected hosting setup.

### Dependencies

-   Phase 7 complete.
-   Hosting accounts and environment configuration are available.
-   A persistent disk is configured for backend SQLite data and private
    PDF uploads if deploying to a host with ephemeral local storage.

### Tasks and implementation steps

**Pre-deployment** - \[ \] Confirm frontend and backend production
build/start commands. - \[ \] Confirm all required environment variables
and their values are known. - \[ \] Configure `VITE_API_BASE_URL` for
the deployed backend. - \[ \] Configure backend values such as
`APP_ENV`, `DATABASE_URL`, `UPLOAD_DIR`, `AI_PROVIDER`,
`GEMINI_API_KEY`, `MAX_FILE_SIZE_MB`, and `MAX_PAPERS_PER_COLLECTION`. -
\[ \] Keep real secrets in the hosting provider's environment settings,
not in Git. - \[ \] Configure CORS to allow only the intended frontend
origin. - \[ \] Verify the deployed backend has persistent storage for
SQLite and uploaded PDFs.

**Deploy** - \[ \] Deploy the React frontend to Vercel or Netlify. - \[
\] Deploy FastAPI to Render or another suitable Python host. - \[ \]
Configure the persistent disk/mount path and database/upload paths. - \[
\] Confirm frontend-to-backend HTTPS communication. - \[ \] Verify
health endpoint and provider connectivity.

**Post-deployment smoke tests** - \[ \] Open the deployed application. -
\[ \] Create a collection. - \[ \] Upload a supported PDF. - \[ \]
Confirm extraction and analysis complete. - \[ \] Confirm paper details
and citations render. - \[ \] Upload a second paper and verify
themes/comparison. - \[ \] Confirm invalid PDF and provider failure
messages are understandable. - \[ \] Restart/redeploy the backend and
verify persistent data remains available.

**Documentation** - \[ \] Update `README.md` with project overview,
stack, prerequisites, setup, run commands, environment variables, tests,
and deployment notes. - \[ \] Explain the MVP limits: text-based PDFs,
10 MB suggested file limit, and 5 PDFs per collection. - \[ \] Explain
that AI output is research assistance and must be verified against the
original papers. - \[ \] Document known limitations, including no OCR
for scanned PDFs.

### Deliverables

-   Deployed frontend and backend.
-   Production environment configuration.
-   Persistent storage configured.
-   README and setup/deployment instructions.
-   MVP smoke-test report.

### Definition of done

-   [ ] The deployed app completes the core workflow.
-   [ ] The frontend communicates with the deployed backend over HTTPS.
-   [ ] Uploaded files and database data persist across backend
    restarts/redeployments as supported by the host configuration.
-   [ ] Secrets remain server-side.
-   [ ] README instructions are sufficient for another developer to run
    the project locally.

------------------------------------------------------------------------

## 12. MVP Completion Milestone

```{=html}
<aside>
```
**MVP is complete when a student can create a collection, upload at
least two supported text-based research PDFs, receive validated
beginner-friendly explanations for the papers, view shared themes and a
comparison, and open the supporting source paper/page for important
claims.**
```{=html}
</aside>
```
### Required MVP acceptance checklist

-   [ ] React + Vite frontend and FastAPI backend run locally and are
    deployable.
-   [ ] User can create and open a collection.
-   [ ] User can upload multiple PDFs, up to 5 per collection.
-   [ ] PDF file type, content, size, and readability are validated.
-   [ ] Page text is extracted with original page numbers.
-   [ ] Paper analysis is generated through the backend AI provider
    adapter.
-   [ ] AI output is validated before persistence and display.
-   [ ] Missing details are shown as missing, not guessed.
-   [ ] Paper objective, methodology, findings, and stated limitations
    are displayed where available.
-   [ ] Cross-paper themes/keywords and a readable comparison are
    available.
-   [ ] Important generated claims and relationships link to supporting
    papers and page references where available.
-   [ ] Upload and processing progress, empty states, and useful errors
    are implemented.
-   [ ] A failed paper does not invalidate successful papers.
-   [ ] Paper deletion removes associated files and dependent data.
-   [ ] API keys and private paper contents are not exposed in frontend
    code or logs.
-   [ ] Relevant automated tests and deployment smoke tests have been
    run.
-   [ ] README contains local setup and deployment instructions.

**MVP release rule:** Do not delay the MVP to build optional Q&A,
advanced gap grouping, project idea generation, or a publication trend
timeline. First deliver and verify the core upload → extract →
understand → compare → evidence workflow.

------------------------------------------------------------------------

## 13. Phase 9 --- Optional Enhancements (After MVP)

These features are valuable but must not block the MVP. Implement only
after the MVP milestone is met and stable.

### 9.1 Collection Q&A --- Should / stretch

**Prerequisites:** Page-level text and paper references are persisted;
core analysis and evidence links work.

-   [ ] Split extracted page text into manageable chunks while retaining
    paper ID and page number.
-   [ ] Retrieve relevant chunks using TF-IDF similarity.
-   [ ] Send only retrieved evidence and the user's question to the AI
    provider.
-   [ ] Require answers to use only the supplied uploaded-paper
    evidence.
-   [ ] Validate that returned citations refer to retrieved chunks.
-   [ ] Return a clear `not enough information` response when evidence
    is insufficient.
-   [ ] Display answer citations and links to the relevant paper/page.

**Testing:** Verify that answers cannot cite nonexistent chunks,
unsupported claims are rejected, and insufficient evidence is handled
clearly.

### 9.2 Recurring limitations and potential gaps --- Should / stretch

**Prerequisites:** Author-stated limitations and future-work statements
are extracted and persisted.

-   [ ] Group similar limitations across papers.
-   [ ] Show which papers mention each recurring limitation.
-   [ ] Label potential gaps as gaps within the uploaded collection.
-   [ ] Explain that a collection-based gap is not proof that no prior
    research exists.

**Testing:** Verify that author-stated limitations are distinguished
from AI interpretation and every recurring pattern links to its
supporting papers.

### 9.3 Research idea generator --- Should / stretch

**Prerequisites:** Theme and limitation evidence is available.

-   [ ] Generate a small number of possible project directions.
-   [ ] Include a title, problem, rationale, related themes/limitations,
    supporting papers, and first validation step.
-   [ ] Label ideas as directions to investigate, not verified novel
    contributions.

**Testing:** Check that every idea is grounded in stored evidence and is
not described as guaranteed novel or feasible.

### 9.4 Publication-year timeline --- Could / stretch

**Prerequisites:** Publication years and keywords are available for
enough papers.

-   [ ] Group extracted keywords/themes by publication year.
-   [ ] Display a simple year-wise chart or timeline.
-   [ ] Avoid claims such as "emerging" or "declining" when the uploaded
    collection is too small to support them.

**Testing:** Verify correct year grouping and conservative descriptions.

------------------------------------------------------------------------

## 14. Prioritized Master Task Checklist

Use this as the single high-level execution checklist. Detailed tasks
and acceptance criteria are defined in the phase sections above.

### P0 --- Required for MVP

-   [ ] Review PRD, architecture, and rules.
-   [ ] Inspect repository and protect existing work.
-   [ ] Set up React + Vite and FastAPI.
-   [ ] Configure environment variables, `.gitignore`, and local run
    instructions.
-   [ ] Implement SQLite, SQLAlchemy models, Pydantic schemas, and API
    response conventions.
-   [ ] Implement collection creation and retrieval.
-   [ ] Implement PDF upload, validation, private storage, and 5-paper
    limit.
-   [ ] Extract page-level text with PyMuPDF and preserve page numbers.
-   [ ] Implement paper processing statuses and clear failure handling.
-   [ ] Implement replaceable AI provider adapter and Gemini
    integration.
-   [ ] Validate structured paper-analysis output before saving it.
-   [ ] Display paper metadata, objective, methodology, findings,
    limitations, and beginner explanation.
-   [ ] Display missing information honestly.
-   [ ] Implement TF-IDF/cosine-similarity-based shared themes.
-   [ ] Implement readable paper comparison.
-   [ ] Link insights to supporting papers and page references where
    available.
-   [ ] Implement paper deletion and dependent-data cleanup.
-   [ ] Test expected success and failure cases.
-   [ ] Verify evidence integrity, privacy, and error handling.
-   [ ] Deploy frontend/backend with persistent backend storage.
-   [ ] Write README and complete smoke tests.

### P1 --- Important, but may follow the MVP

-   [ ] Collection Q&A with evidence retrieval and validated citations.
-   [ ] Group recurring author-stated limitations.
-   [ ] Display potential gaps with clear qualifications.
-   [ ] Suggest evidence-linked project directions.

### P2 --- Optional enhancements

-   [ ] Year-wise keyword/trend timeline.
-   [ ] More advanced visual relationship exploration.
-   [ ] Other enhancements only after user approval and MVP validation.

------------------------------------------------------------------------

## 15. Explicitly Out of Scope for the Initial MVP

Do not implement these as part of the initial delivery unless the user
approves a scope or architecture change:

-   OCR for scanned PDFs.
-   Internet-wide or academic-database search.
-   A vector database or embedding-based retrieval system.
-   Microservices or a separate distributed task queue.
-   Advanced authentication and multi-user ownership systems.
-   Sophisticated research network graphs.
-   PostgreSQL migration before there is a demonstrated need.
-   Object storage before there is a demonstrated need.
-   Multiple backend workers or high-volume production infrastructure.

The approved MVP uses a modular monolith, SQLite, private
local/persistent file storage, FastAPI background tasks for the small
workload, and TF-IDF retrieval where needed.

------------------------------------------------------------------------

## 16. Change Control and Phase Management

-   Complete phases in dependency order. A later phase may be explored
    in parallel only when its prerequisites and API contracts are
    stable.
-   Keep each implementation task small and reviewable.
-   After each phase, run its relevant tests and inspect the Git diff.
-   Update this checklist when scope or implementation status changes.
-   Do not silently skip a failed test; record the failure and resolve
    or explicitly accept it.
-   Do not mark a phase complete based only on generated code. Verify
    that it runs and meets its definition of done.
-   Ask before major architectural changes, new infrastructure, paid
    services, or changes to the approved stack.
-   Do not commit or push changes unless the user authorises it.

**Final engineering principle:** Build the smallest reliable pipeline
first. SearchMate's value comes from understandable research insights
that users can verify in their uploaded papers---not from the number of
AI features or visualisations.

### 9.5 Interactive research relationship graph --- Could / post-MVP

**Prerequisites:** Cross-paper themes and relationship records exist,
and each relationship can be traced to supporting papers/evidence.

-   [ ] Define a graph view model with paper/theme nodes and typed
    relationship edges.
-   [ ] Display shared topics, keyword overlap, methodology similarity,
    related datasets/settings, and differing findings only when
    supported by stored analysis.
-   [ ] Add node/edge selection with a details panel, supporting paper
    links, and page references.
-   [ ] Add simple relationship filters and a list/table alternative.
-   [ ] Preserve keyboard access, screen-reader labels, and responsive
    behaviour.
-   [ ] Keep the graph optional; the core theme cards and comparison
    view must work without it.

**Testing:** Verify every displayed node and edge maps to valid records,
every relationship has supporting evidence, and selection opens the
correct paper/page. Test keyboard navigation and the non-graph
alternative.

### 9.6 Repeated but potentially underexplored topics --- Should / stretch

**Prerequisites:** Recurring themes, extracted limitations, and
future-work statements are available.

-   [ ] Detect topics repeated across multiple papers.
-   [ ] Separately identify evidence that the topic receives limited
    exploration in the uploaded collection (for example, narrow
    datasets/settings, stated limitations, unanswered questions, or
    future-work statements).
-   [ ] Store separate evidence for recurrence and for limited
    exploration.
-   [ ] Label results `Potentially underexplored in this collection` and
    link the supporting papers/pages.

**Testing:** Reject unsupported underexplored-topic claims and verify
that a repeated topic is not automatically treated as a research gap.

### 9.7 Conflict contextualisation --- refinement to Phase 6

-   [ ] Compare differing findings alongside research question,
    dataset/sample, method, metric, and setting when available.
-   [ ] Explain differences only using evidence in the uploaded papers.
-   [ ] Distinguish a possible explanation from an established
    explanation.
-   [ ] Use `Needs manual verification` or
    `No supported explanation found` when appropriate; do not claim that
    SearchMate proves which result is correct.

**Testing:** Include controlled cases with genuinely different contexts
and cases where the papers do not provide enough information to explain
the difference.

### 9.8 Year-wise topic movement --- refinement to timeline

-   [ ] Show yearly counts and paper links for keywords/themes.
-   [ ] Describe observed increases/decreases only when the collection
    has enough papers and a meaningful publication-year spread.
-   [ ] Use a neutral year-wise distribution for small or sparse
    collections and display a small-sample caveat.

**Testing:** Verify year grouping, counts, and conservative labels for
small datasets.

------------------------------------------------------------------------

## Scope Revision --- Interactive Research Graph Priorities (2026-11-22)

This revision supersedes the earlier Phase 9.5 wording that placed the
entire graph after MVP. The graph is split into essential and advanced
deliveries.

### Essential graph work --- MVP

Implement after cross-paper relationships and evidence references are
available in Phase 6, complete verification during Phase 7, and include
it in the Phase 8 MVP release checklist.

**Implementation tasks** - \[ \] Define a validated graph response model
with stable paper/theme node IDs and typed edge IDs. - \[ \] Map
existing paper-theme and supported paper relationship records into graph
nodes and edges. - \[ \] Ensure every edge resolves to source/target
nodes and supporting evidence/page references. - \[ \] Add a
collection-scoped graph read endpoint using existing authorization and
API conventions. - \[ \] Build the React graph canvas and Graph/List or
Graph/Table toggle. - \[ \] Implement paper and theme node rendering
with labels. - \[ \] Implement labelled relationship lines and
click/keyboard selection. - \[ \] Implement node, edge, and evidence
details panel. - \[ \] Implement zoom, pan, fit/reset, search (paper
title/theme/keyword), node-type filters, and relationship-type
filters. - \[ \] Implement loading, empty, no-results, partial-data, and
error states. - \[ \] Keep existing grouped theme cards and comparison
tables available as alternatives. - \[ \] Review graph library licence,
maintenance, bundle size, accessibility, and reduced-motion support
before adoption.

**Testing checkpoint** - \[ \] Unit-test graph serialization, stable
IDs, duplicate handling, endpoint validation, and evidence-reference
validation. - \[ \] API-test collection scoping, empty results, missing
records, and unauthorized access. - \[ \] UI-test search, filters,
selection, details, evidence navigation, zoom, pan, and reset. - \[ \]
Verify keyboard operation and the non-graph alternative. - \[ \] Verify
filtering and reset do not mutate stored analysis. - \[ \] Verify no
edge is created solely from visual proximity or unsupported model
output.

**MVP definition of done** The essential graph is included only when
every displayed node and edge maps to valid collection records, evidence
is traceable, all required controls work, and the list/table alternative
remains usable.

### Advanced graph work --- Post-MVP / Phase 9

-   [ ] Add potential research-gap nodes connected to supporting papers
    and limitations.
-   [ ] Add conflicting-finding links with claim-level evidence and
    contextual comparisons.
-   [ ] Add publication-year filters, including an explicit unknown-year
    state.
-   [ ] Add optional force-directed, hierarchical, and circular layouts.
-   [ ] Add relationship-strength visualization using a documented
    measure and a visible legend.
-   [ ] Test advanced graph features with sparse, incomplete, and
    conflicting source data.

Advanced features must not delay MVP acceptance. A small collection
cannot establish global research novelty, and a difference in findings
is not automatically a contradiction.

### Updated master priority

  -----------------------------------------------------------------------
  Priority                Graph capability        Target
  ----------------------- ----------------------- -----------------------
  P0 / Essential          Paper/theme nodes and   MVP
                          labelled relationship   
                          lines                   

  P0 / Essential          Click-to-view details   MVP
                          and evidence references 

  P0 / Essential          Zoom, pan, search,      MVP
                          node/relationship       
                          filters, reset          

  P1 / Advanced           Research-gap nodes and  Post-MVP
                          conflicting-finding     
                          links                   

  P1 / Advanced           Publication-year graph  Post-MVP
                          filters                 

  P1 / Advanced           Custom layouts and      Post-MVP
                          relationship-strength   
                          visualization           
  -----------------------------------------------------------------------

The graph remains a view over existing analysis output. Do not add a
graph database, microservice, vector database, or distributed queue for
these requirements.
