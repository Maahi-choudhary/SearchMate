import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
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
        <span className="eyebrow-mono block mb-1">
          // MULTI-PAPER CORRELATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.8px] text-ink">
          Compare Research Papers
        </h1>
        <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mt-1">
          Side-by-side methodology, dataset, and limitation evaluation
        </p>
      </div>

      {/* Paper Selector Pills */}
      <div className="card-xai mb-6 py-4 flex flex-wrap items-center gap-2">
        <span className="eyebrow-mono text-[10px] mr-2">SELECT CORPUS:</span>
        {papers.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => togglePaper(p.id)}
              className={`px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-caption-mono-sm transition duration-150 flex items-center gap-1.5 border ${
                isSelected
                  ? 'border-white bg-white/10 text-ink'
                  : 'border-hairline bg-canvas-soft text-mute hover:border-white/30 hover:text-ink'
              }`}
            >
              <span>{isSelected ? '[✓]' : '[ ]'}</span>
              <span className="truncate max-w-[180px]">{p.title || p.filename}</span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="p-12 text-center card-xai my-4 text-xs font-mono text-mute animate-pulse">
          Synthesizing cross-paper comparison table...
        </div>
      )}

      {error && (
        <div className="p-4 card-xai border-accent-sunset text-accent-sunset-soft text-xs rounded-sm my-4 font-mono">
          {error}
        </div>
      )}

      {compareData && !isLoading && (
        <div className="space-y-8">
          {/* Cross-Domain Benchmark Incompatibility Alert (FR-47 Academic Safeguard) */}
          {hasDiscrepancy && (
            <div className="card-xai bg-canvas-soft border-accent-sunset/50">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-sunset animate-pulse"></span>
                <span className="eyebrow-mono text-accent-sunset">
                  // ACADEMIC SAFEGUARD: CROSS-BENCHMARK DISCREPANCY
                </span>
                <span className="font-mono text-[10px] uppercase tracking-caption-mono text-accent-sunset-soft px-2 py-0.5 rounded-pill bg-canvas-card border border-accent-sunset/30">
                  [NON-COMPARABLE METRIC BASELINES]
                </span>
              </div>
              <p className="text-xs text-body/95 leading-relaxed font-normal">
                The selected papers evaluate across disparate task domains (<span className="text-ink font-mono uppercase text-[11px]">{uniqueDomains.join(' vs. ')}</span>). Direct empirical metrics (such as classification error rates versus sequence translation BLEU scores) are fundamentally non-comparable. Evaluate these studies based on algorithmic architecture rather than raw numerical metric magnitudes.
              </p>
            </div>
          )}

          {/* Side-by-side Hairline Comparison Table (ex-data-table-cell) */}
          <div className="border border-hairline rounded-sm overflow-hidden bg-canvas-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-canvas-soft border-b border-hairline">
                    <th className="p-4 font-mono uppercase text-[11px] tracking-caption-mono text-mute w-44 min-w-[150px] bg-canvas-soft sticky left-0 z-10 border-r border-hairline">
                      // FIELD
                    </th>
                    {compareData.papers.map((p) => (
                      <th key={p.paper_id} className="p-4 text-ink min-w-[280px] max-w-[340px] border-r border-hairline last:border-r-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-normal text-ink line-clamp-2 tracking-[-0.2px]">{p.title}</span>
                          <button
                            onClick={() => onOpenPaper(p.paper_id)}
                            className="text-mute hover:text-white p-0.5"
                            title="Open paper details"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute block mt-1.5">
                          {p.publication_year || 'YEAR UNKNOWN'} · {p.authors.slice(0, 2).join(', ')}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {/* Objective Row */}
                  <tr className="hover:bg-canvas-soft/40 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-caption-mono text-mute bg-canvas-soft/70 sticky left-0 z-10 border-r border-hairline">
                      OBJECTIVE
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-hairline last:border-r-0 text-body/90 leading-relaxed align-top font-normal">
                        {p.objective}
                      </td>
                    ))}
                  </tr>

                  {/* Methodology Row */}
                  <tr className="hover:bg-canvas-soft/40 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-caption-mono text-mute bg-canvas-soft/70 sticky left-0 z-10 border-r border-hairline">
                      METHODOLOGY
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-hairline last:border-r-0 text-body/90 leading-relaxed align-top font-normal">
                        {p.methodology}
                      </td>
                    ))}
                  </tr>

                  {/* Dataset Row */}
                  <tr className="hover:bg-canvas-soft/40 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-caption-mono text-mute bg-canvas-soft/70 sticky left-0 z-10 border-r border-hairline">
                      DATASET / DOMAIN
                    </td>
                    {compareData.papers.map((p) => {
                      const pDomain = paperDomains.find(d => d.paperId === p.paper_id)?.domain;
                      return (
                        <td key={p.paper_id} className="p-4 border-r border-hairline last:border-r-0 text-body align-top">
                          <div className="space-y-1.5">
                            {pDomain && pDomain.tag !== 'GENERAL' && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-pill bg-canvas-soft border border-white/20 text-accent-breeze font-mono text-[10px] uppercase tracking-caption-mono">
                                  [{pDomain.tag}]
                                </span>
                                {hasDiscrepancy && (
                                  <span className="px-2 py-0.5 rounded-pill bg-canvas-card border border-accent-sunset/40 text-accent-sunset-soft font-mono text-[9px] uppercase tracking-caption-mono">
                                    DISPARATE BENCHMARK
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="text-xs text-body/90 font-normal">
                              {p.dataset}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Findings Row */}
                  <tr className="hover:bg-canvas-soft/40 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-caption-mono text-mute bg-canvas-soft/70 sticky left-0 z-10 border-r border-hairline">
                      FINDINGS
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-hairline last:border-r-0 text-body/90 leading-relaxed align-top">
                        <ul className="space-y-1.5">
                          {p.findings.map((f, i) => (
                            <li key={i} className="text-xs font-normal">
                              <span className="text-accent-breeze font-mono text-[11px] mr-1">[{i + 1}]</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Limitations Row */}
                  <tr className="hover:bg-canvas-soft/40 transition-colors">
                    <td className="p-4 font-mono uppercase text-[10px] tracking-caption-mono text-mute bg-canvas-soft/70 sticky left-0 z-10 border-r border-hairline">
                      LIMITATIONS
                    </td>
                    {compareData.papers.map((p) => (
                      <td key={p.paper_id} className="p-4 border-r border-hairline last:border-r-0 text-body/90 leading-relaxed align-top">
                        <ul className="space-y-1.5">
                          {p.limitations.map((l, i) => (
                            <li key={i} className="text-xs text-accent-sunset-soft font-normal">
                              <span className="text-accent-sunset font-mono text-[11px] mr-1">//</span>
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
            <div className="card-xai">
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow-mono text-accent-sunset">
                  // CONTEXTUAL DIFFERENCE ANALYSIS
                </span>
                <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                  EMPIRICAL DISCREPANCY EVALUATION
                </span>
              </div>
              <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mb-5">
                Differences contextualized via underlying benchmarks, metrics, and experimental configurations
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compareData.differences.map((diff, idx) => (
                  <div key={idx} className="bg-canvas-soft border border-hairline rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-normal text-ink font-mono uppercase tracking-wider">{diff.aspect}</span>
                      <span className="text-[10px] font-mono uppercase tracking-caption-mono-sm px-2 py-0.5 rounded-pill bg-canvas-card border border-accent-sunset/40 text-accent-sunset-soft">
                        {diff.status_label || 'NEEDS MANUAL VERIFICATION'}
                      </span>
                    </div>
                    <p className="text-xs text-body/90 leading-relaxed font-normal">{diff.description}</p>
                    <div className="mt-3 pt-2.5 border-t border-hairline text-[11px] text-mute font-normal">
                      <span className="font-mono uppercase tracking-caption-mono-sm text-body">Possible Explanation:</span> {diff.possible_explanation}
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
