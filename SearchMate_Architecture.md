# SearchMate --- System Architecture Document

**Document version:** 1.0\
**Based on:** SearchMate PRD v1.0\
**Architecture target:** Individual-developer MVP, 1--2 weeks\
**Product type:** AI-assisted research-paper analysis web application

------------------------------------------------------------------------

## 1. System Overview

### 1.1 Architecture goals

SearchMate should provide a simple, maintainable path from PDF upload to
understandable cross-paper insights. The architecture is designed to:

-   Support collections of 2--5 text-based research PDFs.
-   Extract paper text and preserve page-level source references.
-   Generate structured, beginner-friendly explanations.
-   Compare themes, methods, findings, and limitations across papers.
-   Keep AI-generated claims connected to their source papers.
-   Keep the first release low-cost and straightforward to deploy.
-   Allow advanced features to be added without rebuilding the core
    application.

### 1.2 Recommended architecture style

Use a **modular monolith** for the MVP:

-   One React frontend.
-   One Python FastAPI backend.
-   One relational database.
-   One file-storage location.
-   One AI-provider integration module.

A modular monolith is easier for one developer to build, test, and
deploy than multiple microservices. Keep responsibilities separated
inside the backend so individual modules can be changed later.

### 1.3 High-level architecture diagram

``` mermaid
flowchart TB
    U[Student / Researcher] --> UI[React + Vite Frontend]

    UI -->|HTTPS REST API| API[FastAPI Backend]

    subgraph Backend["Backend: Modular Monolith"]
        API --> AUTH[Request Validation]
        AUTH --> COL[Collection Module]
        AUTH --> DOC[Document Module]
        AUTH --> ANALYSIS[Analysis Module]
        AUTH --> QA[Research Q&A Module]

        DOC --> PDF[PDF Extraction: PyMuPDF]
        ANALYSIS --> NLP[Theme & Similarity Analysis]
        ANALYSIS --> LLM[AI Provider Adapter]
        QA --> RETRIEVE[Evidence Retrieval]
        RETRIEVE --> NLP
        QA --> LLM
    end

    DOC --> FILES[(PDF File Storage)]
    PDF --> DB[(SQLite Database)]
    COL --> DB
    ANALYSIS --> DB
    QA --> DB
    NLP --> DB
    LLM --> EXT[External LLM API]

    UI -->|Read results and citations| API
```

### 1.4 Main system workflow

``` mermaid
flowchart TD
    A[User creates a collection] --> B[Uploads 2–5 PDF files]
    B --> C{Validate file}
    C -->|Invalid| D[Return clear upload error]
    C -->|Valid| E[Save PDF]
    E --> F[Extract text page by page]
    F --> G{Enough readable text?}
    G -->|No| H[Mark paper as failed / unsupported]
    G -->|Yes| I[Save page text and metadata]
    I --> J[Send relevant text to AI analysis]
    J --> K[Validate structured AI response]
    K --> L[Save paper explanation and evidence references]
    L --> M[Analyse themes across collection]
    M --> N[Build collection overview]
    N --> O[Display results with source-paper links]
```

------------------------------------------------------------------------

## 2. Selected Technology Stack

The following stack is a practical recommendation for the PRD's
individual-developer timeline. It is not a requirement to use every
optional technology listed.

  -----------------------------------------------------------------------
  Layer                   Selected technology     Why it is suitable
  ----------------------- ----------------------- -----------------------
  Frontend                React + Vite            Quick setup,
                                                  component-based UI,
                                                  broad learning
                                                  resources

  Styling                 Tailwind CSS            Fast creation of
                                                  consistent, responsive
                                                  screens

  UI icons                Lucide React            Consistent icons
                                                  without building an
                                                  icon system

  Charts                  Recharts (optional)     Simple year-wise
                                                  keyword or trend charts

  Backend                 Python + FastAPI        Good fit for PDF
                                                  processing, AI
                                                  integration, and REST
                                                  APIs

  PDF extraction          PyMuPDF (`fitz`)        Extracts text page by
                                                  page and supports page
                                                  references

  Data validation         Pydantic                Validates API inputs
                                                  and structured AI
                                                  output

  ORM                     SQLAlchemy              Keeps database
                                                  operations organised
                                                  and allows later
                                                  database changes

  MVP database            SQLite                  Free, simple, and
                                                  requires no separate
                                                  database server

  AI model                Gemini API through a    One hosted model
                          provider adapter        integration for
                                                  explanations and
                                                  structured analysis;
                                                  check current free-tier
                                                  and usage limits before
                                                  relying on it

  Text similarity         scikit-learn TF-IDF +   Lightweight baseline
                          cosine similarity       for identifying
                                                  overlapping terms and
                                                  related papers

  Background processing   FastAPI background task Avoids introducing a
                          for the small MVP       separate queue system
                                                  for a small workload

  Testing                 Pytest + HTTPX; Vitest  Tests backend endpoints
                          for frontend (optional) and important UI
                                                  behaviour

  Version control         Git + GitHub            Source control and
                                                  deployment integration

  Frontend hosting        Vercel or Netlify       Simple static frontend
                                                  deployment

  Backend hosting         Render or another       Straightforward FastAPI
                          Python host             deployment

  MVP file storage        Local uploads directory Simple for a prototype;
                          / persistent disk       requires persistent
                                                  storage on the host
  -----------------------------------------------------------------------

### 2.1 Important stack decisions

**Use SQLite for the first local MVP.** It avoids database setup and is
enough for a single-user or small demonstration. If the deployed app
needs multiple users or concurrent writes, move to PostgreSQL (for
example, a managed PostgreSQL provider) before expanding usage.

**Do not add a vector database initially.** The PRD's initial collection
is only 2--5 papers. Store page text and use a simple TF-IDF retrieval
baseline for collection Q&A. A vector database can be considered only if
retrieval quality or collection size later requires it.

**Keep the AI provider replaceable.** Put model calls behind one backend
service interface. This avoids tying upload, storage, or analysis logic
to a single model vendor.

