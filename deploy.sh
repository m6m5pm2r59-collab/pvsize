#!/bin/bash
# PVSize 一键部署脚本
set -e

echo "📦 检查文件变更..."
git add -A
if git diff --cached --quiet; then
  echo "✅ 无变更，跳过 git commit"
else
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
  echo "✅ 已提交"
fi

echo "🚀 部署到 Vercel..."
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/xiaotudou/Documents/Obsidian\ Vault/Marvis/pvsize-full/src
vercel --prod

echo ""
echo "✅ 部署完成 - https://pvsize.com"
