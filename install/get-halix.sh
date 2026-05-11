#!/usr/bin/env bash
# Download the Halix installer to a temp file (keeps TTY for prompts), then execute.
set -euo pipefail
: "${SCRIPT_URL:=https://raw.githubusercontent.com/your-org/halix-cloud/main/install/halix-install.sh}"
: "${HALIX_REPO_URL:=https://github.com/your-org/halix-cloud.git}"

echo "Installer URL:  $SCRIPT_URL"
echo "Default clone:    $HALIX_REPO_URL"
echo "Override:         export HALIX_REPO_URL='https://github.com/you/repo.git'"
echo ""

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
curl -fsSL "$SCRIPT_URL" -o "$tmp"
chmod +x "$tmp"
exec bash "$tmp" "$@"