**Do not put AI API keys in React.** All calls to the model provider
must originate from the backend.

------------------------------------------------------------------------

## 3. Frontend Architecture

### 3.1 Frontend responsibilities

The frontend is responsible for:

-   Showing the product workflow and navigation.
-   Accepting PDF files and displaying validation errors.
-   Showing upload and processing progress.
-   Displaying paper summaries and extracted fields.
-   Displaying shared themes and paper relationships in a readable form.
-   Showing paper comparison tables.
-   Displaying potential gaps and project ideas when implemented.
-   Sending collection questions to the backend when Q&A is enabled.
-   Showing citations and allowing users to open the source paper or
    page.

The frontend must not extract PDF text, call the LLM provider directly,
or contain secret API keys.

### 3.2 Suggested frontend structure

``` text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── FileUploader.jsx
│   │   ├── UploadProgress.jsx
│   │   ├── PaperCard.jsx
│   │   ├── CitationLink.jsx
│   │   ├── ThemeCard.jsx
│   │   ├── ComparisonTable.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── WorkspacePage.jsx
│   │   ├── CollectionPage.jsx
│   │   ├── PaperDetailPage.jsx
│   │   ├── ComparePage.jsx
│   │   └── DiscoverPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── package.json
└── vite.config.js
```

### 3.3 Frontend design principles

-   Use the guided flow: **Upload → Understand → Explore → Discover**.
-   Prefer paper cards, short explanations, and comparison tables over
    dense graphs.
-   Show "Not found in paper" for missing information.
-   Show a visible source reference beside each important insight.
-   Keep loading, empty, success, and error states consistent.
-   Do not present a failed or incomplete analysis as a successful
    result.

------------------------------------------------------------------------

## 4. Backend Architecture

### 4.1 Backend responsibilities

FastAPI provides the REST API and coordinates the application workflow.
It is responsible for:

-   Validating requests and uploaded files.
-   Creating and managing collections.
-   Saving PDFs and extracted text.
-   Extracting text page by page.
-   Calling AI analysis services.
-   Validating AI responses against defined schemas.
-   Running cross-paper theme and similarity analysis.
-   Retrieving evidence for collection questions.
-   Saving results and source references.
-   Returning predictable errors to the frontend.

### 4.2 Suggested backend structure

``` text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── logging.py
│   ├── api/
│   │   └── routes/
│   │       ├── collections.py
│   │       ├── papers.py
│   │       ├── analysis.py
│   │       └── questions.py
│   ├── models/
│   │   ├── collection.py
│   │   ├── paper.py
│   │   ├── page.py
│   │   ├── analysis.py
│   │   └── citation.py
│   ├── schemas/
│   │   ├── collection.py
│   │   ├── paper.py
│   │   ├── analysis.py
│   │   └── question.py
│   ├── services/
│   │   ├── pdf_service.py
│   │   ├── paper_analysis_service.py
│   │   ├── relationship_service.py
│   │   ├── retrieval_service.py
│   │   ├── research_idea_service.py
│   │   └── ai/
│   │       ├── base_provider.py
│   │       └── gemini_provider.py
│   ├── repositories/
│   └── utils/
├── uploads/
├── tests/
├── requirements.txt
└── .env.example
```

### 4.3 Backend module responsibilities

  ---------------------------------------------------------------------
  Module                             Responsibility
  ---------------------------------- ----------------------------------
  `collections`                      Create, read, and delete research
                                     collections

  `papers`                           Upload, list, inspect, and delete
                                     papers

  `pdf_service`                      Validate PDFs and extract text
                                     page by page

  `paper_analysis_service`           Generate structured paper
                                     explanations

  `relationship_service`             Find shared themes, terms, and
                                     similarities

  `retrieval_service`                Find relevant paper sections for
                                     collection Q&A

  `research_idea_service`            Generate evidence-linked project
                                     directions when enabled

  `ai` provider adapter              Send prompts to the configured
                                     model and return structured
                                     results

  `repositories`                     Keep database queries separate
                                     from business logic

  `schemas`                          Validate API requests, responses,
                                     and AI output
  ---------------------------------------------------------------------

### 4.4 Processing status

Use a small status set for each paper:

-   `uploaded`
-   `validating`
-   `extracting`
-   `analysing`
-   `completed`
-   `failed`

The frontend can poll the paper status endpoint while processing is
active.

------------------------------------------------------------------------

## 5. AI/ML and Document Processing Components

### 5.1 PDF extraction

Use PyMuPDF to:

1.  Open a PDF after file validation.
2.  Extract text page by page.
3.  Save the page number with each extracted text section.
4.  Check whether enough readable text was extracted.
5.  Mark unsupported or scanned-only PDFs as failed with a clear
    message.

Store page-level text so later answers can point to a source page. The
MVP does not include OCR for scanned PDFs.

### 5.2 Paper analysis

For each paper, send relevant extracted text to the AI provider with a
fixed output schema.

Expected fields:

``` json
{
  "title": "Paper title or null",
  "authors": [],
  "publication_year": null,
  "abstract": "Extracted or summarised abstract",
  "keywords": [],
  "research_problem": "Simple explanation",
  "objective": "What the paper aims to do",
  "methodology": "What the researchers did",
  "dataset": "Dataset or Not found in paper",
  "main_findings": [],
  "limitations": [],
  "future_work": [],
  "beginner_explanation": "Plain-language explanation"
}
```

The backend must validate this response before saving it. Missing values
must remain missing; the model must not be instructed to guess them.

### 5.3 Cross-paper relationship analysis

For the MVP:

1.  Collect keywords and key phrases from the analysed papers.
2.  Normalise case and remove common stop words.
3.  Use TF-IDF and cosine similarity to find overlapping terms or
    related paper text.
4.  Group recurring themes conservatively.
5.  Save the theme and the IDs of papers that support it.
6.  Display a short explanation and the linked papers.

Similarity is a clue for exploration, not proof that two papers make the
same argument. The interface should show the terms or evidence behind a
connection.

### 5.4 Research gap and limitation analysis

