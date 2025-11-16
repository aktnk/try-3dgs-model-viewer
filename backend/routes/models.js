import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import modelsRepository from '../data/models.repository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// アップロードディレクトリのパス（Docker対応）
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads');

// Multer設定 - 3DGSモデルファイル用
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsDir, 'models'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer設定 - サムネイル用
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsDir, 'thumbnails'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ファイルフィルター - 3DGSファイル形式のみ許可
const modelFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.ply', '.sog', '.splat'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .ply, .sog, and .splat files are allowed.'));
  }
};

// ファイルフィルター - 画像ファイルのみ許可
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'));
  }
};

const uploadModel = multer({
  storage: modelStorage,
  fileFilter: modelFileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB制限（3DGSモデルは大きい）
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB制限
});

/**
 * GET /api/models
 * 全モデルを取得（検索対応）
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const models = await modelsRepository.findAll(search);
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

/**
 * GET /api/models/:id
 * 特定のモデルを取得
 */
router.get('/:id', async (req, res) => {
  try {
    const model = await modelsRepository.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

/**
 * POST /api/models
 * 新規モデルをアップロード
 */
router.post('/', (req, res, next) => {
  uploadModel.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'ファイルサイズが大きすぎます。最大500MBまでアップロード可能です。'
        });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, point_count } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const fileType = path.extname(req.file.originalname).slice(1).toLowerCase();
    const filePath = `/uploads/models/${req.file.filename}`;

    const modelData = {
      title,
      description: description || null,
      original_name: req.file.originalname,
      file_path: filePath,
      file_type: fileType,
      file_size: req.file.size,
      thumbnail_path: null,
      point_count: point_count ? parseInt(point_count) : null
    };

    const id = await modelsRepository.create(modelData);
    const newModel = await modelsRepository.findById(id);

    res.status(201).json(newModel);
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ error: 'Failed to create model' });
  }
});

/**
 * PUT /api/models/:id
 * モデル情報を更新
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, description, point_count } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (point_count !== undefined) updates.point_count = parseInt(point_count);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const success = await modelsRepository.update(req.params.id, updates);

    if (!success) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const updatedModel = await modelsRepository.findById(req.params.id);
    res.json(updatedModel);
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: 'Failed to update model' });
  }
});

/**
 * POST /api/models/:id/thumbnail
 * サムネイルを更新
 */
router.post('/:id/thumbnail', uploadThumbnail.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No thumbnail uploaded' });
    }

    const thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;
    const success = await modelsRepository.update(req.params.id, { thumbnail_path: thumbnailPath });

    if (!success) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const updatedModel = await modelsRepository.findById(req.params.id);
    res.json(updatedModel);
  } catch (error) {
    console.error('Error updating thumbnail:', error);
    res.status(500).json({ error: 'Failed to update thumbnail' });
  }
});

/**
 * DELETE /api/models/:id
 * モデルを削除（論理削除）
 */
router.delete('/:id', async (req, res) => {
  try {
    const success = await modelsRepository.softDelete(req.params.id);

    if (!success) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

export default router;
