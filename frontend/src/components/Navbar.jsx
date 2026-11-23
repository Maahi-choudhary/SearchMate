import React from 'react';
import { Layers, GitCompare, Share2, Sparkles, HelpCircle, Plus } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, currentCollection, collections, onSelectCollection, onNewWorkspace }) {
  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: Layers },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'graph', label: 'Graph', icon: Share2 },
    { id: 'discover', label: 'Discover', icon: Sparkles },
    { id: 'qa', label: 'Ask Collection', icon: HelpCircle },
  ];

  return (
    <header className="bg-canvas border-b border-hairline sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('landing')}
          >
            {/* Minimalist Geometric Icon */}
            <div className="w-8 h-8 rounded-sm border border-white/30 bg-canvas-card flex items-center justify-center text-ink text-xs font-mono group-hover:border-white transition-colors">
              XM
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-normal tracking-[-0.6px] text-ink">
                SearchMate
              </span>
              <span className="hidden sm:inline-block font-mono uppercase text-[10px] tracking-caption-mono text-mute">
                [AI RESEARCH]
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Pill Style) */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'workspace' && activeTab === 'overview');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-pill text-xs transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'border border-white/60 bg-white/10 text-ink'
                      : 'border border-transparent text-body-mid hover:text-ink hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span className="font-normal">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Workspace Selector & Action */}
          <div className="flex items-center space-x-3">
            {collections && collections.length > 0 ? (
              <div className="relative">
                <select
                  value={currentCollection?.id || ''}
                  onChange={(e) => onSelectCollection(e.target.value)}
                  className="text-xs bg-canvas-soft border border-hairline text-ink rounded-pill px-3 py-1.5 focus:outline-none focus:border-white/50 max-w-[140px] sm:max-w-[200px] truncate font-mono uppercase tracking-wider"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-canvas-card text-ink">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <button
              onClick={onNewWorkspace}
              className="btn-outline-sm"
              title="Create new topic"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono uppercase tracking-caption-mono-sm text-[11px]">Topic</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