Use a two-step approach:

1.  Extract author-stated limitations and future-work statements from
    each paper.
2.  Group similar statements across the collection and label repeated
    patterns as recurring limitations.

A generated potential gap must be labelled as a **potential gap in this
uploaded collection**. It must not be presented as proof that no
previous research exists.

### 5.5 Collection Q&A (stretch feature)

Use a simple retrieval-augmented generation (RAG) flow:

1.  Split extracted page text into manageable chunks while retaining
    paper ID and page number.
2.  Retrieve the most relevant chunks for a user's question using TF-IDF
    similarity.
3.  Send only those chunks and the question to the AI provider.
4.  Ask for an answer grounded only in the supplied evidence.
5.  Validate that each returned citation refers to a retrieved chunk.
6.  Return the answer and its paper/page references.

If no relevant evidence is found, return a response such as: "I could
not find enough information in your uploaded papers to answer this."

### 5.6 Research idea generation (stretch feature)

Generate a small number of possible directions from recurring
limitations and themes. Each suggestion should include:

-   Idea title.
-   Problem being explored.
-   Why it may be worth investigating.
-   Related limitation or theme.
-   Supporting paper IDs and page references.
-   A first validation step.

Do not claim that an idea is novel or guaranteed to be feasible.

------------------------------------------------------------------------

## 6. Data Flow

### 6.1 Upload and analysis data flow

``` mermaid
sequenceDiagram
    actor User
    participant UI as React Frontend
    participant API as FastAPI
    participant PDF as PDF Service
    participant AI as AI Provider Adapter
    participant DB as SQLite

    User->>UI: Select PDF files
    UI->>API: POST /collections/{id}/papers
    API->>API: Validate file type and size
    API->>DB: Create paper record (uploaded)
    API->>PDF: Extract text page by page
    PDF-->>API: Page text and extraction status
    API->>DB: Save page text and update status
    API->>AI: Analyse extracted paper text
    AI-->>API: Structured paper analysis
    API->>API: Validate AI output and citations
    API->>DB: Save analysis and evidence references
    API->>DB: Update paper status (completed)
    UI->>API: GET /papers/{paper_id}/status
    API-->>UI: Processing status
    UI->>API: GET /collections/{id}/overview
    API-->>UI: Papers, themes, and relationships
    UI-->>User: Display beginner-friendly results
```

### 6.2 Collection question data flow

``` mermaid
sequenceDiagram
    actor User
    participant UI as React Frontend
    participant API as FastAPI
    participant R as Retrieval Service
    participant DB as SQLite
    participant AI as AI Provider Adapter

    User->>UI: Ask a question
    UI->>API: POST /collections/{id}/questions
    API->>DB: Load page chunks and paper metadata
    API->>R: Retrieve relevant chunks
    R-->>API: Text chunks with paper IDs and page numbers
    API->>AI: Question + retrieved evidence
    AI-->>API: Answer with cited evidence IDs
    API->>API: Validate evidence IDs
    API-->>UI: Answer and source references
    UI-->>User: Display answer and paper/page links
```

### 6.3 Data flow rules

-   Raw PDFs are stored separately from relational metadata.
-   Extracted text is saved with page numbers.
-   AI analysis is stored as structured fields, not only as a long text
    response.
-   Every generated insight should retain its supporting paper IDs.
-   Q&A citations must map to actual retrieved chunks.
-   Deleting a paper must also remove its extracted pages and dependent
    analysis records.

------------------------------------------------------------------------

## 7. API Design

Use REST endpoints under `/api/v1`. Return JSON for normal API responses
and `multipart/form-data` for PDF uploads.

### 7.1 API conventions

-   Use standard HTTP methods: `GET`, `POST`, `DELETE`.
-   Use clear resource-based URL names.
-   Return a consistent error structure.
-   Validate all request bodies with Pydantic.
-   Use UUIDs or generated opaque IDs for collection, paper, and insight
    identifiers.
-   Do not return local filesystem paths or secrets to the browser.

Suggested success response:

``` json
{
  "success": true,
  "data": {},
  "message": "Request completed"
}
```

Suggested error response:

``` json
{
  "success": false,
  "error": {
    "code": "PDF_TEXT_NOT_FOUND",
    "message": "This PDF does not contain readable text. Please upload a text-based PDF."
  }
}
```

### 7.2 Core endpoints

  -----------------------------------------------------------------------------------------
  Method       Endpoint                                          Purpose       Priority
  ------------ ------------------------------------------------- ------------- ------------
  `POST`       `/api/v1/collections`                             Create a      Must
                                                                 collection    

  `GET`        `/api/v1/collections`                             List          Should
                                                                 collections   

  `GET`        `/api/v1/collections/{collection_id}`             Get           Must
                                                                 collection    
                                                                 details       

  `DELETE`     `/api/v1/collections/{collection_id}`             Delete        Should
                                                                 collection    
                                                                 and its data  

  `POST`       `/api/v1/collections/{collection_id}/papers`      Upload a PDF  Must

  `GET`        `/api/v1/collections/{collection_id}/papers`      List papers   Must
                                                                 in a          
                                                                 collection    

  `GET`        `/api/v1/papers/{paper_id}`                       Get paper     Must
                                                                 metadata and  
                                                                 analysis      

  `GET`        `/api/v1/papers/{paper_id}/status`                Get           Must
                                                                 processing    
                                                                 status        

  `DELETE`     `/api/v1/papers/{paper_id}`                       Delete a      Should
                                                                 paper         

  `GET`        `/api/v1/collections/{collection_id}/overview`    Get themes    Must
                                                                 and           
                                                                 collection    
                                                                 overview      

  `POST`       `/api/v1/collections/{collection_id}/compare`     Compare       Must
                                                                 selected      
                                                                 papers        

  `GET`        `/api/v1/collections/{collection_id}/discover`    Get           Stretch
                                                                 limitations   
                                                                 and possible  
                                                                 gaps          

  `POST`       `/api/v1/collections/{collection_id}/questions`   Ask a         Stretch
                                                                 question      
                                                                 about         
                                                                 uploaded      
                                                                 papers        

  `GET`        `/api/v1/collections/{collection_id}/trends`      Get year-wise Stretch
                                                                 theme data    
  -----------------------------------------------------------------------------------------

