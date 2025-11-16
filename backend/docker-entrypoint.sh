#!/bin/sh
set -e

# uploadsディレクトリ構造を作成
echo "Setting up uploads directory structure..."
mkdir -p /uploads/models
mkdir -p /uploads/thumbnails

echo "Upload directories ready!"
echo "  - /uploads/models"
echo "  - /uploads/thumbnails"

# 本来のコマンドを実行
exec "$@"
