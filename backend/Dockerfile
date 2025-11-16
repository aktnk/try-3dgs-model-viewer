FROM node:18-slim

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install --production

# アプリケーションファイルのコピー
COPY . .

# uploadsディレクトリをビルド時に作成
RUN mkdir -p /uploads/models /uploads/thumbnails && \
    chmod -R 777 /uploads

# ポート公開
EXPOSE 3000

# サーバー起動
CMD ["node", "server.js"]
