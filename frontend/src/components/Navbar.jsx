import React from 'react';
import { Layers, GitCompare, Share2, Sparkles, HelpCircle, Plus, BookOpen } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, currentCollection, collections, onSelectCollection, onNewWorkspace }) {
  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: Layers },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'graph', label: 'Graph', icon: Share2 },
    { id: 'discover', label: 'Discover', icon: Sparkles },
    { id: 'qa', label: 'Ask Collection', icon: HelpCircle },
  ];

  return (
    <header className="bg-canvas/90 backdrop-blur-md border-b border-hairline sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand (Discord Clyde-Style Accent) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none" 
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5865f2] to-[#4752c4] flex items-center justify-center text-white shadow-discord-blurple group-hover:scale-105 transition-transform duration-150">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#5865f2] transition-colors">
                SearchMate
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-pill bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2] text-[10px] font-bold font-mono tracking-wider">
                STUDENT AI
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Discord Channel Tab Style) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#1e2353]/50 p-1 rounded-lg border border-[#282b54]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'workspace' && activeTab === 'overview');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#5865f2] text-white shadow-md font-semibold'
                      : 'text-[#949ba4] hover:text-white hover:bg-[#1e2353] font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#949ba4]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Workspace Selector & Action */}
          <div className="flex items-center space-x-2.5">
            {collections && collections.length > 0 ? (
              <div className="relative">
                <select
                  value={currentCollection?.id || ''}
                  onChange={(e) => onSelectCollection(e.target.value)}
                  className="text-xs bg-[#1e2353] border border-[#282b54] text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-[#5865f2] max-w-[140px] sm:max-w-[200px] truncate font-medium shadow-sm cursor-pointer"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#23272a] text-white">
                      #{c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <button
              onClick={onNewWorkspace}
              className="btn-green text-xs !py-1.5 !px-3"
              title="Create new research topic"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline font-bold">New Topic</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