### 7.3 Example request: create collection

`POST /api/v1/collections`

``` json
{
  "name": "Machine Learning Research"
}
```

Example response:

``` json
{
  "success": true,
  "data": {
    "id": "collection_uuid",
    "name": "Machine Learning Research",
    "created_at": "2026-11-22T10:00:00Z"
  },
  "message": "Collection created"
}
```

### 7.4 Example request: upload PDF

`POST /api/v1/collections/{collection_id}/papers`

Content type: `multipart/form-data`

Form field:

-   `file`: one PDF file.

The server checks the collection limit, file size, file signature, and
PDF readability before starting analysis.

Example response:

``` json
{
  "success": true,
  "data": {
    "paper_id": "paper_uuid",
    "status": "uploaded"
  },
  "message": "PDF uploaded and queued for processing"
}
```

### 7.5 Example request: compare papers

`POST /api/v1/collections/{collection_id}/compare`

``` json
{
  "paper_ids": ["paper_uuid_1", "paper_uuid_2"]
}
```

The backend returns comparable fields such as objective, methodology,
dataset, findings, and limitations. Missing fields should be returned as
null or "Not found in paper", not guessed.

### 7.6 Example request: ask collection

`POST /api/v1/collections/{collection_id}/questions`

``` json
{
  "question": "Which papers use deep learning, and what datasets do they mention?"
}
```

Example response:

``` json
{
  "success": true,
  "data": {
    "answer": "Two papers in this collection mention deep learning...",
    "citations": [
      {
        "paper_id": "paper_uuid_1",
        "paper_title": "Example Paper",
        "page_number": 4,
        "evidence_id": "chunk_uuid_1"
      }
    ],
    "grounded": true
  },
  "message": "Answer generated from uploaded papers"
}
```

The example values are illustrative only. The backend must return only
real IDs and citations from stored source material.

------------------------------------------------------------------------

## 8. Database Design

### 8.1 Database choice

Use SQLite for the local MVP with SQLAlchemy models. It is simple to
configure and sufficient for a small demonstration.

Use a migration tool such as Alembic if the schema is likely to change
during development. If the deployed application needs concurrent
multi-user access, migrate to PostgreSQL.

### 8.2 Main database entities

#### A. Collection

Stores a user's research workspace.

  Field          Type            Description
  -------------- --------------- ------------------
  `id`           UUID / string   Primary key
  `name`         String          Collection name
  `created_at`   DateTime        Creation time
  `updated_at`   DateTime        Last update time

#### B. Paper

Stores uploaded PDF metadata and processing status.

  -----------------------------------------------------------------------
  Field                   Type                    Description
  ----------------------- ----------------------- -----------------------
  `id`                    UUID / string           Primary key

  `collection_id`         UUID / string           Foreign key to
                                                  Collection

  `filename`              String                  Original filename

  `storage_path`          String                  Internal file-storage
                                                  key/path

  `title`                 String, nullable        Extracted title

  `authors_json`          JSON, nullable          Extracted authors

  `publication_year`      Integer, nullable       Extracted year

  `abstract`              Text, nullable          Extracted abstract

  `status`                String                  uploaded / extracting /
                                                  analysing / completed /
                                                  failed

  `error_code`            String, nullable        Safe processing error
                                                  code

  `created_at`            DateTime                Upload time
  -----------------------------------------------------------------------

#### C. PaperPage

Stores extracted text page by page.

  Field           Type            Description
  --------------- --------------- --------------------------
  `id`            UUID / string   Primary key
  `paper_id`      UUID / string   Foreign key to Paper
  `page_number`   Integer         Original PDF page number
  `text`          Text            Extracted page text

#### D. PaperAnalysis

Stores the structured analysis of one paper.

  Field                    Type             Description
  ------------------------ ---------------- ----------------------------
  `id`                     UUID / string    Primary key
  `paper_id`               UUID / string    Foreign key to Paper
  `research_problem`       Text, nullable   Problem being addressed
  `objective`              Text, nullable   Research objective
  `methodology`            Text, nullable   Method used
  `dataset`                Text, nullable   Dataset or source
  `main_findings_json`     JSON             Main findings
  `limitations_json`       JSON             Author-stated limitations
  `future_work_json`       JSON             Future-work statements
  `beginner_explanation`   Text             Plain-language explanation
  `created_at`             DateTime         Analysis time

#### E. Theme

Stores themes identified across a collection.

  Field             Type            Description
  ----------------- --------------- -------------------------------
  `id`              UUID / string   Primary key
  `collection_id`   UUID / string   Foreign key to Collection
  `name`            String          Theme label
  `description`     Text            Beginner-friendly explanation
  `keywords_json`   JSON            Related keywords

#### F. PaperTheme

Join table connecting papers and themes.

  Field             Type             Description
  ----------------- ---------------- -----------------------------
  `paper_id`        UUID / string    Foreign key to Paper
  `theme_id`        UUID / string    Foreign key to Theme
  `evidence_text`   Text, nullable   Supporting text or keywords

Composite primary key: (`paper_id`, `theme_id`).

#### G. EvidenceChunk

Stores retrievable text sections for Q&A and citations. It can be added
when the Q&A feature is implemented.

  Field           Type            Description
  --------------- --------------- --------------------------
  `id`            UUID / string   Primary key
  `paper_id`      UUID / string   Foreign key to Paper
  `page_number`   Integer         Source page
  `chunk_index`   Integer         Chunk order within paper
  `text`          Text            Chunk content

#### H. ResearchInsight

Stores cross-paper insights such as recurring limitations and potential
research directions.

  Field                Type            Description
  -------------------- --------------- ---------------------------------------------
  `id`                 UUID / string   Primary key
  `collection_id`      UUID / string   Foreign key to Collection
  `type`               String          recurring_limitation / potential_gap / idea
  `title`              String          Insight title
  `description`        Text            Explanation
  `confidence_label`   String          exploratory / needs_verification
  `created_at`         DateTime        Creation time

