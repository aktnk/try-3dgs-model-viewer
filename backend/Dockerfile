FROM node:18-alpine

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install --production

# アプリケーションファイルのコピー
COPY . .

# エントリーポイントスクリプトをコピーして実行権限を付与
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ポート公開
EXPOSE 3000

# エントリーポイントとコマンドを設定
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
