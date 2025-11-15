# try-3dgs-model-viewer

3D Gaussian Splatting (3DGS) モデルのWebベースビューアアプリケーション

## 概要

このプロジェクトは、3D Gaussian Splatting技術を使用した3Dモデルを表示・管理するためのフルスタックWebアプリケーションです。PlayCanvasエンジンとReactを組み合わせて、高品質なリアルタイムレンダリングと直感的なユーザーインターフェースを提供します。

## 主要機能

### モデル管理
- ✅ 3DGSファイル（.ply、.sog、.splat）のアップロード
- ✅ モデル一覧表示（レスポンシブカードグリッド）
- ✅ タイトル・説明による検索
- ✅ モデル情報の編集・削除
- ✅ メタデータ管理（ファイルサイズ、ポイント数、作成日時など）

### 3Dビューア
- ✅ PlayCanvasによる高品質レンダリング
- ✅ OrbitCameraによる直感的な操作
  - マウス: 左クリックで回転、Shift+左クリックでパン、ホイールでズーム
  - タッチ: 1本指で回転、2本指ピンチでズーム
- ✅ リアルタイムレンダリング
- ✅ クロスプラットフォーム対応

## 技術スタック

### フロントエンド
- **React** 19.2.0 - UIフレームワーク
- **TypeScript** 5.9.3 - 型安全な開発
- **PlayCanvas Engine** 2.13.1+ - 3Dレンダリング
- **Vite** 7.2.2 - 高速ビルドツール
- **Axios** - HTTP通信

### バックエンド
- **Node.js** 18+ - サーバーランタイム
- **Express.js** 5.1.0 - Webフレームワーク
- **SQLite3** 5.1.7 - データベース
- **Multer** 2.0.2 - ファイルアップロード

### インフラ
- **Docker** & **Docker Compose** - コンテナ化
- **Nginx** - リバースプロキシ

## プロジェクト構造

```
try-3dgs-model-viewer/
├── backend/                    # バックエンド
│   ├── data/                   # データ層
│   │   ├── database.js        # SQLite接続
│   │   └── models.repository.js # リポジトリ層
│   ├── routes/                 # APIルート
│   │   └── models.js          # モデルCRUD API
│   ├── server.js              # サーバーエントリーポイント
│   ├── package.json           # 依存関係
│   └── Dockerfile             # Dockerイメージ定義
│
├── frontend/                   # フロントエンド
│   ├── src/
│   │   ├── components/        # Reactコンポーネント
│   │   │   ├── GaussianSplatViewer.tsx
│   │   │   ├── ModelList.tsx
│   │   │   ├── ModelCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── UploadForm.tsx
│   │   ├── utils/
│   │   │   └── OrbitCamera.ts # カメラコントローラー
│   │   ├── services/
│   │   │   └── api.ts         # APIクライアント
│   │   ├── types/
│   │   │   └── model.ts       # 型定義
│   │   ├── App.tsx            # アプリケーションルート
│   │   └── main.tsx           # エントリーポイント
│   ├── package.json           # 依存関係
│   ├── tsconfig.json          # TypeScript設定
│   ├── vite.config.ts         # Vite設定
│   └── Dockerfile             # Dockerイメージ定義
│
├── nginx/
│   └── nginx.conf             # Nginx設定
│
├── uploads/                    # アップロードファイル
│   ├── models/                # 3DGSモデル
│   └── thumbnails/            # サムネイル
│
├── docker-compose.yml         # Docker Compose設定
├── CLAUDE.md                  # AI assistant guide
└── README.md                  # このファイル
```

## セットアップ

### 前提条件
- **Node.js** 18以上
- **Docker** & **Docker Compose**（Docker使用の場合）
- **npm** または **yarn**

### 方法1: Dockerを使用（推奨）

```bash
# リポジトリのクローン
git clone <repository-url>
cd try-3dgs-model-viewer

# Docker Composeで起動
docker compose up -d --build

# アクセス
# http://localhost:8080
```

### 方法2: ローカル環境で実行

#### 初期セットアップ

```bash
# uploadsディレクトリを作成
mkdir -p uploads/models uploads/thumbnails
chmod -R 755 uploads

# dataディレクトリに書き込み権限を付与
chmod 755 backend/data
```

#### バックエンド

```bash
cd backend
npm install
npm start
# サーバーが http://localhost:3000 で起動
```

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
# 開発サーバーが http://localhost:5173 で起動
```

## 使用方法

### モデルのアップロード

1. メイン画面の「➕ モデルをアップロード」ボタンをクリック
2. アップロードフォームで以下を入力:
   - ファイル（.ply、.sog、.splat）
   - タイトル（必須）
   - 説明（任意）
   - ポイント数（任意）
3. 「アップロード」ボタンをクリック

### モデルの表示

1. モデル一覧からカードの「表示」ボタンをクリック
2. 3Dビューアが開き、モデルが表示されます
3. マウスやタッチで操作:
   - **回転**: 左クリック＆ドラッグ / 1本指ドラッグ
   - **パン**: Shift＋左クリック＆ドラッグ
   - **ズーム**: マウスホイール / 2本指ピンチ

### モデルの検索

1. 検索バーにキーワードを入力
2. 「🔍 検索」ボタンをクリック
3. タイトルまたは説明に一致するモデルが表示されます

### モデルの削除

1. モデルカードの「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック

## API仕様

### エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/models` | 全モデル取得（検索対応） |
| GET | `/api/models/:id` | 特定モデル取得 |
| POST | `/api/models` | 新規モデルアップロード |
| PUT | `/api/models/:id` | モデル情報更新 |
| POST | `/api/models/:id/thumbnail` | サムネイル更新 |
| DELETE | `/api/models/:id` | モデル削除（論理削除） |

詳細は `backend/routes/models.js` を参照してください。

## 開発

### バックエンド開発

```bash
cd backend
npm run dev  # --watchモードで起動（ファイル変更時に自動再起動）
```

### フロントエンド開発

```bash
cd frontend
npm run dev  # Vite開発サーバー起動（ホットリロード有効）
```

### 型チェック

```bash
cd frontend
npm run lint  # TypeScriptの型チェック
```

### ビルド

```bash
# フロントエンド
cd frontend
npm run build  # dist/にビルド成果物を生成

# プレビュー
npm run preview  # ビルド結果をプレビュー
```

## トラブルシューティング

### モデルが表示されない

- ファイル形式を確認（.ply、.sog、.splatのみ対応）
- ブラウザのコンソールでエラーを確認
- バックエンドが正常に起動しているか確認

### アップロードに失敗する

- ファイルサイズを確認（最大100MB）
- ネットワーク接続を確認
- バックエンドのログを確認

### Dockerコンテナが起動しない

```bash
# ログを確認
docker compose logs -f

# コンテナを再起動
docker compose restart

# 完全に再ビルド
docker compose down
docker compose up -d --build
```

## 参考リポジトリ

- [try-supersplat-app-by-playcanvas-react](https://github.com/aktnk/try-supersplat-app-by-playcanvas-react.git) - 3DGS表示実装の参考
- [3D_model_manager](https://github.com/aktnk/3D_model_manager.git) - モデル管理アーキテクチャの参考

## ライセンス

MIT

## 貢献

Pull Requestを歓迎します！

## 連絡先

質問や提案がある場合は、Issueを作成してください。