#### I. InsightEvidence

Connects an insight to the papers or page-level evidence supporting it.

  Field             Type                Description
  ----------------- ------------------- --------------------------------
  `insight_id`      UUID / string       Foreign key to ResearchInsight
  `paper_id`        UUID / string       Foreign key to Paper
  `page_number`     Integer, nullable   Supporting page
  `evidence_text`   Text, nullable      Short supporting excerpt

Composite primary key may be (`insight_id`, `paper_id`, `page_number`).

### 8.3 Entity relationship diagram

``` mermaid
erDiagram
    COLLECTION ||--o{ PAPER : contains
    PAPER ||--o{ PAPER_PAGE : has
    PAPER ||--o| PAPER_ANALYSIS : receives
    COLLECTION ||--o{ THEME : identifies
    PAPER ||--o{ PAPER_THEME : linked
    THEME ||--o{ PAPER_THEME : includes
    PAPER ||--o{ EVIDENCE_CHUNK : split_into
    COLLECTION ||--o{ RESEARCH_INSIGHT : produces
    RESEARCH_INSIGHT ||--o{ INSIGHT_EVIDENCE : supported_by
    PAPER ||--o{ INSIGHT_EVIDENCE : provides

    COLLECTION {
        string id PK
        string name
        datetime created_at
        datetime updated_at
    }

    PAPER {
        string id PK
        string collection_id FK
        string filename
        string storage_path
        string title
        int publication_year
        string status
    }

    PAPER_PAGE {
        string id PK
        string paper_id FK
        int page_number
        text text
    }

    PAPER_ANALYSIS {
        string id PK
        string paper_id FK
        text objective
        text methodology
        text dataset
        text beginner_explanation
    }

    THEME {
        string id PK
        string collection_id FK
        string name
        text description
    }

    PAPER_THEME {
        string paper_id PK, FK
        string theme_id PK, FK
        text evidence_text
    }

    EVIDENCE_CHUNK {
        string id PK
        string paper_id FK
        int page_number
        int chunk_index
        text text
    }

    RESEARCH_INSIGHT {
        string id PK
        string collection_id FK
        string type
        string title
        text description
    }

    INSIGHT_EVIDENCE {
        string insight_id PK, FK
        string paper_id PK, FK
        int page_number
        text evidence_text
    }
```

### 8.4 Relationship rules

-   One collection can contain many papers.
-   One paper belongs to one collection.
-   One paper can have many extracted pages.
-   One paper has zero or one current analysis record in the MVP.
-   A collection can contain many themes.
-   A paper can be linked to many themes, and a theme can link to many
    papers.
-   One paper can have many evidence chunks.
-   A collection can have many research insights.
-   An insight can be supported by multiple papers and page references.

Use foreign-key constraints and cascading deletion carefully. Deleting a
collection should delete its paper records, extracted text, analyses,
themes, and insights, as well as the corresponding stored PDF files.

------------------------------------------------------------------------

## 9. External Services and Integrations

### 9.1 AI model provider

**Purpose:** Generate beginner-friendly explanations and structured
research-paper analysis.

Integration rules:

-   Call the provider only from FastAPI.
-   Keep the API key in a server-side environment variable.
-   Set request timeouts.
-   Handle quota, rate-limit, and provider errors.
-   Validate the returned JSON before saving it.
-   Send only the necessary extracted text.
-   Avoid sending the same full paper repeatedly when cached analysis is
    available.
-   Check the provider's current pricing, free-tier limits,
    data-retention terms, and student-project suitability before
    deployment.

The architecture should use an adapter such as `AIProvider`, with a
provider-specific implementation such as `GeminiProvider`. This keeps
the rest of the application independent of the provider SDK.

### 9.2 File storage

For local development, store files in a private `uploads/` directory
outside the public frontend assets.

For a hosted MVP, use a persistent disk supported by the backend host or
private object storage. Do not assume a normal temporary deployment
filesystem will retain uploaded files after a restart or redeployment.

### 9.3 Hosting integrations

-   Frontend: Vercel or Netlify.
-   Backend: Render or another host supporting Python/FastAPI.
-   Database: SQLite on persistent storage for the demonstration;
    PostgreSQL for a multi-user deployment.
-   Source control: GitHub.

No academic search API is required for the MVP because the PRD
explicitly limits analysis to user-uploaded papers.

------------------------------------------------------------------------

## 10. Error Handling and Logging

### 10.1 Error handling strategy

Use consistent error codes so the frontend can display understandable
messages.

  -----------------------------------------------------------------------
  Error code              Cause                   User-facing message
  ----------------------- ----------------------- -----------------------
  `INVALID_FILE_TYPE`     Uploaded file is not a  Please upload a PDF
                          PDF                     file.

  `FILE_TOO_LARGE`        File exceeds configured This PDF is too large.
                          limit                   Please upload a smaller
                                                  file.

  `PDF_CORRUPT`           PDF cannot be opened    This PDF could not be
                                                  read. Please check the
                                                  file and try again.

  `PDF_ENCRYPTED`         PDF is                  This PDF is protected.
                          password-protected      Upload an accessible
                                                  copy.

  `PDF_TEXT_NOT_FOUND`    No usable text          This appears to be a
                          extracted               scanned PDF. The MVP
                                                  supports text-based
                                                  PDFs only.

  `PAPER_LIMIT_REACHED`   Collection already has  This collection has
                          5 papers                reached its 5-paper
                                                  limit.

  `AI_PROVIDER_ERROR`     AI provider is          Analysis is temporarily
                          unavailable             unavailable. Please try
                                                  again later.

  `AI_INVALID_RESPONSE`   AI output fails schema  The analysis could not
                          validation              be verified. Please
                                                  retry.

  `NOT_ENOUGH_EVIDENCE`   Collection does not     I could not find enough
                          support an answer       information in your
                                                  uploaded papers.

  `RESOURCE_NOT_FOUND`    Requested collection or The requested item
                          paper does not exist    could not be found.

  `INTERNAL_ERROR`        Unexpected server error Something went wrong.
                                                  Please try again.
  -----------------------------------------------------------------------

