import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { HomePage } from '../pages/HomePage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { PaperDetailPage } from '../pages/PaperDetailPage';
import { ComparePage } from '../pages/ComparePage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { QuestionsPage } from '../pages/QuestionsPage';
import { ResearchGraphView } from '../pages/ResearchGraphView';
import { ToastContainer } from '../components/Toast';
import { CitationPreviewDrawer } from '../components/CitationPreviewDrawer';
import { api } from '../services/api';
import { X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [overview, setOverview] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [toasts, setToasts] = useState([]);
  const [activeCitation, setActiveCitation] = useState(null);

  // Toast notification helper
  const addToast = (message, type = 'info', title = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newToast = { id, message, type, title, timestamp };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const list = await api.listCollections();
      setCollections(list || []);
      if (list && list.length > 0) {
        selectCollection(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  };

  const selectCollection = async (colId) => {
    try {
      const col = await api.getCollection(colId);
      setCurrentCollection(col);
      const ov = await api.getCollectionOverview(colId);
      setOverview(ov);
    } catch (err) {
      console.error('Failed to fetch collection overview:', err);
    }
  };

  // Track in-progress papers to detect transitions
  const prevInProgressRef = useRef(new Set());

  // Automatic live status polling for papers in progress
  useEffect(() => {
    if (!currentCollection || !overview?.papers) return;

    const inProgressPapers = overview.papers.filter(
      (p) => p.status && !['completed', 'failed'].includes(p.status)
    );

    const currentInProgressIds = new Set(inProgressPapers.map((p) => p.id));
    prevInProgressRef.current = currentInProgressIds;

    if (inProgressPapers.length === 0) return;

    const intervalId = setInterval(async () => {
      try {
        const updatedOv = await api.getCollectionOverview(currentCollection.id);
        if (updatedOv && updatedOv.papers) {
          // Detect papers that have transitioned to completed or failed
          prevInProgressRef.current.forEach((paperId) => {
            const paper = updatedOv.papers.find((p) => p.id === paperId);
            if (paper) {
              if (paper.status === 'completed') {
                addToast(
                  `"${paper.title || paper.filename}" analysis complete. Concepts and gap analysis updated.`,
                  'success',
                  '// INGESTION COMPLETED'
                );
              } else if (paper.status === 'failed') {
                addToast(
                  `"${paper.filename}" processing failed (${paper.error_code || 'Extraction error'}).`,
                  'error',
                  '// EXTRACTION FAILED'
                );
              }
            }
          });

          setOverview(updatedOv);
        }
      } catch (err) {
        console.error('Polling status error:', err);
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [currentCollection?.id, overview?.papers]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    try {
      const created = await api.createCollection(newTopicName.trim());
      setCollections((prev) => [created, ...prev]);
      setCurrentCollection(created);
      setOverview({
        id: created.id,
        name: created.name,
        papers: [],
        themes: [],
        insights: [],
        collection_summary: 'New collection created. Upload papers to begin.'
      });
      setShowNewModal(false);
      setNewTopicName('');
      setActiveTab('workspace');
      addToast(`Topic "${created.name}" initialized.`, 'success', '// TOPIC CREATED');
    } catch (err) {
      addToast(err?.message || 'Could not create topic.', 'error', '// ERROR');
    }
  };

  const handleUpload = async (file) => {
    if (!currentCollection) return;
    setIsUploading(true);
    try {
      await api.uploadPaper(currentCollection.id, file);
      addToast(`Ingesting "${file.name}"... Parsing sections and extracting embeddings.`, 'info', '// INGESTION STARTED');
      // Refresh overview immediately
      const ov = await api.getCollectionOverview(currentCollection.id);
      setOverview(ov);
    } catch (err) {
      addToast(err?.message || 'Failed to upload paper.', 'error', '// UPLOAD FAILED');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenPaper = async (paperId) => {
    try {
      const p = await api.getPaper(paperId);
      setSelectedPaper(p);
      setActiveTab('paper_detail');
    } catch (err) {
      addToast('Failed to retrieve paper details.', 'error', '// NOT FOUND');
    }
  };

  const handleDeletePaper = async (paperId) => {
    try {
      await api.deletePaper(paperId);
      if (currentCollection) {
        const ov = await api.getCollectionOverview(currentCollection.id);
        setOverview(ov);
      }
      addToast('Paper removed from research corpus.', 'info', '// DELETED');
    } catch (err) {
      addToast('Failed to delete paper.', 'error', '// DELETE FAILED');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Citation Evidence Preview Drawer */}
      <CitationPreviewDrawer
        citation={activeCitation}
        isOpen={!!activeCitation}
        onClose={() => setActiveCitation(null)}
        onOpenPaper={handleOpenPaper}
      />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCollection={currentCollection}
        collections={collections}
        onSelectCollection={selectCollection}
        onNewWorkspace={() => setShowNewModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <HomePage
            onStart={() => setActiveTab('workspace')}
            onTryDemo={() => {
              if (collections.length > 0) {
                selectCollection(collections[0].id);
              }
              setActiveTab('workspace');
            }}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspacePage
            collection={currentCollection}
            overview={overview}
            onUpload={handleUpload}
            onOpenPaper={handleOpenPaper}
            onDeletePaper={handleDeletePaper}
            onNavigateTab={setActiveTab}
            isUploading={isUploading}
            onNotify={addToast}
          />
        )}

        {activeTab === 'paper_detail' && (
          <PaperDetailPage
            paper={selectedPaper}
            onBack={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'compare' && (
          <ComparePage
            collectionId={currentCollection?.id || 'demo'}
            papers={overview?.papers || []}
            onOpenPaper={handleOpenPaper}
            onNotify={addToast}
          />
        )}

        {activeTab === 'graph' && (
          <ResearchGraphView
            collectionId={currentCollection?.id || 'demo'}
            onOpenPaper={handleOpenPaper}
            onPreviewCitation={setActiveCitation}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverPage
            insights={overview?.insights || []}
            onOpenPaper={handleOpenPaper}
            onPreviewCitation={setActiveCitation}
          />
        )}

        {activeTab === 'qa' && (
          <QuestionsPage
            collectionId={currentCollection?.id || 'demo'}
            papers={overview?.papers || []}
            onOpenPaper={handleOpenPaper}
            onPreviewCitation={setActiveCitation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-hairline py-8 mt-16 text-xs text-mute">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-ink text-[11px] uppercase tracking-caption-mono">SearchMate //</span>
            <span className="font-mono text-[11px] uppercase tracking-caption-mono text-mute">Frontier Research Synthesis</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-caption-mono text-mute">
            GROUNDED EVIDENCE · SECTION PARSING · UNIVERSAL SANS + GEIST MONO
          </div>
        </div>
      </footer>

      {/* New Topic Modal (ex-modal-card) */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-xai max-w-md w-full bg-canvas-card border border-hairline rounded-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="eyebrow-mono block mb-1">// NEW PROTOCOL</span>
                <h3 className="text-base font-normal tracking-[-0.4px] text-ink">Create Research Topic</h3>
              </div>
              <button 
                onClick={() => setShowNewModal(false)} 
                className="text-mute hover:text-ink p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic}>
              <label className="block text-xs font-mono uppercase tracking-caption-mono-sm text-mute mb-2">
                Topic or Course Project Name:
              </label>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g. Graph Neural Networks, Transformer Optimizations"
                className="w-full text-xs sm:text-sm bg-canvas-soft border border-hairline rounded-sm px-3.5 py-2.5 text-ink focus:outline-none focus:border-white/50 mb-5 font-normal"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn-outline-sm"
                >
                  <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={!newTopicName.trim()}
                  className="btn-primary"
                >
                  <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Initialize Topic</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
