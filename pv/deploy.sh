#!/bin/bash
# PVSize 发布脚本
# 默认流程：提交并推送到 GitHub，由 Vercel 自动部署。
# 应急流程：仅在明确传入 --emergency 时允许本地直推 Vercel。
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
PV_SCOPE="pv"

EMERGENCY_MODE=0
if [ "${1:-}" = "--emergency" ]; then
  EMERGENCY_MODE=1
fi

collect_non_pv_changes() {
  git -C "$REPO_ROOT" status --porcelain=v1 --untracked-files=all | while IFS= read -r line; do
    entry="${line:3}"
    entry="${entry#\"}"
    entry="${entry%\"}"

    if [[ "$entry" == *" -> "* ]]; then
      from_path="${entry%% -> *}"
      to_path="${entry#* -> }"

      if [[ "$from_path" != "$PV_SCOPE/"* || "$to_path" != "$PV_SCOPE/"* ]]; then
        echo "$entry"
      fi
      continue
    fi

    if [[ "$entry" != "$PV_SCOPE/"* ]]; then
      echo "$entry"
    fi
  done
}

cd "$REPO_ROOT"

echo "[1/3] 检查文件变更..."
NON_PV_CHANGES="$(collect_non_pv_changes)"
if [ -n "$NON_PV_CHANGES" ]; then
  echo "检测到非 PV 工作区改动，已阻止本次发布提交："
  echo "$NON_PV_CHANGES"
  echo "仅允许提交 ${PV_SCOPE}/ 下的改动，请先清理或单独处理其他项目变更。"
  exit 1
fi

git add -A -- "$PV_SCOPE"
if git diff --cached --quiet -- "$PV_SCOPE"; then
  echo "无变更，跳过 git commit"
else
  git commit -m "chore: sync PVSize changes $(date '+%Y-%m-%d %H:%M')"
  echo "已提交"
fi

echo "[2/3] 推送到 GitHub..."
if git remote get-url origin > /dev/null 2>&1; then
  git push origin main
  echo "已推送"
else
  echo "无 remote，跳过推送"
fi

if [ "$EMERGENCY_MODE" -eq 1 ]; then
  echo "[3/3] 应急模式：本地直推 Vercel..."
  export PATH="/opt/homebrew/bin:$PATH"
  cd "$(dirname "$0")"
  vercel --prod --yes --archive=tgz
  echo ""
  echo "应急发布完成 - https://pvsize.com"
  echo "注意：请在 24 小时内确认同批改动已回写 GitHub，避免线上与仓库分叉。"
else
  echo "[3/3] 正常模式：等待 GitHub -> Vercel 自动部署。"
  echo "发布入口：main 分支推送"
  echo "生产地址：https://pvsize.com"
fi
