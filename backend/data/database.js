import pkg from 'sqlite3';
const { verbose } = pkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースファイルのパス（Docker対応）
// uploadsディレクトリに配置することで、ボリュームマウントされた領域に保存され、
// 権限問題を回避し、データの永続化も実現
const uploadsDir = process.env.UPLOADS_DIR || join(__dirname, '../../uploads');
const dbPath = join(uploadsDir, '3dgs_models.sqlite');

// SQLiteデータベース接続（詳細ログモード）
const sqlite3Verbose = verbose();
const db = new sqlite3Verbose.Database(
  dbPath,
  (err) => {
    if (err) {
      console.error('Database connection error:', err.message);
    } else {
      console.log(`Connected to SQLite database at ${dbPath}`);
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
