import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Search, List, Network, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { CitationLink } from '../components/CitationLink';
import { EmptyState } from '../components/EmptyState';

export function ResearchGraphView({ collectionId, onOpenPaper }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View mode: 'canvas' or 'list'
  const [viewMode, setViewMode] = useState('canvas');
  
  // Selection
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [nodeTypeFilter, setNodeTypeFilter] = useState('all'); // 'all', 'paper', 'theme'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    loadGraph();
  }, [collectionId]);

  const loadGraph = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getCollectionGraph(collectionId);
      setGraphData(data || { nodes: [], edges: [] });
      if (data?.nodes?.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      setError(err?.message || 'Could not load relationship graph.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedEdge(null);
    if (graphData.nodes.length > 0) {
      setSelectedNode(graphData.nodes[0]);
    }
  };

  // Filtered nodes
  const filteredNodes = graphData.nodes.filter(node => {
    if (nodeTypeFilter !== 'all' && node.type !== nodeTypeFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchLabel = node.label.toLowerCase().includes(query);
      const matchKeywords = (node.metadata?.keywords || []).some(k => k.toLowerCase().includes(query));
      const matchDataset = (node.metadata?.dataset || '').toLowerCase().includes(query);
      if (!matchLabel && !matchKeywords && !matchDataset) return false;
    }
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  // Filtered edges
  const filteredEdges = graphData.edges.filter(edge => {
    return filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
  });

  // Calculate clean layout coordinates for nodes on the canvas
  const nodePositions = {};
  const paperNodes = filteredNodes.filter(n => n.type === 'paper');
  const themeNodes = filteredNodes.filter(n => n.type === 'theme');

  themeNodes.forEach((node, idx) => {
    const total = Math.max(themeNodes.length, 1);
    const spacing = 600 / (total + 1);
    nodePositions[node.id] = {
      x: 120 + (idx + 1) * spacing,
      y: 130
    };
  });

  paperNodes.forEach((node, idx) => {
    const total = Math.max(paperNodes.length, 1);
    const spacing = 700 / (total + 1);
    nodePositions[node.id] = {
      x: 80 + (idx + 1) * spacing,
      y: 340
    };
  });

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-node') || e.target.closest('.interactive-edge')) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow-mono block mb-1">
            // TOPOLOGY PROTOCOL
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.8px] text-ink">
            Research Relationship Graph
          </h1>
          <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mt-1">
            Interactive map of shared topics, methodology overlaps, and paper-to-theme connections
          </p>
        </div>

        {/* Graph vs Accessible List Toggle */}
        <div className="flex items-center bg-canvas-card border border-hairline rounded-pill p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-caption-mono-sm transition duration-150 flex items-center gap-1.5 ${
              viewMode === 'canvas'
                ? 'bg-canvas-soft text-ink border border-white/20'
                : 'text-mute hover:text-ink'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Graph Canvas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-caption-mono-sm transition duration-150 flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-canvas-soft text-ink border border-white/20'
                : 'text-mute hover:text-ink'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Accessible List
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Zoom Controls */}
      <div className="card-xai py-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-mute absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers, themes, keywords..."
              className="w-full text-xs bg-canvas-soft border border-hairline rounded-pill pl-9 pr-3.5 py-1.5 text-ink focus:outline-none focus:border-white/50 font-normal"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="eyebrow-mono text-[10px] mr-1">FILTER:</span>
            {['all', 'paper', 'theme'].map((type) => (
              <button
                key={type}
                onClick={() => setNodeTypeFilter(type)}
                className={`px-3 py-1 rounded-pill text-[11px] font-mono uppercase tracking-caption-mono-sm transition duration-150 border ${
                  nodeTypeFilter === type
                    ? 'border-white bg-white/10 text-ink'
                    : 'border-hairline bg-canvas-soft text-mute hover:border-white/30 hover:text-ink'
                }`}
              >
                {type === 'all' ? 'All' : type === 'paper' ? 'Papers' : 'Themes'}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Zoom & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
            className="btn-outline-sm p-1.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
            className="btn-outline-sm p-1.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="btn-outline-sm px-3 py-1"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[10px]">Reset</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 text-center card-xai animate-pulse text-xs font-mono text-mute">
          Constructing topology graph...
        </div>
      )}

      {error && (
        <div className="p-4 card-xai border-accent-sunset text-accent-sunset-soft text-xs rounded-sm my-4 font-mono">
          {error}
        </div>
      )}

      {!isLoading && !error && graphData.nodes.length === 0 && (
        <EmptyState
          title="No relationship records found"
          description="Upload research papers in your workspace to synthesize relationship nodes and connections."
        />
      )}

      {!isLoading && !error && graphData.nodes.length > 0 && (
        <>
          {viewMode === 'canvas' ? (
            /* Graph Canvas + Details Panel Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Canvas Area (2 cols) */}
              <div 
                className="lg:col-span-2 bg-[#0a0a0a] border border-hairline rounded-sm overflow-hidden relative h-[520px] select-none cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <div className="absolute top-3 left-3 z-10 bg-canvas-card/90 backdrop-blur-sm border border-hairline rounded-pill px-3 py-1 text-[10px] font-mono uppercase tracking-caption-mono text-mute flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-breeze inline-block"></span>
                    Paper Node
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-dusk inline-block"></span>
                    Theme Node
                  </span>
                  <span>· Drag to pan · Click for citations</span>
                </div>

                {/* SVG Visual Canvas */}
                <svg
                  className="w-full h-full"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out'
                  }}
                >
                  {/* Render Edges */}
                  {filteredEdges.map((edge) => {
                    const src = nodePositions[edge.source];
                    const tgt = nodePositions[edge.target];
                    if (!src || !tgt) return null;

                    const isSelected = selectedEdge?.id === edge.id;
                    const isSimilarMethod = edge.type === 'similar_method';

                    return (
                      <g key={edge.id} className="interactive-edge cursor-pointer" onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={isSelected ? '#ffffff' : isSimilarMethod ? '#7c3aed' : '#212327'}
                          strokeWidth={isSelected ? 2 : isSimilarMethod ? 1.5 : 1}
                          strokeDasharray={isSimilarMethod ? '4 3' : 'none'}
                          className="transition-all hover:stroke-white/80"
                        />
                        {/* Edge Label Badge */}
                        <rect
                          x={(src.x + tgt.x) / 2 - 42}
                          y={(src.y + tgt.y) / 2 - 8}
                          width={84}
                          height={16}
                          rx={8}
                          fill="#191919"
                          stroke={isSelected ? '#ffffff' : '#212327'}
                          strokeWidth={1}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 + 3}
                          textAnchor="middle"
                          fontSize={8}
                          fontFamily="Geist Mono, monospace"
                          letterSpacing="0.8px"
                          fill={isSelected ? '#ffffff' : '#7d8187'}
                        >
                          {edge.label.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Nodes */}
                  {filteredNodes.map((node) => {
                    const pos = nodePositions[node.id];
                    if (!pos) return null;

                    const isPaper = node.type === 'paper';
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <g
                        key={node.id}
                        className="interactive-node cursor-pointer group"
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node);
                          setSelectedEdge(null);
                        }}
                      >
                        {/* Node Shape */}
                        <circle
                          r={isPaper ? 26 : 22}
                          fill="#191919"
                          stroke={isSelected ? '#ffffff' : isPaper ? '#a0c3ec' : '#7c3aed'}
                          strokeWidth={isSelected ? 2 : 1.5}
                          className="transition-transform group-hover:scale-105"
                        />

                        {/* Node Center Label */}
                        <text
                          textAnchor="middle"
                          dy=".3em"
                          fontSize={10}
                          fontFamily="Geist Mono, monospace"
                          fontWeight="400"
                          letterSpacing="1px"
                          fill={isSelected ? '#ffffff' : isPaper ? '#a0c3ec' : '#c4b5fd'}
                        >
                          {isPaper ? 'PDF' : 'THM'}
                        </text>

                        {/* Node Label Below */}
                        <rect
                          x={-80}
                          y={32}
                          width={160}
                          height={20}
                          rx={4}
                          fill="#191919"
                          stroke={isSelected ? '#ffffff' : '#212327'}
                          strokeWidth={1}
                        />
                        <text
                          x={0}
                          y={45}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="Inter, sans-serif"
                          fontWeight="400"
                          fill="#dadbdf"
                          className="pointer-events-none"
                        >
                          {node.label.length > 22 ? node.label.slice(0, 20) + '...' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Right Side Details Panel */}
              <div className="card-xai flex flex-col justify-between overflow-y-auto max-h-[520px]">
                {selectedNode && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-white px-2 py-0.5 rounded-pill bg-canvas-soft border border-hairline">
                        {selectedNode.type === 'paper' ? '[DOCUMENT RECORD]' : '[RECURRING THEME]'}
                      </span>
                    </div>

                    <h3 className="text-base font-normal tracking-[-0.4px] text-ink leading-snug">
                      {selectedNode.label}
                    </h3>

                    {selectedNode.type === 'paper' ? (
                      <div className="mt-4 space-y-3.5 text-xs">
                        <div>
                          <span className="eyebrow-mono text-[10px] block mb-1">// AUTHORS & YEAR:</span>
                          <span className="text-mute font-mono text-[11px]">
                            {(selectedNode.metadata?.authors || []).join(', ') || 'Not found'} · {selectedNode.metadata?.publication_year || 'Year not found'}
                          </span>
                        </div>

                        <div>
                          <span className="eyebrow-mono text-[10px] block mb-1">// METHODOLOGY:</span>
                          <p className="text-body/85 leading-relaxed bg-canvas-soft p-3 rounded-sm border border-hairline font-normal">
                            {selectedNode.metadata?.methodology || 'Not found in paper'}
                          </p>
                        </div>

                        <div>
                          <span className="eyebrow-mono text-[10px] block mb-1">// DATASET / BENCHMARK:</span>
                          <span className="font-mono text-mute text-[11px] bg-canvas-soft px-2.5 py-1 rounded-pill border border-hairline inline-block">
                            {selectedNode.metadata?.dataset || 'Not found in paper'}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => onOpenPaper(selectedNode.metadata?.paper_id)}
                            className="btn-outline-sm w-full"
                          >
                            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Open Full Paper Breakdown</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3.5 text-xs">
                        <div>
                          <span className="eyebrow-mono text-[10px] block mb-1">// THEME DESCRIPTION:</span>
                          <p className="text-body/85 leading-relaxed bg-canvas-soft p-3 rounded-sm border border-hairline font-normal">
                            {selectedNode.metadata?.description || 'Shared topic synthesized across multiple papers.'}
                          </p>
                        </div>

                        <div>
                          <span className="eyebrow-mono text-[10px] block mb-1">// ASSOCIATED KEYWORDS:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(selectedNode.metadata?.keywords || []).map((k, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-canvas-soft text-mute rounded-pill text-[10px] font-mono border border-hairline">
                                #{k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-breeze block">
                            // CONNECTS {selectedNode.metadata?.paper_count || 1} PAPERS IN THIS COLLECTION
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedEdge && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-twilight px-2 py-0.5 rounded-pill bg-canvas-soft border border-hairline">
                        [{selectedEdge.label.toUpperCase()}]
                      </span>
                    </div>

                    <h3 className="text-sm font-normal text-ink mb-2">
                      Relationship Correlation
                    </h3>

                    <p className="text-xs text-body/90 bg-canvas-soft p-3.5 rounded-sm border border-hairline leading-relaxed mb-4 font-normal">
                      {selectedEdge.explanation}
                    </p>

                    {/* Traceable Evidence References */}
                    {selectedEdge.evidence_refs && selectedEdge.evidence_refs.length > 0 && (
                      <div>
                        <span className="eyebrow-mono text-[10px] block mb-2">// TRACEABLE EVIDENCE:</span>
                        <div className="space-y-2">
                          {selectedEdge.evidence_refs.map((ev, idx) => (
                            <div key={idx} className="bg-canvas-soft p-3 rounded-sm border border-hairline text-xs">
                              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-caption-mono text-accent-breeze mb-1">
                                <span className="truncate max-w-[180px]">{ev.paper_title}</span>
                                {ev.page_number && <span>P.{ev.page_number}</span>}
                              </div>
                              <p className="text-mute italic text-[11px] font-normal leading-relaxed">"{ev.excerpt}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedNode && !selectedEdge && (
                  <div className="text-center text-xs font-mono text-mute my-auto">
                    // CLICK ANY NODE OR CONNECTION TO INSPECT ITS EVIDENCE
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Accessible List View Alternative */
            <div className="card-xai space-y-8">
              <div>
                <span className="eyebrow-mono block mb-2">
                  // 01_DOCUMENT NODES IN CORPUS ({paperNodes.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {paperNodes.map((pn) => (
                    <div key={pn.id} className="bg-canvas-soft border border-hairline rounded-sm p-4 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-sm font-normal text-ink block">{pn.label}</strong>
                        <button
                          onClick={() => onOpenPaper(pn.metadata?.paper_id)}
                          className="btn-outline-sm text-[10px] py-0.5 px-2"
                        >
                          View <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute block mt-2">
                        YEAR: {pn.metadata?.publication_year || 'NOT FOUND'} · DATASET: {pn.metadata?.dataset || 'NOT FOUND'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-hairline">
                <span className="eyebrow-mono block mb-2 text-accent-twilight">
                  // 02_RECURRING THEMES ({themeNodes.length})
                </span>
                <div className="space-y-3 mt-3">
                  {themeNodes.map((tn) => (
                    <div key={tn.id} className="bg-canvas-soft border border-hairline rounded-sm p-4 text-xs">
                      <strong className="text-sm font-normal text-ink block">{tn.label}</strong>
                      <p className="text-body/80 mt-1.5 leading-relaxed font-normal">{tn.metadata?.description}</p>
                      <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute block mt-2">
                        // CONNECTS {tn.metadata?.paper_count || 1} PAPERS IN THIS COLLECTION
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-hairline">
                <span className="eyebrow-mono block mb-2 text-accent-sunset">
                  // 03_VERIFIED RELATIONSHIP EDGES ({filteredEdges.length})
                </span>
                <div className="space-y-3 mt-3">
                  {filteredEdges.map((edge) => (
                    <div key={edge.id} className="bg-canvas-soft border border-hairline rounded-sm p-4 text-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono uppercase text-[10px] tracking-caption-mono px-2 py-0.5 rounded-pill bg-canvas-card border border-hairline text-ink">
                          [{edge.label}]
                        </span>
                        <span className="font-mono text-[10px] text-mute">{edge.type}</span>
                      </div>
                      <p className="text-body/85 leading-relaxed font-normal">{edge.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
