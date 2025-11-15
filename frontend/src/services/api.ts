import axios from 'axios';
import type { GaussianSplatModel, ModelFormData, ModelUpdateData } from '../types/model';

const API_BASE_URL = '/api';

/**
 * APIクライアント
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * モデルAPI
 */
export const modelsApi = {
  /**
   * 全モデルを取得
   */
  async getAll(searchTerm?: string): Promise<GaussianSplatModel[]> {
    const params = searchTerm ? { search: searchTerm } : {};
    const response = await apiClient.get<GaussianSplatModel[]>('/models', { params });
    return response.data;
  },

  /**
   * 特定のモデルを取得
   */
  async getById(id: number): Promise<GaussianSplatModel> {
    const response = await apiClient.get<GaussianSplatModel>(`/models/${id}`);
    return response.data;
  },

  /**
   * 新規モデルをアップロード
   */
  async create(formData: ModelFormData): Promise<GaussianSplatModel> {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('file', formData.file);

    if (formData.description) {
      data.append('description', formData.description);
    }

    if (formData.point_count) {
      data.append('point_count', formData.point_count.toString());
    }

    const response = await apiClient.post<GaussianSplatModel>('/models', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * モデル情報を更新
   */
  async update(id: number, updateData: ModelUpdateData): Promise<GaussianSplatModel> {
    const response = await apiClient.put<GaussianSplatModel>(`/models/${id}`, updateData);
    return response.data;
  },

  /**
   * サムネイルを更新
   */
  async updateThumbnail(id: number, thumbnail: File): Promise<GaussianSplatModel> {
    const data = new FormData();
    data.append('thumbnail', thumbnail);

    const response = await apiClient.post<GaussianSplatModel>(
      `/models/${id}/thumbnail`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * モデルを削除
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/models/${id}`);
  },
};

export default apiClient;
