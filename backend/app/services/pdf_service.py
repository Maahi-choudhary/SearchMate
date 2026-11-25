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
    def _extract_page_blocks_ordered(page) -> str:
        """
        Extracts text from a PyMuPDF page object respecting multi-column academic layouts.
        Distinguishes full-width title/abstract headers from left and right columns,
        ordering content in logical reading sequence rather than horizontal scan lines.
        Also resolves end-of-line word hyphenation across line breaks.
        """
        rect = page.rect
        page_width = rect.width
        page_height = rect.height

        # Get text blocks: (x0, y0, x1, y1, text, block_no, block_type)
        raw_blocks = page.get_text("blocks")
        if not raw_blocks:
            return ""

        # Filter: keep only text blocks (block_type == 0) with non-whitespace content
        text_blocks = []
        for b in raw_blocks:
            if b[6] == 0:  # text block
                txt = b[4].strip()
                if txt:
                    # Ignore isolated running headers/footers (e.g., solitary page number or top rule)
                    y0, y1 = b[1], b[3]
                    if (y1 < 32 or y0 > page_height - 28) and len(txt) < 40 and not any(
                        h in txt.lower() for h in ['abstract', 'introduction', 'references']
                    ):
                        continue
                    text_blocks.append(b)

        if not text_blocks:
            return ""

        # Analyze layout: determine whether the page features a dual-column layout
        mid_x = page_width / 2.0
        left_blocks = [
            b for b in text_blocks 
            if b[2] <= mid_x * 1.15 and (b[2] - b[0]) < page_width * 0.60
        ]
        right_blocks = [
            b for b in text_blocks 
            if b[0] >= mid_x * 0.85 and (b[2] - b[0]) < page_width * 0.60
        ]

        is_dual_column = len(left_blocks) >= 2 and len(right_blocks) >= 2

        if not is_dual_column:
            # Single-column page: natural vertical top-to-bottom reading order
            sorted_blocks = sorted(text_blocks, key=lambda b: (b[1], b[0]))
        else:
            # Dual-column academic layout
            min_col_y = min(
                min((b[1] for b in left_blocks), default=0),
                min((b[1] for b in right_blocks), default=0)
            )
            max_col_y = max(
                max((b[3] for b in left_blocks), default=page_height),
                max((b[3] for b in right_blocks), default=page_height)
            )

            top_headers = []
            column_left = []
            column_right = []
            bottom_footers = []

            for b in text_blocks:
                x0, y0, x1, y1 = b[0], b[1], b[2], b[3]
                is_wide = (x1 - x0) > (page_width * 0.60) or (x0 < mid_x * 0.6 and x1 > mid_x * 1.4)

                if is_wide:
                    if y1 <= min_col_y + 15:
                        top_headers.append(b)
                    elif y0 >= max_col_y - 15:
                        bottom_footers.append(b)
                    else:
                        # Full-width element spanning the middle (e.g. wide table or equation)
                        top_headers.append(b)
                else:
                    # Column block
                    b_mid = (x0 + x1) / 2.0
                    if b_mid < mid_x:
                        column_left.append(b)
                    else:
                        column_right.append(b)

            # Sort each group vertically by y0 coordinate
            top_headers.sort(key=lambda b: b[1])
            column_left.sort(key=lambda b: b[1])
            column_right.sort(key=lambda b: b[1])
            bottom_footers.sort(key=lambda b: b[1])

            sorted_blocks = top_headers + column_left + column_right + bottom_footers

        # Assemble cleaned text with dehyphenation and paragraph normalization
        cleaned_paragraphs = []
        for b in sorted_blocks:
            raw_text = b[4]
            # Fix end-of-line hyphenation across words: "trans-\nformer" -> "transformer"
            unhyphenated = re.sub(r'(\b[a-zA-Z]+)-\s*\n\s*([a-zA-Z]+\b)', r'\1\2', raw_text)
            # Normalize inner line breaks within each block to single spaces
            lines = [line.strip() for line in unhyphenated.splitlines() if line.strip()]
            if lines:
                para = " ".join(lines)
                cleaned_paragraphs.append(para)

        return "\n\n".join(cleaned_paragraphs).strip()

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
                
                # Attempt multi-column layout extraction with graceful fallback
                cleaned_text = ""
                try:
                    cleaned_text = PDFService._extract_page_blocks_ordered(page)
                except Exception:
                    cleaned_text = ""

                # Fallback to standard PyMuPDF text extraction if block extraction yields nothing
                if not cleaned_text:
                    page_text = page.get_text("text")
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
