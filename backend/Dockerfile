FROM node:18-alpine

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install --production

# アプリケーションファイルのコピー
COPY . .

# ポート公開
EXPOSE 3000

# サーバー起動
CMD ["node", "server.js"]