### 10.2 Logging

Log:

-   Request ID.
-   Timestamp.
-   API route and HTTP status.
-   Processing stage.
-   Paper ID and collection ID where safe.
-   Processing duration.
-   Error code and safe diagnostic details.
-   AI provider response status and token usage if available.

Do not log:

-   API keys or secrets.
-   Full PDF contents.
-   Full user questions if they may contain personal information.
-   Private file contents or sensitive extracted text.

### 10.3 Retry strategy

-   Retry transient AI-provider failures a small, bounded number of
    times.
-   Do not retry invalid PDFs or schema failures indefinitely.
-   Avoid duplicate paper records when a user retries an upload.
-   Allow a failed paper to be retried without reprocessing successful
    papers in the same collection.
-   Show the current status to the frontend.

------------------------------------------------------------------------

## 11. Scalability and Future Growth

### 11.1 MVP scaling approach

The first release is intentionally small:

-   Maximum 5 PDFs per collection.
-   Text-based PDFs only.
-   One backend application.
-   Small local database.
-   Controlled AI request size.
-   Cached paper analysis.
-   Simple TF-IDF retrieval.

This is appropriate for a college demonstration and limited testing, not
high-volume production.

### 11.2 Upgrade path

  -----------------------------------------------------------------------
  Current MVP             Later upgrade           Reason
  ----------------------- ----------------------- -----------------------
  SQLite                  PostgreSQL              Multiple users and
                                                  concurrent requests

  Local persistent disk   Private object storage  Reliable file storage
                                                  and larger files

  FastAPI background      Celery/RQ + Redis       Longer processing jobs
  tasks                                           and job retries

  TF-IDF retrieval        Embedding model +       Better semantic
                          vector search           retrieval for larger
                                                  collections

  One backend instance    Multiple backend        Higher request
                          workers                 throughput

  Basic logs              Centralised monitoring  Easier production
                          and error tracking      diagnosis

  No advanced accounts    Authentication and user Secure multi-user
                          ownership               workspaces
  -----------------------------------------------------------------------

### 11.3 Scalability safeguards

-   Set maximum file size and paper count.
-   Limit extracted text sent to the AI provider.
-   Cache paper analysis by paper/version.
-   Process uploads independently so one failure does not stop the whole
    collection.
-   Use database indexes on collection and paper foreign keys.
-   Add background workers only when processing time or request volume
    justifies them.

------------------------------------------------------------------------

## 12. Deployment Architecture

### 12.1 MVP deployment diagram

``` mermaid
flowchart TB
    B[User Browser] --> FE[Frontend: Vercel / Netlify]
    FE -->|HTTPS API requests| BE[FastAPI: Render]

    subgraph BackendHost["Backend Host"]
        BE --> APP[Application Modules]
        APP --> DB[(SQLite on Persistent Disk)]
        APP --> FS[Private PDF Upload Directory]
    end

    APP -->|HTTPS model request| LLM[External AI Provider]
    LLM -->|Structured response| APP
    APP -->|JSON response| FE
```

### 12.2 Environment configuration

Frontend environment variable:

``` env
VITE_API_BASE_URL=https://your-backend-domain.example
```

Backend environment variables:

``` env
APP_ENV=production
DATABASE_URL=sqlite:///./data/searchmate.db
UPLOAD_DIR=./uploads
AI_PROVIDER=gemini
GEMINI_API_KEY=your_server_side_api_key
MAX_FILE_SIZE_MB=10
MAX_PAPERS_PER_COLLECTION=5
```

These are example names and values. Use the actual database path and
persistent-disk mount path provided by the hosting platform. Never
commit a real `.env` file or API key to GitHub.

### 12.3 Deployment steps

1.  Push the frontend and backend code to a private or public GitHub
    repository as appropriate.
2.  Deploy the frontend as a Vite static site.
3.  Configure the frontend API base URL.
4.  Deploy the FastAPI backend using the host's Python build/start
    commands.
5.  Attach persistent storage for SQLite and uploaded PDFs.
6.  Configure backend environment variables and the AI provider key.
7.  Configure CORS to allow only the deployed frontend origin.
8.  Run database migrations or initialise the schema.
9.  Test upload, extraction, analysis, status polling, comparison, and
    deletion.
10. Confirm that uploaded files and database records survive a backend
    restart.

### 12.4 Production note

SQLite and a local upload directory are suitable only when the host
provides reliable persistent storage and the expected workload is small.
For a public multi-user application, use PostgreSQL, private object
storage, authentication, and stronger access controls before inviting
wider use.

------------------------------------------------------------------------

## 13. Key Technical Trade-offs

  ----------------------------------------------------------------------
  Decision         Benefit             Trade-off /      MVP choice
                                       limitation       
  ---------------- ------------------- ---------------- ----------------
  Modular monolith Easier to build,    Less independent Modular monolith
  vs microservices debug, and deploy   scaling of       
                   alone               components       

  React + Vite vs  Simple              Requires a       React + Vite
  full-stack       frontend/backend    separately       
  framework        separation          deployed API     

  FastAPI vs Node  Python ecosystem    Requires         FastAPI
  backend          suits PDF and AI    learning Python  
                   work                backend patterns 
                                       if unfamiliar    

  SQLite vs        Minimal setup and   Limited          SQLite for
  PostgreSQL       no database hosting concurrency and  prototype
                   cost                deployment needs 
                                       persistent       
                                       storage          

  Hosted LLM vs    Faster to integrate Provider limits, Hosted provider
  local model      and generally       internet         behind adapter
                   simpler to run      dependency, and  
                                       possible cost    

  TF-IDF vs vector Lightweight,        Less semantic    TF-IDF baseline
  database         explainable, and no understanding    
                   separate vector     for complex      
                   service             questions        

  Background tasks Fewer services and  Not durable for  Background tasks
  vs task queue    simpler deployment  long or          for small MVP
                                       high-volume jobs 

  Local disk vs    Easy file handling  Host filesystem  Persistent disk
  object storage                       may be           for demo
                                       temporary;       
                                       scaling is       
                                       harder           

  Simple           More                Less expressive  Cards and tables
  cards/tables vs  beginner-friendly   for very large   first
  complex graph    and faster to       networks         
                   implement                            
  ----------------------------------------------------------------------

