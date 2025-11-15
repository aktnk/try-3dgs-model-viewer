# ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# アプリケーションファイルのコピー
COPY . .

# ビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# Nginxデフォルト設定を削除
RUN rm /etc/nginx/conf.d/default.conf

# ビルドされたファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート公開
EXPOSE 80

# Nginx起動
CMD ["nginx", "-g", "daemon off;"]
