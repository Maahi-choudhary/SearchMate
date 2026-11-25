import React from 'react';
import { AlertTriangle, Lightbulb, Compass, ArrowUpRight, Sparkles, ShieldAlert } from 'lucide-react';
import { CitationLink } from '../components/CitationLink';
import { EmptyState } from '../components/EmptyState';

export function DiscoverPage({ insights = [], onOpenPaper, onPreviewCitation }) {
  const recurringLimitations = insights.filter(i => i.type === 'recurring_limitation');
  const potentialGaps = insights.filter(i => i.type === 'potential_gap');
  const projectIdeas = insights.filter(i => i.type === 'idea');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-wider text-[#ec48bd] uppercase block mb-1">
          // RESEARCH OPPORTUNITY SYNTHESIS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Gaps, Limitations & Project Directions
        </h1>
        <p className="text-xs text-white/60 font-mono uppercase mt-1">
          Patterns derived from author-stated constraints across your research collection
        </p>
      </div>

      {/* Mandatory Safeguard Warning Notice */}
      <div className="bg-[#23272a] border-l-4 border-l-[#ec48bd] border-t border-r border-b border-[#282b54] rounded-xl p-5 mb-10 shadow-discord-card">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-[#ec48bd]" />
          <span className="text-xs font-semibold text-[#ec48bd] uppercase tracking-wider">
            // MANDATORY ACADEMIC INTEGRITY NOTICE
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wide text-white/50 px-2 py-0.5 rounded-full bg-[#ec48bd]/15 border border-[#ec48bd]/30">
            [COLLECTION-BOUND HYPOTHESES]
          </span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed font-normal">
          These observations represent recurring limitations and underexplored areas <em className="text-white font-semibold">strictly within the papers you have uploaded</em>. A collection-based gap is not proof that no prior research exists in the global literature. Always verify candidate directions through formal academic databases (e.g. arXiv, IEEE, ACM) before thesis submission.
        </p>
      </div>

      {insights.length === 0 ? (
        <EmptyState
          title="No insights synthesized yet"
          description="Upload multiple papers in your workspace to enable automatic recurring limitation detection and grounded project suggestions."
        />
      ) : (
        <div className="space-y-12">
          {/* Section 1: Recurring Limitations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full bg-[#ec48bd]/20 text-[#ec48bd] border border-[#ec48bd]/30 text-[10px] font-bold font-mono uppercase inline-block">
                01_RECURRING LIMITATIONS ACROSS PAPERS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                [{recurringLimitations.length} DETECTED]
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              Cross-Paper Limitation Clusters
            </h2>
            <p className="text-xs text-white/60 font-mono uppercase mb-5">
              Shortcomings and boundary conditions acknowledged independently by multiple authors
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringLimitations.map((item) => (
                <div key={item.id} className="card-discord p-5 flex flex-col justify-between hover:border-[#ec48bd]/60">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-[#ec48bd] px-2 py-0.5 rounded-full bg-[#ec48bd]/15 border border-[#ec48bd]/30 font-bold">
                        [RECURRING PATTERN]
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-1">{item.title}</h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {item.evidences && item.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-[#282b54]">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-white/50 block mb-2">
                        // SUPPORTING EVIDENCE:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.evidences.map((ev, idx) => (
                          <CitationLink
                            key={idx}
                            paperTitle={ev.paper_title}
                            pageNumber={ev.page_number}
                            excerpt={ev.evidence_text}
                            onClick={() => onPreviewCitation ? onPreviewCitation(ev) : onOpenPaper(ev.paper_id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Potential Research Gaps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full bg-[#00b0f4]/20 text-[#00b0f4] border border-[#00b0f4]/30 text-[10px] font-bold font-mono uppercase inline-block">
                02_POTENTIAL RESEARCH GAPS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                [COLLECTION HYPOTHESES]
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              Underexplored Domain Spaces
            </h2>
            <p className="text-xs text-white/60 font-mono uppercase mb-5">
              Target problem configurations sparsely covered across your current corpus
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potentialGaps.map((gap) => (
                <div key={gap.id} className="card-discord p-5 flex flex-col justify-between hover:border-[#00b0f4]/60">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-[#00b0f4] px-2 py-0.5 rounded-full bg-[#00b0f4]/15 border border-[#00b0f4]/30 font-bold">
                        [POTENTIAL GAP]
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                        REQUIRES VERIFICATION
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-1">{gap.title}</h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed font-normal">
                      {gap.description}
                    </p>
                  </div>

                  {gap.evidences && gap.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-[#282b54]">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-white/50 block mb-2">
                        // SOURCED FROM:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {gap.evidences.map((ev, idx) => (
                          <CitationLink
                            key={idx}
                            paperTitle={ev.paper_title}
                            pageNumber={ev.page_number}
                            excerpt={ev.evidence_text}
                            onClick={() => onPreviewCitation ? onPreviewCitation(ev) : onOpenPaper(ev.paper_id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Grounded Project Ideas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block">
                03_GROUNDED PROJECT DIRECTIONS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                [ACTIONABLE DIRECTIONS]
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              Beginner-Friendly Project Blueprints
            </h2>
            <p className="text-xs text-white/60 font-mono uppercase mb-5">
              Structured ideas for mini-projects, seminars, or capstones directly inspired by stated limitations
            </p>

            <div className="space-y-4">
              {projectIdeas.map((idea) => (
                <div key={idea.id} className="card-discord p-6 hover:border-[#5865f2]/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-white px-2.5 py-0.5 rounded-full bg-[#5865f2]/30 border border-[#5865f2]/50 font-bold">
                      [DIRECTION PROPOSAL]
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                      FEASIBILITY: UNDERGRADUATE / CAPSTONE
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mt-1">{idea.title}</h3>
                  
                  <div className="mt-4 text-xs text-white/85 leading-relaxed whitespace-pre-line bg-[#23272a] p-4 rounded-xl border border-[#282b54] font-normal">
                    {idea.description}
                  </div>

                  {idea.evidences && idea.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-[#282b54] flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                        // GROUNDED IN:
                      </span>
                      {idea.evidences.map((ev, idx) => (
                        <CitationLink
                          key={idx}
                          paperTitle={ev.paper_title}
                          pageNumber={ev.page_number}
                          excerpt={ev.evidence_text}
                          onClick={() => onPreviewCitation ? onPreviewCitation(ev) : onOpenPaper(ev.paper_id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
