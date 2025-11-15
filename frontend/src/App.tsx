import React, { useState } from 'react';
import ModelList from './components/ModelList';
import GaussianSplatViewer from './components/GaussianSplatViewer';
import type { GaussianSplatModel } from './types/model';
import './App.css';

/**
 * App - メインアプリケーションコンポーネント
 */
function App() {
  const [selectedModel, setSelectedModel] = useState<GaussianSplatModel | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'viewer'>('list');

  const handleSelectModel = (model: GaussianSplatModel) => {
    setSelectedModel(model);
    setViewMode('viewer');
  };

  const handleBackToList = () => {
    setSelectedModel(null);
    setViewMode('list');
  };

  return (
    <div className="app">
      {viewMode === 'list' ? (
        <ModelList onSelectModel={handleSelectModel} />
      ) : (
        <div className="viewer-container">
          <div className="viewer-header">
            <button className="btn btn-back" onClick={handleBackToList}>
              ← 一覧に戻る
            </button>
            <div className="viewer-info">
              <h2>{selectedModel?.title}</h2>
              {selectedModel?.description && (
                <p className="viewer-description">{selectedModel.description}</p>
              )}
            </div>
          </div>
          <div className="viewer-canvas">
            {selectedModel && (
              <GaussianSplatViewer
                modelUrl={selectedModel.file_path}
                onLoadError={(error) => {
                  console.error('Model load error:', error);
                  alert('モデルの読み込みに失敗しました。');
                }}
                onLoadSuccess={() => {
                  console.log('Model loaded successfully');
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
