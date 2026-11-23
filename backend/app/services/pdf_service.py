import os
import re
from typing import List, Dict, Any, Tuple
from app.schemas.common import ErrorCodes

# Try importing fitz (PyMuPDF)
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

class PDFService:
    @staticmethod
    def validate_file(file_path: str, max_size_mb: int = 10) -> Tuple[bool, str]:
        """
        Validates file existence, size, and PDF signature (%PDF-).
        """
        if not os.path.exists(file_path):
            return False, ErrorCodes.PDF_CORRUPT

        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if file_size_mb > max_size_mb:
            return False, ErrorCodes.FILE_TOO_LARGE

        # Check PDF magic bytes
        try:
            with open(file_path, "rb") as f:
                header = f.read(5)
                if not header.startswith(b"%PDF-"):
                    return False, ErrorCodes.INVALID_FILE_TYPE
        except Exception:
            return False, ErrorCodes.PDF_CORRUPT

        return True, ""

    @staticmethod
    def extract_text_and_pages(file_path: str) -> Tuple[List[Dict[str, Any]], str, str]:
        """
        Extracts text page by page preserving 1-indexed page numbers.
        Returns: (pages_list, error_code, combined_text)
        """
        if not PYMUPDF_AVAILABLE:
            # Fallback reading text if pymupdf is not yet installed in runtime
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    raw = f.read()
                return [{"page_number": 1, "text": raw[:8000]}], "", raw[:8000]
            except Exception:
                return [], ErrorCodes.PDF_CORRUPT, ""

        pages = []
        full_text_list = []
        try:
            doc = fitz.open(file_path)
            if doc.is_encrypted:
                return [], ErrorCodes.PDF_ENCRYPTED, ""

            total_pages = len(doc)
            for page_num in range(total_pages):
                page = doc[page_num]
                page_text = page.get_text("text")
                # Clean whitespace
                cleaned_text = re.sub(r"[ \t]+", " ", page_text).strip()
                if cleaned_text:
                    pages.append({
                        "page_number": page_num + 1,
                        "text": cleaned_text
                    })
                    full_text_list.append(cleaned_text)

            doc.close()

            combined_text = "\n\n".join(full_text_list).strip()
            # Check if text is too minimal (e.g. scanned image PDF without OCR)
            if len(combined_text) < 50:
                return [], ErrorCodes.PDF_TEXT_NOT_FOUND, ""

            return pages, "", combined_text

        except Exception as e:
            return [], ErrorCodes.PDF_CORRUPT, ""

    @staticmethod
    def chunk_pages(pages: List[Dict[str, Any]], chunk_size: int = 500, overlap: int = 100) -> List[Dict[str, Any]]:
        """
        Splits extracted pages into retrievable chunks preserving paper page reference.
        """
        chunks = []
        for p in pages:
            page_num = p["page_number"]
            text = p["text"]
            words = text.split()
            
            if len(words) <= chunk_size:
                chunks.append({
                    "page_number": page_num,
                    "text": text
                })
                continue

            i = 0
            while i < len(words):
                chunk_words = words[i:i + chunk_size]
                chunk_text = " ".join(chunk_words)
                chunks.append({
                    "page_number": page_num,
                    "text": chunk_text
                })
                i += (chunk_size - overlap)

        return chunks
