# Technology Stack

  -----------------------------------------------------------------------
  Layer                   Planned technology      Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React + Vite            Build the web
                                                  application

  Styling                 Tailwind CSS            Responsive interface

  Icons                   Lucide React            Interface icons

  Backend                 Python + FastAPI        APIs and application
                                                  logic

  PDF extraction          PyMuPDF (`fitz`)        Extract text page by
                                                  page

  Data validation         Pydantic                Validate API data and
                                                  structured AI output

  ORM                     SQLAlchemy              Database access

  Database                SQLite                  Lightweight MVP
                                                  database

  AI provider             Gemini through a        Paper explanations and
                          provider adapter        analysis

  Similarity analysis     scikit-learn TF-IDF +   Find related keywords
                          cosine similarity       and themes

  Background processing   FastAPI background      Process uploaded papers
                          tasks                   

  Backend testing         Pytest + HTTPX          Test backend services
                                                  and APIs

  Frontend testing        Vitest, where           Test UI behaviour
                          configured              

  Frontend hosting        Vercel or Netlify       Deploy frontend

  Backend hosting         Render or another       Deploy FastAPI backend
                          Python host             
  -----------------------------------------------------------------------

### Architecture

A modular monolith with one React frontend, one FastAPI backend, one
relational database, private file storage, and a replaceable AI-provider
adapter.

### Interactive graph implementation

  -----------------------------------------------------------------------
  Graph layer             Planned approach        Responsibility
  ----------------------- ----------------------- -----------------------
  Graph data              Validated JSON nodes    Represent papers,
                          and edges               themes, relationships,
                                                  and evidence references

  Backend                 Existing FastAPI        Return
                          modular monolith        collection-scoped graph
                                                  data and validate
                                                  evidence links

  Frontend                React-compatible graph  Render nodes/edges and
                          visualization library   support selection,
                          (to be selected)        search, filters, zoom,
                                                  pan, and reset

  Persistence             Existing SQLite +       Reuse papers, themes,
                          SQLAlchemy records      relationships, and
                                                  evidence; no graph
                                                  database
  -----------------------------------------------------------------------

The library choice must consider licence, maintenance, bundle size,
keyboard accessibility, and reduced-motion support. The graph is a view
over existing analysis output, not a separate analysis pipeline.

### MVP constraints

-   Maximum 5 PDFs per collection.
-   Suggested maximum file size: 10 MB per PDF.
-   Initial support is for text-based PDFs; OCR is outside the initial
    MVP.
-   Complex graph infrastructure, microservices, distributed queues, and
    vector databases are not required for the initial MVP unless
    approved.
