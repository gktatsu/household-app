#!/bin/bash

# 環境変数を読み込む（コメント行を除外）
export $(grep -v '^#' .env.production | xargs)

# ビルドとデプロイ
npm run build
serverless deploy --stage prod

echo ""
echo "✅ デプロイ完了！"
echo "API URL: https://lelahgl6d5.execute-api.ap-northeast-1.amazonaws.com/prod/"
