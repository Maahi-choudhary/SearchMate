import React, { useState, useEffect } from 'react';
import { ArrowUpRight, GitCompare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { EmptyState } from '../components/EmptyState';

function detectBenchmarkDomain(text = '') {
  const lower = text.toLowerCase();
  if (/imagenet|cifar|mnist|coco|pascal|vision|image|detection|segmentation|accuracy|top-1|top-5/.test(lower)) {
    return { name: 'Computer Vision', tag: 'VISION' };
  }
  if (/wmt|translation|bleu|rouge|glue|squad|language|nlp|transformer|perplexity|bert|token|text/.test(lower)) {
    return { name: 'Natural Language Processing', tag: 'NLP' };
  }
  if (/atari|gym|mujoco|reinforcement|policy|q-learning|reward|agent/.test(lower)) {
    return { name: 'Reinforcement Learning', tag: 'RL' };
  }
  if (/graph|cora|citeseer|node|gnn|graph convolutional/.test(lower)) {
    return { name: 'Graph Learning', tag: 'GRAPH' };
  }
  if (/speech|audio|librispeech|wer|cer|acoustic/.test(lower)) {
    return { name: 'Speech / Audio', tag: 'AUDIO' };
  }
  return { name: 'General Empirical', tag: 'GENERAL' };
}

export function ComparePage({ collectionId, papers = [], onOpenPaper, onNotify }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareData, setCompareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Detect domain discrepancy across compared corpus
  const paperDomains = compareData?.papers?.map(p => ({
    paperId: p.paper_id,
    domain: detectBenchmarkDomain(`${p.dataset} ${p.methodology} ${(p.findings || []).join(' ')}`)
  })) || [];

  const uniqueDomains = Array.from(new Set(paperDomains.map(d => d.domain.tag))).filter(d => d !== 'GENERAL');
  const hasDiscrepancy = uniqueDomains.length > 1;

  // Default select first two papers
  useEffect(() => {
    if (papers.length >= 2 && selectedIds.length === 0) {
      setSelectedIds([papers[0].id, papers[1].id]);
    } else if (papers.length === 1 && selectedIds.length === 0) {
      setSelectedIds([papers[0].id]);
    }
  }, [papers]);

  // Load comparison when selection changes
  useEffect(() => {
    if (selectedIds.length >= 2) {
      loadComparison();
    } else {
      setCompareData(null);
    }
  }, [selectedIds, collectionId]);

  const loadComparison = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.comparePapers(collectionId, selectedIds);
      setCompareData(res);
    } catch (err) {
      setError(err?.message || 'Could not load paper comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaper = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        if (onNotify) {
          onNotify('Please keep at least 2 papers selected to compare.', 'info', '// SELECTION LIMIT');
        } else {
          alert('Please keep at least 2 papers selected to compare.');
        }
        return;
      }
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        if (onNotify) {
          onNotify('You can compare up to 5 papers at a time.', 'info', '// MAXIMUM CORPUS');
        } else {
          alert('You can compare up to 5 papers at a time.');
        }
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (papers.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="At least 2 papers required to compare"
          description="Upload at least two research PDFs in your workspace to unlock side-by-side comparison tables, methodology differences, and dataset contrasts."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase block mb-1">
          // MULTI-PAPER CORRELATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Compare Research Papers
        </h1>
        <p className="text-xs text-white/60 font-mono uppercase mt-1">
          Side-by-side methodology, dataset, and limitation evaluation
        </p>
      </div>

      {/* Paper Selector Pills */}
      <div className="card-discord p-4 mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#00b0f4] uppercase mr-2">SELECT CORPUS:</span>
        {papers.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => togglePaper(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 border ${
                isSelected
                  ? 'border-[#5865f2] bg-[#5865f2] text-white shadow-discord-sm'
                  : 'border-[#282b54] bg-[#23272a] text-white/70 hover:border-[#5865f2] hover:text-white'
              }`}
            >
              <span>{isSelected ? '✓' : '+'}</span>
              <span className="truncate max-w-[180px]">{p.title || p.filename}</span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="p-12 text-center card-discord my-4 text-xs font-mono text-white/60 animate-pulse">
          Synthesizing cross-paper comparison table...
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#23272a] border border-[#ec48bd]/50 text-[#ec48bd] text-xs rounded-xl my-4 font-mono shadow-discord-card">
          {error}
        </div>
      )}

      {compareData && !isLoading && (
        <div className="space-y-8">
          {/* Cross-Domain Benchmark Incompatibility Alert (FR-47 Academic Safeguard) */}
          {hasDiscrepancy && (
            <div className="bg-[#23272a] border-l-4 border-l-[#ec48bd] border-t border-r border-b border-[#282b54] rounded-xl p-5 shadow-discord-card">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ec48bd] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#ec48bd] uppercase tracking-wider">
                  // ACADEMIC SAFEGUARD: CROSS-BENCHMARK DISCREPANCY
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wide text-[#ec48bd] px-2 py-0.5 rounded-full bg-[#ec48bd]/15 border border-[#ec48bd]/30">
                  [NON-COMPARABLE METRIC BASELINES]
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-normal">
                The selected papers evaluate across disparate task domains (<span className="text-white font-mono uppercase text-[11px] font-bold">{uniqueDomains.join(' vs. ')}</span>). Direct empirical metrics (such as classification error rates versus sequence translation BLEU scores) are fundamentally non-comparable. Evaluate these studies based on algorithmic architecture rather than raw numerical metric magnitudes.
              </p>
            </div>
          )}

          {/* Side-by-side Discord Comparison Table */}
          <div className="border border-[#282b54] rounded-2xl overflow-hidden bg-[#1e2353]/60 backdrop-blur-md shadow-discord-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1e2353] border-b border-[#282b54]">
                    <th className="p-4 font-mono uppercase text-[11px] tracking-wide text-[#00b0f4] w-44 min-w-[150px] bg-[#1e2353] sticky left-0 z-10 border-r border-[#282b54]">
                      // FIELD
                    </th>
                    {compareData.papers.map((p) => (
                      <th key={p.paper_id} className="p-4 text-white min-w-[280px] max-w-[340px] border-r border-[#282b54] last:border-r-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-white line-clamp-2">{p.title}</span>
                          <button
                            onClick={() => onOpenPaper(p.paper_id)}
                            className="text-white/40 hover:text-[#5865f2] p-1 rounded-md hover:bg-white/5 transition-colors"
                            title="Open paper details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-mono uppercase text-[10px] tracking-wide text-white/50 block mt-1.5">
                          {p.publication_year || 'YEAR UNKNOWN'} · {p.authors.slice(0, 2).join(', ')}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282b54]">
                  {/* Objective Row */}
                  <tr className="hover:bg-[#5865f2]/5 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-wide text-[#00b0f4] bg-[#1e2353]/90 sticky left-0 z-10 border-r border-[#282b54] font-semibold">
                      OBJECTIVE
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-[#282b54] last:border-r-0 text-white/80 leading-relaxed align-top font-normal">
                        {p.objective}
                      </td>
                    ))}
                  </tr>

                  {/* Methodology Row */}
                  <tr className="hover:bg-[#5865f2]/5 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-wide text-[#00b0f4] bg-[#1e2353]/90 sticky left-0 z-10 border-r border-[#282b54] font-semibold">
                      METHODOLOGY
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-[#282b54] last:border-r-0 text-white/80 leading-relaxed align-top font-normal">
                        {p.methodology}
                      </td>
                    ))}
                  </tr>

                  {/* Dataset Row */}
                  <tr className="hover:bg-[#5865f2]/5 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-wide text-[#00b0f4] bg-[#1e2353]/90 sticky left-0 z-10 border-r border-[#282b54] font-semibold">
                      DATASET / DOMAIN
                    </td>
                    {compareData.papers.map((p) => {
                      const pDomain = paperDomains.find(d => d.paperId === p.paper_id)?.domain;
                      return (
                        <td key={p.paper_id} className="p-4 border-r border-[#282b54] last:border-r-0 text-white/80 align-top">
                          <div className="space-y-1.5">
                            {pDomain && pDomain.tag !== 'GENERAL' && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-[#00b0f4]/20 border border-[#00b0f4]/40 text-[#00b0f4] font-mono text-[10px] uppercase font-bold">
                                  [{pDomain.tag}]
                                </span>
                                {hasDiscrepancy && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#ec48bd]/20 border border-[#ec48bd]/40 text-[#ec48bd] font-mono text-[9px] uppercase font-bold">
                                    DISPARATE BENCHMARK
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="text-xs text-white/80 font-normal">
                              {p.dataset}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Findings Row */}
                  <tr className="hover:bg-[#5865f2]/5 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-wide text-[#35ed7e] bg-[#1e2353]/90 sticky left-0 z-10 border-r border-[#282b54] font-semibold">
                      FINDINGS
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-[#282b54] last:border-r-0 text-white/80 leading-relaxed align-top">
                        <ul className="space-y-1.5">
                          {p.findings.map((f, i) => (
                            <li key={i} className="text-xs font-normal">
                              <span className="text-[#35ed7e] font-mono text-[11px] font-bold mr-1">[{i + 1}]</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Limitations Row */}
                  <tr className="hover:bg-[#5865f2]/5 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-wide text-[#ec48bd] bg-[#1e2353]/90 sticky left-0 z-10 border-r border-[#282b54] font-semibold">
                      LIMITATIONS
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-[#282b54] last:border-r-0 text-white/80 leading-relaxed align-top">
                        <ul className="space-y-1.5">
                          {p.limitations.map((l, i) => (
                            <li key={i} className="text-xs text-[#ec48bd]/90 font-normal">
                              <span className="text-[#ec48bd] font-mono text-[11px] font-bold mr-1">//</span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Contextual Differences Panel (FR-26 & FR-47 Safeguards) */}
          {compareData.differences && compareData.differences.length > 0 && (
            <div className="card-discord p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#ec48bd] uppercase tracking-wider">
                  // CONTEXTUAL DIFFERENCE ANALYSIS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                  EMPIRICAL DISCREPANCY EVALUATION
                </span>
              </div>
              <p className="text-xs text-white/60 font-mono uppercase mb-5">
                Differences contextualized via underlying benchmarks, metrics, and experimental configurations
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compareData.differences.map((diff, idx) => (
                  <div key={idx} className="bg-[#23272a] border border-[#282b54] rounded-xl p-4 shadow-discord-sm hover:border-[#5865f2]/60 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{diff.aspect}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#ec48bd]/15 border border-[#ec48bd]/40 text-[#ec48bd] font-bold">
                        {diff.status_label || 'NEEDS MANUAL VERIFICATION'}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-normal">{diff.description}</p>
                    <div className="mt-3 pt-2.5 border-t border-[#282b54] text-[11px] text-white/50 font-normal">
                      <span className="font-semibold text-white/80">Possible Explanation:</span> {diff.possible_explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
