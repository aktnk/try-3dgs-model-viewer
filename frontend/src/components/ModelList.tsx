import React, { useEffect, useState } from 'react';
import { modelsApi } from '../services/api';
import type { GaussianSplatModel } from '../types/model';
import ModelCard from './ModelCard';
import SearchBar from './SearchBar';
import UploadForm from './UploadForm';

interface ModelListProps {
  onSelectModel: (model: GaussianSplatModel) => void;
}

/**
 * ModelList - モデル一覧ページ
 */
const ModelList: React.FC<ModelListProps> = ({ onSelectModel }) => {
  const [models, setModels] = useState<GaussianSplatModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const loadModels = async (search?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await modelsApi.getAll(search);
      setModels(data);
    } catch (err) {
      console.error('Error loading models:', err);
      setError('モデルの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    loadModels(search);
  };

  const handleDelete = async (id: number) => {
    try {
      await modelsApi.delete(id);
      loadModels(searchTerm);
    } catch (err) {
      console.error('Error deleting model:', err);
      alert('モデルの削除に失敗しました。');
    }
  };

  const handleUploadSuccess = () => {
    loadModels(searchTerm);
  };

  return (
    <div className="model-list-container">
      <div className="model-list-header">
        <h1>3D Gaussian Splatting モデルビューア</h1>
        <div className="header-actions">
          <SearchBar onSearch={handleSearch} />
          <button
            className="btn btn-upload"
            onClick={() => setShowUploadForm(true)}
          >
            ➕ モデルをアップロード
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-message">
          読み込み中...
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {!isLoading && !error && models.length === 0 && (
        <div className="empty-message">
          {searchTerm ? (
            <p>「{searchTerm}」に一致するモデルが見つかりませんでした。</p>
          ) : (
            <div>
              <p>モデルがまだありません。</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowUploadForm(true)}
              >
                最初のモデルをアップロード
              </button>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && models.length > 0 && (
        <div>
          <div className="results-count">
            {searchTerm ? `${models.length}件のモデルが見つかりました` : `全${models.length}件のモデル`}
          </div>
          <div className="model-grid">
            {models.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                onView={onSelectModel}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {showUploadForm && (
        <UploadForm
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
};

export default ModelList;
