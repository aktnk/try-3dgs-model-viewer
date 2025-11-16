#!/bin/bash

# 3D Gaussian Splatting Model Viewer - 初回セットアップスクリプト

echo "========================================="
echo "  3DGS Model Viewer - Setup Script"
echo "========================================="
echo ""

# カレントディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Creating uploads directory structure..."

# uploadsディレクトリ構造を作成
mkdir -p uploads/models
mkdir -p uploads/thumbnails

echo "✅ Created: uploads/models"
echo "✅ Created: uploads/thumbnails"
echo ""

# .gitkeepファイルを作成（空ディレクトリをGitで管理するため）
touch uploads/models/.gitkeep
touch uploads/thumbnails/.gitkeep

echo "✅ Added .gitkeep files to maintain directory structure in Git"
echo ""

echo "========================================="
echo "  Setup Complete! 🎉"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Run: docker-compose up --build"
echo "  2. Access the application at http://localhost:8080"
echo ""
echo "Note: The backend container will automatically set proper permissions"
echo "      for the uploads directory on startup."
echo ""
