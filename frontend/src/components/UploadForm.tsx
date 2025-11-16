import React, { useState } from 'react';
import { modelsApi } from '../services/api';
import type { ModelFormData } from '../types/model';

interface UploadFormProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

/**
 * UploadForm - モデルアップロードフォーム
 */
const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    point_count: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['ply', 'sog', 'splat'].includes(extension || '')) {
      setError('対応していないファイル形式です。.ply、.sog、.splatファイルのみアップロード可能です。');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);

    // ファイル名からタイトルを自動設定（未入力の場合）
    if (!formData.title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('ファイルを選択してください。');
      return;
    }

    if (!formData.title.trim()) {
      setError('タイトルを入力してください。');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadData: ModelFormData = {
        title: formData.title,
        description: formData.description || undefined,
        file: file,
        point_count: formData.point_count ? parseInt(formData.point_count) : undefined,
      };

      await modelsApi.create(uploadData);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('アップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>3DGSモデルのアップロード</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="file" className="form-label">
              ファイル <span className="required">*</span>
            </label>
            <input
              type="file"
              id="file"
              className="form-input"
              accept=".ply,.sog,.splat"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <small className="form-help">
              対応形式: .ply、.sog、.splat（最大500MB）
            </small>
            {file && (
              <div className="file-info">
                ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              タイトル <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="モデルのタイトルを入力"
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              説明
            </label>
            <textarea
              id="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="モデルの説明（任意）"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="point_count" className="form-label">
              ポイント数
            </label>
            <input
              type="number"
              id="point_count"
              className="form-input"
              value={formData.point_count}
              onChange={(e) => setFormData(prev => ({ ...prev, point_count: e.target.value }))}
              placeholder="Gaussianポイント数（任意）"
              disabled={isUploading}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading || !file}
            >
              {isUploading ? 'アップロード中...' : 'アップロード'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
