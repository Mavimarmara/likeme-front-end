#!/usr/bin/env bash
# Retorna 0 se o perfil App Store instalado inclui um certificado Apple Distribution
# presente no keychain (P12 importado). Evita fallback manual com secrets desalinhados.
set -euo pipefail

profile_uuid="${IOS_PROVISIONING_PROFILE_UUID:-}"
if [[ -z "$profile_uuid" ]]; then
  exit 1
fi

profile_path="${HOME}/Library/MobileDevice/Provisioning Profiles/${profile_uuid}.mobileprovision"
if [[ ! -f "$profile_path" ]]; then
  exit 1
fi

python3 - "$profile_path" <<'PY'
import plistlib
import subprocess
import sys
from pathlib import Path

profile_path = Path(sys.argv[1])

plist_xml = subprocess.check_output(
    ["security", "cms", "-D", "-i", str(profile_path)],
    stderr=subprocess.DEVNULL,
)
plist = plistlib.loads(plist_xml)
profile_certs = plist.get("DeveloperCertificates") or []
if not profile_certs:
    sys.exit(1)

def sha1_fingerprint(der: bytes) -> str:
    import hashlib
    return hashlib.sha1(der).hexdigest().lower()

profile_fps = {sha1_fingerprint(der) for der in profile_certs if der}

try:
    pem_blob = subprocess.check_output(
        ["security", "find-certificate", "-a", "-c", "Apple Distribution", "-p"],
        stderr=subprocess.DEVNULL,
    )
except subprocess.CalledProcessError:
    sys.exit(1)

keychain_fps: set[str] = set()
for block in pem_blob.split(b"-----END CERTIFICATE-----"):
    block = block.strip()
    if not block.startswith(b"-----BEGIN CERTIFICATE-----"):
        continue
    pem = block + b"\n-----END CERTIFICATE-----\n"
    proc = subprocess.run(
        ["openssl", "x509", "-inform", "PEM", "-outform", "DER"],
        input=pem,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    if proc.returncode == 0 and proc.stdout:
        keychain_fps.add(sha1_fingerprint(proc.stdout))

if profile_fps & keychain_fps:
    sys.exit(0)
sys.exit(1)
PY
