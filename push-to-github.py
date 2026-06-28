#!/usr/bin/env python3
"""
Push the Verity app to GitHub with correct folder structure (app/, components/, lib/).

Browser upload breaks folders — this script fixes it in one click.

HOW TO RUN:
1. Create a GitHub token: https://github.com/settings/tokens/new
   - Check "repo" scope
   - Copy the token (starts with ghp_)

2. Open Terminal and run:

   cd /Users/rkeen/Projects/verity
   GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE python3 push-to-github.py

3. Go to Vercel → Deployments → Redeploy
"""

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

OWNER = "rebecca-keen"
REPO = "Verity"
ROOT = os.path.dirname(os.path.abspath(__file__))

SKIP_DIRS = {".git", "node_modules", ".next", ".vercel"}
SKIP_FILES = {"push-to-github.py", ".DS_Store"}


def get_token():
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if not token:
        print("\n❌ Missing GITHUB_TOKEN\n")
        print("1. Go to: https://github.com/settings/tokens/new")
        print('2. Check the "repo" box → Generate token')
        print("3. Run:\n")
        print("   GITHUB_TOKEN=ghp_YOUR_TOKEN python3 push-to-github.py\n")
        sys.exit(1)
    return token


def api_request(token, method, path, data=None):
    url = f"https://api.github.com{path}"
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "verity-push-script",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"\n❌ GitHub API error ({e.code}): {err}\n")
        sys.exit(1)


def collect_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name in SKIP_FILES:
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, ROOT).replace("\\", "/")
            if rel.startswith(".git/"):
                continue
            files.append(rel)
    return sorted(files)


def push_via_git(token):
    """Fast path: force-push local git repo (already has correct folders)."""
    remote = f"https://{token}@github.com/{OWNER}/{REPO}.git"
    print("→ Force-pushing local repo (correct folder structure)...")
    result = subprocess.run(
        ["git", "push", "--force", remote, "main"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        print("✅ Push successful!")
        return True
    print("Git push failed, trying API upload...\n", result.stderr)
    return False


def push_via_api(token):
    """Fallback: build a new Git tree via API with all files in correct paths."""
    print("→ Uploading files via GitHub API...")
    files = collect_files()
    print(f"   Found {len(files)} files")

    ref = api_request(token, "GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/main")
    base_commit = ref["object"]["sha"]
    base_tree = api_request(token, "GET", f"/repos/{OWNER}/{REPO}/git/commits/{base_commit}")["tree"]["sha"]

    tree_entries = []
    for rel in files:
        full = os.path.join(ROOT, rel)
        with open(full, "rb") as f:
            content = f.read()
        blob = api_request(
            token,
            "POST",
            f"/repos/{OWNER}/{REPO}/git/blobs",
            {"content": content.decode("utf-8"), "encoding": "utf-8"},
        )
        tree_entries.append(
            {"path": rel, "mode": "100644", "type": "blob", "sha": blob["sha"]}
        )
        print(f"   + {rel}")

    new_tree = api_request(
        token,
        "POST",
        f"/repos/{OWNER}/{REPO}/git/trees",
        {"base_tree": base_tree, "tree": tree_entries},
    )

    new_commit = api_request(
        token,
        "POST",
        f"/repos/{OWNER}/{REPO}/git/commits",
        {
            "message": "Fix folder structure: app/, components/, lib/",
            "tree": new_tree["sha"],
            "parents": [base_commit],
        },
    )

    api_request(
        token,
        "PATCH",
        f"/repos/{OWNER}/{REPO}/git/refs/heads/main",
        {"sha": new_commit["sha"], "force": True},
    )
    print("✅ GitHub updated with correct folders!")


def verify_local():
    required = ["app/page.tsx", "components/Header.tsx", "lib/data.ts", "package.json"]
    missing = [p for p in required if not os.path.isfile(os.path.join(ROOT, p))]
    if missing:
        print(f"❌ Local project missing: {missing}")
        sys.exit(1)
    print("✅ Local project structure looks correct\n")


def main():
    print("\n=== Verity → GitHub Fix ===\n")
    verify_local()
    token = get_token()

    if push_via_git(token):
        pass
    else:
        push_via_api(token)

    print("\n--- Next steps ---")
    print("1. Check: https://github.com/rebecca-keen/Verity")
    print("   You should see folders: app/  components/  lib/")
    print("2. Vercel → Deployments → Redeploy")
    print("3. Your app should build successfully!\n")


if __name__ == "__main__":
    main()
