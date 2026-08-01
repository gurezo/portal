#!/usr/bin/env bash
# Download the latest web-serial-rxjs-static artifact from gurezo/web-serial-rxjs
# and place it under firebase-public/web-serial-rxjs/.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="${WEB_SERIAL_RXJS_REPO:-gurezo/web-serial-rxjs}"
ARTIFACT_NAME="${WEB_SERIAL_RXJS_ARTIFACT_NAME:-web-serial-rxjs-static}"
WORKFLOW="${WEB_SERIAL_RXJS_WORKFLOW:-portal-static-artifact.yml}"
FIREBASE_PUBLIC="${ROOT_DIR}/firebase-public"
DOWNLOAD_DIR="${ROOT_DIR}/tmp/web-serial-rxjs-static-download"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh (GitHub CLI) is required to download the artifact" >&2
  exit 1
fi

if [[ -z "${GH_TOKEN:-${GITHUB_TOKEN:-}}" ]]; then
  # Local interactive auth via gh is fine; CI must set GH_TOKEN / GITHUB_TOKEN.
  if ! gh auth status >/dev/null 2>&1; then
    echo "error: authenticate with gh, or set GH_TOKEN / GITHUB_TOKEN" >&2
    exit 1
  fi
fi

mkdir -p "${FIREBASE_PUBLIC}"
rm -rf "${DOWNLOAD_DIR}"
mkdir -p "${DOWNLOAD_DIR}"

echo "Resolving latest successful ${WORKFLOW} run in ${REPO}..."
RUN_ID="$(
  gh run list \
    --repo "${REPO}" \
    --workflow "${WORKFLOW}" \
    --status success \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId'
)"

if [[ -z "${RUN_ID}" || "${RUN_ID}" == "null" ]]; then
  echo "error: no successful ${WORKFLOW} run found in ${REPO}" >&2
  exit 1
fi

echo "Downloading ${ARTIFACT_NAME} from run ${RUN_ID}..."
gh run download "${RUN_ID}" \
  --repo "${REPO}" \
  --name "${ARTIFACT_NAME}" \
  --dir "${DOWNLOAD_DIR}"

SOURCE_DIR=""
if [[ -d "${DOWNLOAD_DIR}/web-serial-rxjs" ]]; then
  SOURCE_DIR="${DOWNLOAD_DIR}/web-serial-rxjs"
elif [[ -d "${DOWNLOAD_DIR}/${ARTIFACT_NAME}/web-serial-rxjs" ]]; then
  SOURCE_DIR="${DOWNLOAD_DIR}/${ARTIFACT_NAME}/web-serial-rxjs"
else
  echo "error: expected web-serial-rxjs/ under downloaded artifact" >&2
  find "${DOWNLOAD_DIR}" -maxdepth 3 -type d >&2 || true
  exit 1
fi

if [[ ! -f "${SOURCE_DIR}/index.html" ]]; then
  echo "error: ${SOURCE_DIR}/index.html is missing" >&2
  exit 1
fi

TARGET_DIR="${FIREBASE_PUBLIC}/web-serial-rxjs"
rm -rf "${TARGET_DIR}"
mkdir -p "$(dirname "${TARGET_DIR}")"
cp -a "${SOURCE_DIR}" "${TARGET_DIR}"

rm -rf "${DOWNLOAD_DIR}"

echo "Imported ${ARTIFACT_NAME} -> ${TARGET_DIR}"
