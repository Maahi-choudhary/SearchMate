import React, { useState } from 'react';
import { Send, ArrowUpRight, HelpCircle, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { CitationLink } from '../components/CitationLink';

export function QuestionsPage({ collectionId, papers = [], onOpenPaper, onPreviewCitation }) {
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
        <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase block mb-1">
          // NATURAL LANGUAGE RETRIEVAL PROTOCOL
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Ask Your Research Collection
        </h1>
        <p className="text-xs text-white/60 font-mono uppercase mt-1">
          Evidence strictly retrieved from your uploaded corpus and cited by page number
        </p>
      </div>

      {/* Question Input Card */}
      <div className="card-discord p-6 mb-8 shadow-discord-card">
        <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }}>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Query your uploaded documents (e.g. 'What datasets are evaluated?')"
              rows={3}
              className="w-full text-xs sm:text-sm bg-[#23272a] border border-[#282b54] rounded-xl p-4 pr-14 text-white placeholder-white/40 focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] resize-none font-normal shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="btn-primary p-2.5 rounded-xl absolute right-3 bottom-3 disabled:opacity-30 transition-transform active:scale-95"
              title="Submit question"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>

        {/* Suggested Queries */}
        <div className="mt-4 pt-4 border-t border-[#282b54]">
          <span className="text-[10px] font-semibold text-[#00b0f4] uppercase tracking-wider block mb-2">
            // SAMPLE QUERIES:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(sq)}
                className="btn-outline-sm rounded-full text-xs font-medium hover:border-[#5865f2]"
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
          <div className="p-8 card-discord text-center text-xs font-mono text-white/60 animate-pulse">
            Retrieving relevant passages and synthesizing grounded answer...
          </div>
        )}

        {history.map((item) => (
          <div key={item.id} className="card-discord p-6">
            {/* Question */}
            <div className="mb-3">
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold uppercase inline-block mb-1.5">
                QUERY
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{item.question}</h3>
            </div>

            {/* Answer */}
            <div className="mt-3 text-xs sm:text-sm text-white/85 leading-relaxed whitespace-pre-line font-normal bg-[#23272a] p-4 rounded-xl border border-[#282b54]">
              {item.answer}
            </div>

            {/* Citations Footer */}
            {item.citations && item.citations.length > 0 && (
              <div className="mt-5 pt-3.5 border-t border-[#282b54]">
                <span className="text-[10px] font-semibold text-[#35ed7e] uppercase tracking-wider block mb-2">
                  // GROUNDED EVIDENCE SOURCES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.citations.map((cite, cIdx) => (
                    <CitationLink
                      key={cIdx}
                      paperTitle={cite.paper_title}
                      pageNumber={cite.page_number}
                      excerpt={cite.text_snippet}
                      onClick={() => onPreviewCitation ? onPreviewCitation(cite) : onOpenPaper(cite.paper_id)}
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