### 13.1 Recommended implementation priorities

For a 1--2 week individual build, implement in this order:

1.  React interface and FastAPI health check.
2.  Collection creation and PDF upload.
3.  PDF validation and page-level text extraction.
4.  Structured paper analysis through the AI provider.
5.  Save and display paper analysis.
6.  Theme extraction and simple cross-paper comparison.
7.  Citation/source references and robust error handling.
8.  Add collection Q&A only after the core flow works.
9.  Add gap grouping, idea generation, and timeline only if time
    remains.

Do not build microservices, a vector database, OCR, advanced
authentication, or a sophisticated graph for the first demonstration.

------------------------------------------------------------------------

## 14. Architecture Acceptance Checklist

-   [ ] Frontend and backend are separated and communicate through REST
    APIs.
-   [ ] PDF files are validated before extraction.
-   [ ] PDF text is stored with page numbers.
-   [ ] AI provider credentials remain server-side.
-   [ ] AI output is validated before being saved.
-   [ ] Missing information is represented explicitly rather than
    guessed.
-   [ ] Cross-paper relationships link to supporting papers.
-   [ ] Q&A citations, if implemented, map to real paper/page evidence.
-   [ ] A failure in one paper does not invalidate other successfully
    processed papers.
-   [ ] API errors are returned in a consistent format.
-   [ ] Logs do not contain secrets or full paper contents.
-   [ ] Uploaded files are stored privately and can be deleted.
-   [ ] The deployed database and uploaded files use persistent storage.
-   [ ] The app can be run locally using documented setup instructions.

------------------------------------------------------------------------

## 15. Final Architecture Principle

**SearchMate should be evidence-first and beginner-friendly.**

The system must not merely generate a summary or a visually impressive
graph. It should explain what a relationship means, show which uploaded
papers support it, and make it easy for a student to verify the original
evidence.

Build the smallest reliable pipeline first:

**Upload PDF → Extract text → Understand paper → Compare papers → Show
evidence.**

Add advanced discovery features only after this pipeline works
consistently.

## Feature architecture update --- graph exploration and underexplored topics

This section fills in implementation details for capabilities that were
only partially specified in the original architecture. Existing upload,
metadata extraction, paper comparison, limitation grouping, trend
summary, RAG Q&A, and idea-generation flows remain as defined above.

### 5.7 Interactive research relationship graph (post-MVP enhancement)

Build the graph as a presentation of the existing relationship-analysis
output; do not create a separate, competing analysis pipeline.

**Graph data model (API/view model):**

-   `nodes`: stable node ID, node type (`paper` or `theme`), display
    label, and linked paper/theme ID.
-   `edges`: stable edge ID, source node ID, target node ID,
    relationship type, concise explanation, and supporting
    paper/evidence references.
-   `evidence`: paper ID, original page number, and a short supporting
    text excerpt or stored evidence-chunk reference.

**Supported relationship types:** shared topic/theme, keyword overlap,
methodology similarity, related dataset/problem setting, and similar or
differing findings. Only emit a relationship when the underlying
analysis contains supporting terms or evidence.

**Interaction:** selecting a node or edge opens a details panel showing
why it is connected, which papers support it, and links to the relevant
paper/page. Provide filters by relationship type and a
reset/clear-selection action. Keep a readable list/table alternative for
accessibility and small screens.

**Implementation constraints:**

-   Use the existing React component architecture and existing
    relationship-analysis API/data; do not introduce a graph database or
    a new backend service.
-   A lightweight client-side graph library may be considered only after
    dependency, licence, bundle-size, and accessibility review. Ask for
    approval if it creates a material architectural or cost change.
-   Do not encode similarity as certainty. A similarity score is an
    exploratory signal and must not be presented as proof of identical
    research claims.
-   The graph is a post-MVP enhancement; the grouped theme view and
    paper comparison remain usable without it.

### 5.8 Underexplored-topic analysis

Extend the existing theme and limitation analysis by looking for topics
that recur across papers but appear to have limited investigation within
the uploaded collection.

1.  Identify a recurring topic from repeated keywords, themes, or
    relevant passages.
2.  Look for evidence of limited exploration, such as author-stated
    limitations, narrow datasets/settings, missing evaluation,
    unanswered questions, or future-work statements.
3.  Store the topic, the basis for the assessment, and separate
    supporting paper/page references for recurrence and limited
    exploration.
4.  Label the result `Potentially underexplored in this collection` and
    state that it requires further literature review.

Do not infer that a topic is underexplored merely because it appears
briefly, or because only one uploaded paper mentions it. Do not claim
field-wide novelty or absence of research.

### 5.9 Finding-conflict contextualisation

The existing contradiction comparison should return a structured
comparison containing the research question, reported finding,
dataset/sample, method, evaluation metric, and experimental context
where available. Present supported factors that may explain differing
results. If evidence is insufficient, say
`Possible explanation not established by the uploaded papers` and mark
the comparison `Needs manual verification`. SearchMate contextualises
conflicts; it does not independently prove which paper is correct.

### 5.10 Year-wise topic movement

The existing timeline groups keywords/themes by publication year. Where
the collection contains enough papers and a meaningful spread of
publication years, the UI may describe observed increases, decreases,
first appearances, or gaps in the uploaded sample. Display counts and
the papers behind each year. Otherwise show a neutral year-wise
distribution and avoid labels such as `emerging` or `declining`.

------------------------------------------------------------------------

## Architecture Addendum --- Interactive Research Graph (2026-11-22)

