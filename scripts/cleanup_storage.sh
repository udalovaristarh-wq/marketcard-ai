#!/usr/bin/env bash
set -e

PROJECT=/root/marketcard-ai
TEMP_DIR="$PROJECT/backend/temp"
CARDS_DIR="$PROJECT/backend/generated_cards"

echo "== cleanup start $(date) =="

# 1) backend/temp — чистим полностью
find "$TEMP_DIR" -mindepth 1 -type f -delete 2>/dev/null || true
find "$TEMP_DIR" -mindepth 1 -type d -empty -delete 2>/dev/null || true

# 2) generated_cards — удаляем только старые файлы старше 3 суток
find "$CARDS_DIR" -type f -mtime +3 -delete 2>/dev/null || true
find "$CARDS_DIR" -type d -empty -delete 2>/dev/null || true

# 3) apt cache
apt-get clean >/dev/null 2>&1 || true

# 4) системные логи — оставляем только 7 дней
journalctl --vacuum-time=7d >/dev/null 2>&1 || true

echo "== cleanup done $(date) =="
