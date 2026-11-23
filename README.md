# SearchMate 📚🔍
**AI-Assisted Multi-Paper Research Analysis for College Students & Beginner Researchers**

SearchMate is an educational, evidence-first web application designed to help undergraduate and postgraduate students understand how research papers connect. Rather than generating isolated summaries or overwhelming users with dense academic graphs, SearchMate breaks down complex academic terminology into plain English, compares methodologies side-by-side, identifies recurring limitations, and suggests project directions grounded in original papers.

---

## 📁 Saved Location On Your Laptop

The complete project has been generated and saved at:
```text
C:\Users\Maahi\.gemini\antigravity\scratch\SearchMate
```
*Tip: You can open this directory directly in your editor (e.g. VS Code) or set it as your active workspace in Antigravity.*

---

## 🌟 Key Features

1. **Guided 4-Step Student Workflow**:
   - **Upload**: Add 2 to 5 text-based research PDFs (up to 10 MB each).
   - **Understand**: Plain-language explanations, objectives, methodologies, datasets, and author-stated limitations.
   - **Explore**: Side-by-side comparison tables and an interactive relationship graph with an accessible list alternative.
   - **Discover**: Recurring limitations across papers, potential research gaps, and evidence-grounded project directions.
2. **Essential Interactive Research Graph (MVP)**:
   - Visual nodes for **Papers** and **Recurring Themes**.
   - Typed relationship lines (*Discusses Theme*, *Methodology Overlap*, *Keyword Overlap*).
   - Click-to-view details panel displaying page-level evidence citations.
   - Navigation controls: Zoom in/out, pan, reset-to-fit, and keyword search.
   - **Accessible List / Table Alternative** toggle for complete accessibility.
3. **Evidence-Grounded Collection Q&A**:
   - Ask questions about your collection with answers strictly retrieved from the uploaded text.
   - Direct citations linking to source papers and original page numbers.
   - Transparently responds when information is not present in the papers.
4. **Research Integrity & Safeguards**:
   - Fields not explicitly found in papers are marked `"Not found in paper"`.
   - Never fabricates authors, publication years, or citations.
   - Recurring limitations are labeled as *potential gaps within this collection* without claiming global novelty.

---

## 🛠️ Technology Stack

- **Frontend**: React + Vite, Tailwind CSS, Lucide React.
- **Backend**: Python + FastAPI modular monolith.
- **Persistence**: SQLite with SQLAlchemy ORM + Pydantic validation.
- **PDF Extraction**: PyMuPDF (`fitz`) extracting page-by-page text preserving page numbers.
- **AI Integration**: Replaceable adapter supporting **Google Gemini API** (`gemini-1.5-flash`) with a robust local heuristic fallback.
- **Text Similarity**: scikit-learn TF-IDF + Cosine Similarity.

---

## 🚀 Getting Started

### 1. Frontend Setup (React + Vite)
```powershell
cd C:\Users\Maahi\.gemini\antigravity\scratch\SearchMate\frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 2. Backend Setup (FastAPI)
```powershell
cd C:\Users\Maahi\.gemini\antigravity\scratch\SearchMate\backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Configure your Groq API key in backend/.env:
# GROQ_API_KEY="gsk_your_groq_api_key_here"
# (Also supports GEMINI_API_KEY or XAI_API_KEY)

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
The API server runs at `http://localhost:8000`, with interactive Swagger documentation at `http://localhost:8000/docs`.

*Note: The frontend includes a responsive client fallback, allowing you to preview and interact with the UI even before the backend server is launched!*

---

## 🔒 Security & Privacy Notes

- All API keys remain strictly server-side in `backend/.env`. The React frontend never touches private provider credentials.
- Uploaded PDFs and extracted text are treated as untrusted source material and stored in private runtime storage (`backend/uploads/`).
- Deleting a paper safely cleans up both database records and physical files on disk.

---

## 📂 Project Structure

```text
SearchMate/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & CORS setup
│   │   ├── core/                # Configuration, logging, database
│   │   ├── models/              # SQLAlchemy models (Collection, Paper, Theme, etc.)
│   │   ├── schemas/             # Pydantic schemas & response envelopes
│   │   ├── services/            # PDF extraction, AI adapter, Graph & Similarity
│   │   ├── repositories/        # Database data access layer
│   │   └── api/routes/          # REST endpoints (/collections, /papers, /questions, /graph)
│   ├── tests/                   # Automated API & service tests
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment configuration template
│
├── frontend/
│   ├── src/
│   │   ├── app/App.jsx          # Main application & routing
│   │   ├── components/          # Navbar, PaperCard, FileUploader, Graph, etc.
│   │   ├── pages/               # Workspace, Detail, Compare, Discover, Questions
│   │   ├── services/api.js      # API client & offline demo fallback
│   │   └── styles/index.css     # Tailwind styling
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite dev configuration
│
├── .gitignore
└── README.md
```
