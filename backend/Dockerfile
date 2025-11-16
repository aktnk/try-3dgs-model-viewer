FROM node:18-alpine

# sqlite3のビルドに必要なパッケージをインストール
RUN apk add --no-cache python3 make g++

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
