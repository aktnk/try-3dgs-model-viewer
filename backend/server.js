import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import modelsRouter from './routes/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイル配信（アップロードされたファイル）
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// APIルート
app.use('/api/models', modelsRouter);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({
    message: '3D Gaussian Splatting Model Viewer API',
    version: '1.0.0',
    endpoints: {
      models: '/api/models',
      health: '/health'
    }
  });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/models`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
