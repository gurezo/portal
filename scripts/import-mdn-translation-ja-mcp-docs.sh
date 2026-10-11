#!/usr/bin/env bash
# Checkout a pinned mdn-translation-ja-mcp commit, build its TypeDoc site,
# and copy docs/ to firebase-public/mdn-translation-ja-mcp/.
# Run only after build:firebase:site. That script deletes firebase-public.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHA_FILE="${ROOT_DIR}/scripts/mdn-translation-ja-mcp.sha"
REPO_URL="${MDN_TRANSLATION_JA_MCP_REPO_URL:-https://github.com/gurezo/mdn-translation-ja-mcp.git}"
FIREBASE_PUBLIC="${ROOT_DIR}/firebase-public"
WORK_DIR="${ROOT_DIR}/tmp/mdn-translation-ja-mcp"
TARGET_DIR="${FIREBASE_PUBLIC}/mdn-translation-ja-mcp"

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is required" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is required" >&2
  exit 1
fi

if [[ ! -f "${FIREBASE_PUBLIC}/index.html" ]]; then
  echo "error: ${FIREBASE_PUBLIC}/index.html is missing. Run pnpm run build:firebase:site first." >&2
  exit 1
fi

if [[ ! -f "${SHA_FILE}" ]]; then
  echo "error: ${SHA_FILE} is missing" >&2
  exit 1
fi

SHA="$(tr -d '[:space:]' < "${SHA_FILE}")"
if [[ ! "${SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "error: ${SHA_FILE} must contain a 40-character commit SHA" >&2
  exit 1
fi

reject_sensitive_files() {
  local dir="$1"
  local hits
  hits="$(
    find "${dir}" \
      \( -type d -name node_modules -print -prune \) -o \
      \( -type f \( \
        -name '.env' -o \
        -name '.env.*' -o \
        -name '*.pem' -o \
        -name '*.key' -o \
        -name 'id_rsa' -o \
        -name 'id_ed25519' -o \
        -name 'credentials.json' -o \
        -name '*service-account*.json' -o \
        -name '*serviceAccount*.json' \
      \) -print \)
  )"
  if [[ -n "${hits}" ]]; then
    echo "error: documentation output contains unexpected or secret files:" >&2
    echo "${hits}" >&2
    exit 1
  fi
}

echo "Checking out ${SHA} from ${REPO_URL}..."
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}"
git init -q "${WORK_DIR}"
git -C "${WORK_DIR}" remote add origin "${REPO_URL}"
git -C "${WORK_DIR}" fetch --depth 1 origin "${SHA}"
git -C "${WORK_DIR}" -c advice.detachedHead=false checkout --detach FETCH_HEAD

HEAD="$(git -C "${WORK_DIR}" rev-parse HEAD)"
if [[ "${HEAD}" != "${SHA}" ]]; then
  echo "error: checked out ${HEAD}, expected ${SHA}" >&2
  exit 1
fi

echo "Building documentation..."
(
  cd "${WORK_DIR}"
  npm ci
  npm run docs:build
  npm run docs:verify
)

reject_sensitive_files "${WORK_DIR}/docs"

rm -rf "${TARGET_DIR}"
cp -a "${WORK_DIR}/docs" "${TARGET_DIR}"
reject_sensitive_files "${TARGET_DIR}"

if [[ ! -f "${TARGET_DIR}/index.html" ]]; then
  echo "error: ${TARGET_DIR}/index.html is missing" >&2
  exit 1
fi

rm -rf "${WORK_DIR}"

echo "Imported mdn-translation-ja-mcp@${SHA} -> ${TARGET_DIR}"
