#!/bin/sh
set -e

# uploadsディレクトリ構造を作成
echo "Setting up uploads directory structure..."
mkdir -p /uploads/models
mkdir -p /uploads/thumbnails

# 権限設定（すべてのユーザーが読み書きできるようにする）
echo "Setting permissions..."
chmod -R 777 /uploads

echo "Upload directories ready!"
echo "  - /uploads/models"
echo "  - /uploads/thumbnails"

# 本来のコマンドを実行
exec "$@"