This addendum updates the graph scope: **the essential graph view is an
MVP requirement**; the advanced graph capabilities listed below remain
post-MVP. It supersedes earlier statements that placed the entire
interactive graph after MVP.

### A. Responsibility and data flow

The graph is a visualization of existing, evidence-backed paper/theme
relationships. It is not a new source of research conclusions and must
not run a competing analysis pipeline.

1.  The existing extraction and paper-analysis modules produce paper
    records and evidence.
2.  The cross-paper analysis module produces validated themes,
    paper-theme links, and supported paper relationships.
3.  A graph-query/serialization function maps those records into a
    collection-scoped JSON view model.
4.  FastAPI returns the view model after collection authorization and
    evidence-reference validation.
5.  React renders the nodes and edges and manages local view state
    (selection, search, filters, zoom, pan, and layout viewport).
6.  Selecting a node or edge requests or displays its existing
    details/evidence. Graph interaction must not mutate the underlying
    paper analysis.

### B. Graph view model

Use a response shape conceptually equivalent to:

``` json
{
  "collection_id": "collection-id",
  "nodes": [
    {
      "id": "paper:paper-id",
      "type": "paper",
      "label": "Paper title",
      "metadata": {
        "authors": ["Author"],
        "publication_year": 2024
      }
    },
    {
      "id": "theme:theme-id",
      "type": "theme",
      "label": "Research theme",
      "metadata": {
        "paper_count": 2
      }
    }
  ],
  "edges": [
    {
      "id": "edge:relationship-id",
      "source": "paper:paper-id",
      "target": "theme:theme-id",
      "type": "paper_theme",
      "label": "Discusses this theme",
      "evidence_refs": [
        {
          "paper_id": "paper-id",
          "page_number": 4,
          "evidence_id": "evidence-id"
        }
      ]
    }
  ]
}
```

This is an illustrative contract, not a claim that these identifiers or
fields already exist. Adapt names to the actual schema while preserving
the following invariants: - Node IDs are stable within the collection
and namespaced by type. - Edge IDs are stable and unique within the
response. - `source` and `target` must reference nodes in the same
response. - `type` is an enumerated relationship type, not arbitrary
model-generated text. - `evidence_refs` resolve to actual paper/evidence
records in the same collection. - Optional metadata is omitted or
explicitly null when unavailable; never guessed. - Similarity values, if
included later, are numeric, bounded, documented, and traceable to the
calculation that produced them.

### C. Essential API contract

Add a collection-scoped read endpoint using the project's existing API
conventions:

-   `GET /collections/{collection_id}/graph`
-   Optional query parameters may include `node_types` and
    `relationship_types` if server-side filtering is needed.
-   The initial implementation may return the complete small graph and
    apply filters client-side.
-   Return only nodes and edges belonging to the authorized collection.
-   Return a consistent empty graph for a valid collection with no
    supported relationships.
-   Use the existing error envelope for missing collections,
    unauthorized access, and processing-not-ready states.
-   Do not expose filesystem paths, provider prompts, private storage
    locations, or cross-collection identifiers.

The endpoint is a proposed contract and should be aligned with the final
API naming before implementation.

### D. Frontend responsibilities

Create a focused graph feature area, for example `features/graph/`, with
separable components: - `ResearchGraphView`: graph canvas and
orchestration. - `GraphToolbar`: zoom, fit/reset, and search. -
`GraphFilters`: paper/theme and relationship-type filters. -
`GraphDetailsPanel`: selected node or edge details and evidence. -
`GraphAlternativeList`: accessible non-canvas representation. -
`graphTypes` / `graphApi`: typed response contract and API access.

Keep selection, active filters, search query, and viewport state local
to the graph view unless a later product requirement calls for
persistence. Do not store derived graph coordinates as research facts.

### E. Essential MVP interactions

-   Render paper and theme nodes with visually distinct, labelled node
    types.
-   Render typed, labelled edges; do not use proximity alone to indicate
    relationships.
-   Click or keyboard-select a node to open its details panel.
-   Select an edge to inspect the relationship explanation and
    supporting paper/page references.
-   Zoom, pan, fit/reset, search by title/theme/keyword, filter by node
    type and relationship type.
-   Provide visible active-filter state, clear-all, no-results, empty,
    loading, and error states.
-   Keep paper cards, grouped themes, and comparison tables as non-graph
    alternatives.

### F. Advanced post-MVP extensions

1.  Gap nodes connected to the supporting limitations/papers, with
    explicit "potential gap in this collection" language.
2.  Conflicting-finding links with claim-level evidence and contextual
    comparison.
3.  Publication-year graph filters; unknown years remain unclassified.
4.  Layout options such as force-directed, hierarchical, and circular.
5.  Relationship-strength styling using a documented similarity/evidence
    measure. The details panel must explain the measure and must not
    label it as confidence unless statistically justified.

These additions should extend the same graph contract through optional
node/edge types and metadata; they must not require a graph database.

### G. Performance, accessibility, and validation

-   Bound graph size to the supported small collection and avoid
    rendering duplicate nodes/edges.
-   Validate graph payloads with Pydantic before returning them.
-   Validate all node references, edge endpoints, collection membership,
    and evidence references.
-   Provide keyboard navigation/selection and a screen-reader-friendly
    list or table alternative.
-   Do not rely on colour alone to distinguish node/edge types; include
    labels or shapes.
-   Respect reduced-motion preferences and avoid distracting automatic
    movement.
-   Sanitize labels and evidence excerpts before rendering; render text
    as text, never as trusted HTML.
-   Test empty collections, missing evidence, duplicate relationships,
    deleted papers, partial metadata, and unauthorized collection IDs.

### H. Architecture decision

Use the current React + Vite frontend, FastAPI modular monolith,
SQLAlchemy/SQLite persistence, and existing TF-IDF/cosine similarity
outputs where appropriate. A lightweight React graph library may be
selected after licence, maintenance, accessibility, and bundle-size
review. **Do not introduce a graph database, microservice, vector
database, or distributed queue for the MVP graph.**
