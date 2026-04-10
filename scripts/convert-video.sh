#!/usr/bin/env bash
# Converts the source .m2ts clip into a web-ready hero.mp4.
#
# Output: public/video/hero.mp4
# Target: 720p height, H.264 high profile, CRF 28, fast start, silent audio-less.
#
# Usage: bash scripts/convert-video.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE="${ROOT_DIR}/../20251019080704.m2ts"
OUT_DIR="${ROOT_DIR}/public/video"
OUT="${OUT_DIR}/hero.mp4"

mkdir -p "${OUT_DIR}"

if [[ ! -f "${SOURCE}" ]]; then
  echo "Source video not found at ${SOURCE}" >&2
  exit 1
fi

ffmpeg -y -i "${SOURCE}" \
  -an \
  -vf "scale=-2:720" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -preset slow -crf 28 \
  -movflags +faststart \
  "${OUT}"

echo "Converted -> ${OUT}"
