import db from './database.js';

/**
 * 3DGSモデルのデータアクセス層（リポジトリパターン）
 */
class ModelsRepository {
  /**
   * 全モデルを取得（削除されていないもののみ）
   * @param {string} searchTerm - 検索キーワード（タイトルまたは説明）
   * @returns {Promise<Array>} モデルの配列
   */
  findAll(searchTerm = '') {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM gsplat_models WHERE is_deleted = 0';
      const params = [];

      if (searchTerm) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * IDでモデルを取得
   * @param {number} id - モデルID
   * @returns {Promise<Object|null>} モデルオブジェクト
   */
  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM gsplat_models WHERE id = ? AND is_deleted = 0',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }

  /**
   * 新規モデルを作成
   * @param {Object} modelData - モデルデータ
   * @returns {Promise<number>} 挿入されたモデルのID
   */
  create(modelData) {
    return new Promise((resolve, reject) => {
      const {
        title,
        description,
        original_name,
        file_path,
        file_type,
        file_size,
        thumbnail_path,
        point_count
      } = modelData;

      db.run(
        `INSERT INTO gsplat_models
        (title, description, original_name, file_path, file_type, file_size, thumbnail_path, point_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, original_name, file_path, file_type, file_size, thumbnail_path, point_count],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * モデル情報を更新
   * @param {number} id - モデルID
   * @param {Object} updates - 更新するフィールド
   * @returns {Promise<boolean>} 更新成功したか
   */
  update(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      });

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      db.run(
        `UPDATE gsplat_models SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  /**
   * モデルを論理削除
   * @param {number} id - モデルID
   * @returns {Promise<boolean>} 削除成功したか
   */
  softDelete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE gsplat_models SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }
}

export default new ModelsRepository();
