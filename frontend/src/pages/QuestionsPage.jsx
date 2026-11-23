import React, { useState } from 'react';
import { Send, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { CitationLink } from '../components/CitationLink';

export function QuestionsPage({ collectionId, papers = [], onOpenPaper }) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      id: 1,
      question: "Which papers evaluate on standard benchmark datasets?",
      answer: "Based on the papers in this collection:\n\n• **Deep Residual Learning** evaluates on the ImageNet 2012 classification dataset (1.28 million training images).\n• **Attention Is All You Need** evaluates on the WMT 2014 English-to-German and English-to-French translation datasets.\n\nBoth works benchmark their methods against well-known open standards to demonstrate empirical advances over previous architectures.",
      citations: [
        {
          paper_id: papers[0]?.id || 'p1',
          paper_title: papers[0]?.title || 'Deep Residual Learning',
          page_number: 4,
          text_snippet: 'We evaluate our method on the ImageNet 2012 classification dataset...'
        },
        {
          paper_id: papers[1]?.id || 'p2',
          paper_title: papers[1]?.title || 'Attention Is All You Need',
          page_number: 7,
          text_snippet: 'On the WMT 2014 English-to-German translation task, the big transformer model outperforms...'
        }
      ],
      grounded: true
    }
  ]);

  const handleAsk = async (qText) => {
    const query = qText || question;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.askQuestion(collectionId, query);
      setHistory(prev => [
        {
          id: Date.now(),
          question: query,
          answer: res.answer,
          citations: res.citations || [],
          grounded: res.grounded
        },
        ...prev
      ]);
      setQuestion('');
    } catch (err) {
      setHistory(prev => [
        {
          id: Date.now(),
          question: query,
          answer: "Unable to complete request. Please verify backend connection.",
          citations: [],
          grounded: false
        },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Which papers use deep learning?",
    "What limitations are mentioned across the papers?",
    "How do the datasets used in these papers differ?",
    "Which paper reports improvements over baseline models?"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Title */}
      <div className="mb-6">
        <span className="eyebrow-mono block mb-1">
          // NATURAL LANGUAGE RETRIEVAL PROTOCOL
        </span>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.8px] text-ink">
          Ask Your Research Collection
        </h1>
        <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mt-1">
          Evidence strictly retrieved from your uploaded corpus and cited by page number
        </p>
      </div>

      {/* Question Input Card */}
      <div className="card-xai mb-8">
        <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }}>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Query your uploaded documents (e.g. 'What datasets are evaluated?')"
              rows={3}
              className="w-full text-xs sm:text-sm bg-canvas-soft border border-hairline rounded-sm p-4 pr-12 text-ink focus:outline-none focus:border-white/50 resize-none font-normal"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2 rounded-pill bg-white text-canvas hover:bg-ink-hover disabled:opacity-30 transition-colors duration-150"
              title="Submit question"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Suggested Queries */}
        <div className="mt-4 pt-3.5 border-t border-hairline">
          <span className="eyebrow-mono text-[10px] block mb-2">// SAMPLE QUERIES:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(sq)}
                className="btn-outline-sm text-[11px] font-normal"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answers History */}
      <div className="space-y-6">
        {isLoading && (
          <div className="p-8 card-xai text-center text-xs font-mono text-mute animate-pulse">
            Retrieving relevant passages and synthesizing grounded answer...
          </div>
        )}

        {history.map((item) => (
          <div key={item.id} className="card-xai">
            {/* Question */}
            <div className="mb-3">
              <span className="eyebrow-mono text-[10px] text-mute block mb-1">
                // QUERY
              </span>
              <h3 className="text-base font-normal tracking-[-0.2px] text-ink">{item.question}</h3>
            </div>

            {/* Answer */}
            <div className="mt-3 text-xs text-body leading-relaxed whitespace-pre-line font-normal">
              {item.answer}
            </div>

            {/* Citations Footer */}
            {item.citations && item.citations.length > 0 && (
              <div className="mt-5 pt-3.5 border-t border-hairline">
                <span className="eyebrow-mono text-[10px] text-accent-breeze block mb-2">
                  // GROUNDED EVIDENCE SOURCES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.citations.map((cite, cIdx) => (
                    <CitationLink
                      key={cIdx}
                      paperTitle={cite.paper_title}
                      pageNumber={cite.page_number}
                      excerpt={cite.text_snippet}
                      onClick={() => onOpenPaper(cite.paper_id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
