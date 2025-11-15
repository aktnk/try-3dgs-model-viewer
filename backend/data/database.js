import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SQLiteデータベース接続（詳細ログモード）
const db = new sqlite3.verbose().Database(
  join(__dirname, '3dgs_models.sqlite'),
  (err) => {
    if (err) {
      console.error('Database connection error:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  }
);

// テーブルスキーマの初期化
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS gsplat_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT CHECK(file_type IN ('ply', 'sog', 'splat')) NOT NULL,
      file_size INTEGER,
      thumbnail_path TEXT,
      point_count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT NULL,
      is_deleted INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Table creation error:', err.message);
    } else {
      console.log('Table "gsplat_models" ready.');
    }
  });
});

export default db;
