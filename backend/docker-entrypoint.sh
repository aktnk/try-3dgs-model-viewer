#!/bin/sh
set -e

# uploadsディレクトリ構造を作成
echo "Setting up uploads directory structure..."
mkdir -p /uploads/models
mkdir -p /uploads/thumbnails

# 権限設定（nodeユーザーが書き込めるようにする）
echo "Setting permissions..."
chown -R node:node /uploads
chmod -R 755 /uploads

echo "Upload directories ready!"
echo "  - /uploads/models"
echo "  - /uploads/thumbnails"

# 本来のコマンドを実行
exec "$@"
