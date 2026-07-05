#!/bin/bash
# PVSize 一键部署脚本
set -e

echo "[1/3] 检查文件变更..."
git add -A
if git diff --cached --quiet; then
  echo "无变更，跳过 git commit"
else
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
  echo "已提交"
fi

echo "[2/3] 推送到 GitHub..."
if git remote get-url origin > /dev/null 2>&1; then
  git push origin main
  echo "已推送"
else
  echo "无 remote，跳过推送"
fi

echo "[3/3] 部署到 Vercel..."
export PATH="/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/src"
vercel --prod

echo ""
echo "部署完成 - https://pvsize.com"
