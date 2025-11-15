import React from 'react';
import type { GaussianSplatModel } from '../types/model';

interface ModelCardProps {
  model: GaussianSplatModel;
  onView: (model: GaussianSplatModel) => void;
  onDelete: (id: number) => void;
}

/**
 * ModelCard - 個別のモデルカード
 */
const ModelCard: React.FC<ModelCardProps> = ({ model, onView, onDelete }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="model-card">
      <div className="model-card-thumbnail">
        {model.thumbnail_path ? (
          <img src={model.thumbnail_path} alt={model.title} />
        ) : (
          <div className="model-card-no-thumbnail">
            <span>📦</span>
            <span className="file-type">.{model.file_type}</span>
          </div>
        )}
      </div>

      <div className="model-card-content">
        <h3 className="model-card-title">{model.title}</h3>

        {model.description && (
          <p className="model-card-description">{model.description}</p>
        )}

        <div className="model-card-meta">
          <div className="meta-item">
            <span className="meta-label">ファイル形式:</span>
            <span className="meta-value">.{model.file_type.toUpperCase()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ファイルサイズ:</span>
            <span className="meta-value">{formatFileSize(model.file_size)}</span>
          </div>
          {model.point_count && (
            <div className="meta-item">
              <span className="meta-label">ポイント数:</span>
              <span className="meta-value">{model.point_count.toLocaleString()}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">作成日時:</span>
            <span className="meta-value">{formatDate(model.created_at)}</span>
          </div>
        </div>

        <div className="model-card-actions">
          <button
            className="btn btn-primary"
            onClick={() => onView(model)}
          >
            表示
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm(`「${model.title}」を削除しますか？`)) {
                onDelete(model.id);
              }
            }}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
