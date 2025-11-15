/**
 * 3DGSモデルの型定義
 */
export interface GaussianSplatModel {
  id: number;
  title: string;
  description: string | null;
  original_name: string;
  file_path: string;
  file_type: 'ply' | 'sog' | 'splat';
  file_size: number;
  thumbnail_path: string | null;
  point_count: number | null;
  created_at: string;
  updated_at: string | null;
  is_deleted: number;
}

/**
 * モデル作成用のフォームデータ
 */
export interface ModelFormData {
  title: string;
  description?: string;
  file: File;
  point_count?: number;
}

/**
 * モデル更新用のデータ
 */
export interface ModelUpdateData {
  title?: string;
  description?: string;
  point_count?: number;
}
