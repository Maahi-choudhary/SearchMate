import React from 'react';
import { AlertTriangle, Lightbulb, Compass, ArrowUpRight } from 'lucide-react';
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
        <span className="eyebrow-mono block mb-1 text-accent-sunset">
          // RESEARCH OPPORTUNITY SYNTHESIS
        </span>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.8px] text-ink">
          Gaps, Limitations & Project Directions
        </h1>
        <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mt-1">
          Patterns derived from author-stated constraints across your research collection
        </p>
      </div>

      {/* Mandatory Safeguard Warning Notice */}
      <div className="card-xai bg-canvas-soft border-accent-sunset/40 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow-mono text-accent-sunset">
            // MANDATORY ACADEMIC INTEGRITY NOTICE
          </span>
          <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
            [COLLECTION-BOUND HYPOTHESES]
          </span>
        </div>
        <p className="text-xs text-body/90 leading-relaxed font-normal">
          These observations represent recurring limitations and underexplored areas <em>strictly within the papers you have uploaded</em>. A collection-based gap is not proof that no prior research exists in the global literature. Always verify candidate directions through formal academic databases (e.g. arXiv, IEEE, ACM) before thesis submission.
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
              <span className="eyebrow-mono text-accent-sunset">
                // 01_RECURRING LIMITATIONS ACROSS PAPERS
              </span>
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                [{recurringLimitations.length} DETECTED]
              </span>
            </div>
            <h2 className="text-xl font-normal tracking-[-0.6px] text-ink mb-1">
              Cross-Paper Limitation Clusters
            </h2>
            <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mb-5">
              Shortcomings and boundary conditions acknowledged independently by multiple authors
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringLimitations.map((item) => (
                <div key={item.id} className="card-xai hover:border-white/30 transition-colors duration-150 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-sunset-soft px-2 py-0.5 rounded-pill bg-canvas-soft border border-hairline">
                        [RECURRING PATTERN]
                      </span>
                    </div>
                    <h3 className="text-sm font-normal text-ink tracking-[-0.2px] mt-1">{item.title}</h3>
                    <p className="text-xs text-body/80 mt-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {item.evidences && item.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-hairline">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute block mb-2">
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
              <span className="eyebrow-mono text-accent-breeze">
                // 02_POTENTIAL RESEARCH GAPS
              </span>
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                [COLLECTION HYPOTHESES]
              </span>
            </div>
            <h2 className="text-xl font-normal tracking-[-0.6px] text-ink mb-1">
              Underexplored Domain Spaces
            </h2>
            <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mb-5">
              Target problem configurations sparsely covered across your current corpus
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potentialGaps.map((gap) => (
                <div key={gap.id} className="card-xai hover:border-white/30 transition-colors duration-150 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-breeze px-2 py-0.5 rounded-pill bg-canvas-soft border border-hairline">
                        [POTENTIAL GAP]
                      </span>
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                        REQUIRES VERIFICATION
                      </span>
                    </div>
                    <h3 className="text-sm font-normal text-ink tracking-[-0.2px] mt-1">{gap.title}</h3>
                    <p className="text-xs text-body/80 mt-2 leading-relaxed font-normal">
                      {gap.description}
                    </p>
                  </div>

                  {gap.evidences && gap.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-hairline">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute block mb-2">
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
              <span className="eyebrow-mono text-accent-twilight">
                // 03_GROUNDED PROJECT DIRECTIONS
              </span>
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                [ACTIONABLE DIRECTIONS]
              </span>
            </div>
            <h2 className="text-xl font-normal tracking-[-0.6px] text-ink mb-1">
              Beginner-Friendly Project Blueprints
            </h2>
            <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mb-5">
              Structured ideas for mini-projects, seminars, or capstones directly inspired by stated limitations
            </p>

            <div className="space-y-4">
              {projectIdeas.map((idea) => (
                <div key={idea.id} className="card-xai hover:border-white/30 transition-colors duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono uppercase text-[10px] tracking-caption-mono text-white px-2.5 py-0.5 rounded-pill bg-canvas-soft border border-hairline">
                      [DIRECTION PROPOSAL]
                    </span>
                    <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                      FEASIBILITY: UNDERGRADUATE / CAPSTONE
                    </span>
                  </div>

                  <h3 className="text-base font-normal text-ink tracking-[-0.4px] mt-1">{idea.title}</h3>
                  
                  <div className="mt-4 text-xs text-body/90 leading-relaxed whitespace-pre-line bg-canvas-soft p-4 rounded-sm border border-hairline font-normal">
                    {idea.description}
                  </div>

                  {idea.evidences && idea.evidences.length > 0 && (
                    <div className="mt-5 pt-3.5 border-t border-hairline flex flex-wrap items-center gap-2">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
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
