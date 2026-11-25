import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Search, List, Network, ArrowUpRight, Share2, Hash } from 'lucide-react';
import { api } from '../services/api';
import { CitationLink } from '../components/CitationLink';
import { EmptyState } from '../components/EmptyState';

export function ResearchGraphView({ collectionId, onOpenPaper, onPreviewCitation }) {
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

  // Calculate clean layout coordinates for nodes with dynamic auto-centering
  const CANVAS_WIDTH = 840;
  const CANVAS_HEIGHT = 500;
  const nodePositions = {};
  const paperNodes = filteredNodes.filter(n => n.type === 'paper');
  const themeNodes = filteredNodes.filter(n => n.type === 'theme');

  // Symmetrically center theme nodes across canvas width
  const totalThemes = Math.max(themeNodes.length, 1);
  const themeSpacing = CANVAS_WIDTH / (totalThemes + 1);
  themeNodes.forEach((node, idx) => {
    nodePositions[node.id] = {
      x: (idx + 1) * themeSpacing,
      y: 130
    };
  });

  // Symmetrically center paper nodes across canvas width
  const totalPapers = Math.max(paperNodes.length, 1);
  const paperSpacing = CANVAS_WIDTH / (totalPapers + 1);
  paperNodes.forEach((node, idx) => {
    nodePositions[node.id] = {
      x: (idx + 1) * paperSpacing,
      y: 360
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
          <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase block mb-1">
            // TOPOLOGY PROTOCOL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Research Relationship Graph
          </h1>
          <p className="text-xs text-white/60 font-mono uppercase mt-1">
            Interactive map of shared topics, methodology overlaps, and paper-to-theme connections
          </p>
        </div>

        {/* Graph vs Accessible List Toggle */}
        <div className="flex items-center bg-[#23272a] border border-[#282b54] rounded-full p-1 self-start sm:self-auto shadow-discord-sm">
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              viewMode === 'canvas'
                ? 'bg-[#5865f2] text-white shadow-discord-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            Graph Canvas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-[#5865f2] text-white shadow-discord-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            Accessible List
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Zoom Controls */}
      <div className="card-discord py-3 px-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers, themes, keywords..."
              className="w-full text-xs bg-[#23272a] border border-[#282b54] rounded-full pl-9 pr-3.5 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[10px] font-semibold text-[#00b0f4] uppercase mr-1">FILTER:</span>
            {['all', 'paper', 'theme'].map((type) => (
              <button
                key={type}
                onClick={() => setNodeTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
                  nodeTypeFilter === type
                    ? 'border-[#5865f2] bg-[#5865f2] text-white shadow-discord-sm'
                    : 'border-[#282b54] bg-[#23272a] text-white/70 hover:border-[#5865f2] hover:text-white'
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
            className="btn-outline-sm p-2 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
            className="btn-outline-sm p-2 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="btn-outline-sm px-3 py-1.5 rounded-lg flex items-center gap-1"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Reset</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 text-center card-discord animate-pulse text-xs font-mono text-white/60">
          Constructing topology graph...
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#23272a] border border-[#ec48bd]/50 text-[#ec48bd] text-xs rounded-xl my-4 font-mono shadow-discord-card">
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
                className="lg:col-span-2 bg-[#0a0d3a] border border-[#282b54] rounded-2xl overflow-hidden relative h-[520px] select-none cursor-grab active:cursor-grabbing shadow-discord-card"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <div className="absolute top-3 left-3 z-10 bg-[#1e2353]/90 backdrop-blur-md border border-[#282b54] rounded-full px-3.5 py-1.5 text-xs text-white/70 flex items-center gap-3 shadow-discord-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2] inline-block shadow-[0_0_6px_#5865f2]"></span>
                    Paper Node
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ec48bd] inline-block shadow-[0_0_6px_#ec48bd]"></span>
                    Theme Node
                  </span>
                  <span className="text-white/40">· Drag to pan · Click to inspect</span>
                </div>

                {/* SVG Visual Canvas */}
                <svg
                  viewBox="0 0 840 500"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out'
                  }}
                >
                  {/* Subtle Grid Pattern in Canvas */}
                  <defs>
                    <pattern id="discordGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill="#282b54" opacity="0.6" />
                    </pattern>
                  </defs>
                  <rect width="840" height="500" fill="url(#discordGrid)" />

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
                          stroke={isSelected ? '#35ed7e' : isSimilarMethod ? '#ec48bd' : '#3c4270'}
                          strokeWidth={isSelected ? 2.5 : isSimilarMethod ? 2 : 1.5}
                          strokeDasharray={isSimilarMethod ? '5 4' : 'none'}
                          className="transition-all hover:stroke-[#5865f2]"
                        />
                        {/* Edge Label Badge */}
                        <rect
                          x={(src.x + tgt.x) / 2 - 46}
                          y={(src.y + tgt.y) / 2 - 10}
                          width={92}
                          height={20}
                          rx={10}
                          fill="#23272a"
                          stroke={isSelected ? '#35ed7e' : '#282b54'}
                          strokeWidth={1}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 + 4}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight="600"
                          fontFamily="Inter, sans-serif"
                          letterSpacing="0.5px"
                          fill={isSelected ? '#35ed7e' : '#00b0f4'}
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
                          r={isPaper ? 28 : 24}
                          fill={isPaper ? '#1e2353' : '#23272a'}
                          stroke={isSelected ? '#ffffff' : isPaper ? '#5865f2' : '#ec48bd'}
                          strokeWidth={isSelected ? 3 : 2}
                          className="transition-transform group-hover:scale-110"
                        />

                        {/* Node Center Label */}
                        <text
                          textAnchor="middle"
                          dy=".35em"
                          fontSize={11}
                          fontFamily="Inter, sans-serif"
                          fontWeight="700"
                          fill={isSelected ? '#ffffff' : isPaper ? '#5865f2' : '#ec48bd'}
                        >
                          {isPaper ? 'PDF' : 'THM'}
                        </text>

                        {/* Node Label Below */}
                        <rect
                          x={-85}
                          y={34}
                          width={170}
                          height={22}
                          rx={6}
                          fill="#23272a"
                          stroke={isSelected ? '#ffffff' : '#282b54'}
                          strokeWidth={1}
                        />
                        <text
                          x={0}
                          y={49}
                          textAnchor="middle"
                          fontSize={10}
                          fontFamily="Inter, sans-serif"
                          fontWeight="500"
                          fill="#ffffff"
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
              <div className="card-discord p-6 flex flex-col justify-between overflow-y-auto max-h-[520px]">
                {selectedNode && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedNode.type === 'paper'
                          ? 'bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30'
                          : 'bg-[#ec48bd]/20 text-[#ec48bd] border border-[#ec48bd]/30'
                      }`}>
                        {selectedNode.type === 'paper' ? '[DOCUMENT RECORD]' : '[RECURRING THEME]'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                      {selectedNode.label}
                    </h3>

                    {selectedNode.type === 'paper' ? (
                      <div className="mt-4 space-y-3.5 text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-[#00b0f4] uppercase tracking-wider block mb-1">// AUTHORS & YEAR:</span>
                          <span className="text-white/60 font-mono text-[11px]">
                            {(selectedNode.metadata?.authors || []).join(', ') || 'Not found'} · {selectedNode.metadata?.publication_year || 'Year not found'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-[#00b0f4] uppercase tracking-wider block mb-1">// METHODOLOGY:</span>
                          <p className="text-white/80 leading-relaxed bg-[#23272a] p-3 rounded-xl border border-[#282b54] font-normal">
                            {selectedNode.metadata?.methodology || 'Not found in paper'}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-[#00b0f4] uppercase tracking-wider block mb-1">// DATASET / BENCHMARK:</span>
                          <span className="font-mono text-white/80 text-[11px] bg-[#23272a] px-3 py-1 rounded-full border border-[#282b54] inline-block">
                            {selectedNode.metadata?.dataset || 'Not found in paper'}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => onOpenPaper(selectedNode.metadata?.paper_id)}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-xs"
                          >
                            <span>Open Full Paper Breakdown</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3.5 text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-[#ec48bd] uppercase tracking-wider block mb-1">// THEME DESCRIPTION:</span>
                          <p className="text-white/80 leading-relaxed bg-[#23272a] p-3 rounded-xl border border-[#282b54] font-normal">
                            {selectedNode.metadata?.description || 'Shared topic synthesized across multiple papers.'}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-[#ec48bd] uppercase tracking-wider block mb-1">// ASSOCIATED KEYWORDS:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {(selectedNode.metadata?.keywords || []).map((k, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 bg-[#23272a] text-[#00b0f4] rounded-full text-[10px] font-medium border border-[#282b54]">
                                #{k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#35ed7e] uppercase tracking-wider block">
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
                      <span className="px-2.5 py-0.5 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] font-bold uppercase tracking-wider">
                        [{selectedEdge.label.toUpperCase()}]
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      Relationship Correlation
                    </h3>

                    <p className="text-xs text-white/80 bg-[#23272a] p-3.5 rounded-xl border border-[#282b54] leading-relaxed mb-4 font-normal">
                      {selectedEdge.explanation}
                    </p>

                    {/* Traceable Evidence References */}
                    {selectedEdge.evidence_refs && selectedEdge.evidence_refs.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-[#00b0f4] uppercase tracking-wider block mb-2">// TRACEABLE EVIDENCE:</span>
                        <div className="space-y-2">
                          {selectedEdge.evidence_refs.map((ev, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => onPreviewCitation && onPreviewCitation(ev)}
                              className={`bg-[#23272a] p-3 rounded-xl border border-[#282b54] text-xs ${
                                onPreviewCitation ? 'cursor-pointer hover:border-[#5865f2] transition-colors' : ''
                              }`}
                              title={onPreviewCitation ? "Click to verify excerpt in document drawer" : ""}
                            >
                              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#00b0f4] mb-1 font-semibold">
                                <span className="truncate max-w-[180px]">{ev.paper_title}</span>
                                {ev.page_number && <span>P.{ev.page_number}</span>}
                              </div>
                              <p className="text-white/70 italic text-[11px] font-normal leading-relaxed">"{ev.excerpt}"</p>
                              {onPreviewCitation && (
                                <span className="text-[9px] font-mono uppercase text-[#35ed7e] flex items-center gap-1 mt-1.5 font-semibold">
                                  <span>// VERIFY EXCERPT</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedNode && !selectedEdge && (
                  <div className="text-center text-xs font-mono text-white/50 my-auto">
                    // CLICK ANY NODE OR CONNECTION TO INSPECT ITS EVIDENCE
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Accessible List View Alternative */
            <div className="card-discord p-6 space-y-8">
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#5865f2] uppercase block mb-2">
                  // 01_DOCUMENT NODES IN CORPUS ({paperNodes.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {paperNodes.map((pn) => (
                    <div key={pn.id} className="bg-[#23272a] border border-[#282b54] rounded-xl p-4 text-xs hover:border-[#5865f2]/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-sm font-bold text-white block">{pn.label}</strong>
                        <button
                          onClick={() => onOpenPaper(pn.metadata?.paper_id)}
                          className="btn-outline-sm text-[10px] py-1 px-2.5 rounded-lg flex items-center gap-1"
                        >
                          <span>View</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-white/50 block mt-2">
                        YEAR: {pn.metadata?.publication_year || 'NOT FOUND'} · DATASET: {pn.metadata?.dataset || 'NOT FOUND'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#282b54]">
                <span className="text-xs font-semibold tracking-wider text-[#ec48bd] uppercase block mb-2">
                  // 02_RECURRING THEMES ({themeNodes.length})
                </span>
                <div className="space-y-3 mt-3">
                  {themeNodes.map((tn) => (
                    <div key={tn.id} className="bg-[#23272a] border border-[#282b54] rounded-xl p-4 text-xs hover:border-[#ec48bd]/50 transition-colors">
                      <strong className="text-sm font-bold text-white block">{tn.label}</strong>
                      <p className="text-white/70 mt-1.5 leading-relaxed font-normal">{tn.metadata?.description}</p>
                      <span className="text-[10px] font-semibold text-[#ec48bd] uppercase tracking-wider block mt-2">
                        // CONNECTS {tn.metadata?.paper_count || 1} PAPERS IN THIS COLLECTION
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#282b54]">
                <span className="text-xs font-semibold tracking-wider text-[#35ed7e] uppercase block mb-2">
                  // 03_VERIFIED RELATIONSHIP EDGES ({filteredEdges.length})
                </span>
                <div className="space-y-3 mt-3">
                  {filteredEdges.map((edge) => (
                    <div key={edge.id} className="bg-[#23272a] border border-[#282b54] rounded-xl p-4 text-xs hover:border-[#35ed7e]/50 transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#35ed7e]/15 border border-[#35ed7e]/30 text-[#35ed7e]">
                          [{edge.label}]
                        </span>
                        <span className="text-[10px] text-white/50 font-mono">{edge.type}</span>
                      </div>
                      <p className="text-white/80 leading-relaxed font-normal">{edge.explanation}</p>
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
