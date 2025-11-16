#!/bin/bash

# デバッグスクリプト - Docker環境の状態を確認

echo "========================================="
echo "  3DGS Model Viewer - Debug Script"
echo "========================================="
echo ""

echo "1. Docker コンテナの状態を確認"
echo "-----------------------------------"
docker compose ps
echo ""

echo "2. バックエンドコンテナ内部でAPIテスト"
echo "-----------------------------------"
echo "Testing: GET /health"
docker compose exec backend wget -q -O- http://localhost:3000/health 2>/dev/null || \
docker compose exec backend curl -s http://localhost:3000/health || \
echo "❌ バックエンドAPIに接続できません"
echo ""

echo "Testing: GET /api/models"
docker compose exec backend wget -q -O- http://localhost:3000/api/models 2>/dev/null || \
docker compose exec backend curl -s http://localhost:3000/api/models || \
echo "❌ モデルAPI(/api/models)に接続できません"
echo ""

echo "3. uploadsディレクトリの確認"
echo "-----------------------------------"
echo "コンテナ内の/uploadsディレクトリ:"
docker compose exec backend ls -la /uploads/
echo ""
echo "コンテナ内の/uploads/models:"
docker compose exec backend ls -la /uploads/models/ 2>/dev/null || echo "ディレクトリが存在しません"
echo ""

echo "4. データベースファイルの確認"
echo "-----------------------------------"
docker compose exec backend ls -la /uploads/*.sqlite 2>/dev/null || echo "❌ データベースファイルが見つかりません"
echo ""

echo "5. 最近のバックエンドログ（最新20行）"
echo "-----------------------------------"
docker compose logs --tail=20 backend
echo ""

echo "6. Nginxのエラーログ（最新10行）"
echo "-----------------------------------"
docker compose logs --tail=10 nginx | grep -i error || echo "エラーなし"
echo ""

echo "========================================="
echo "  デバッグ完了"
echo "========================================="
echo ""
echo "上記の情報を確認してください。"
echo "特に注目すべき点："
echo "  - バックエンドAPIが正常に応答しているか"
echo "  - uploadsディレクトリが存在し、権限が正しいか"
echo "  - データベースファイルが作成されているか"
echo ""
