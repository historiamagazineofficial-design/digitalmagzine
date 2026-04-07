"""
migrate_assets.py — Cloudinary Asset Migration Script
Migrates images from old Historia cloud (dn5f5kr16) to new Inkspire cloud (dfiaie9as).

USAGE:
  Set env variables before running:
    $env:HISTORIA_API_KEY = "your_old_api_key"
    $env:HISTORIA_API_SECRET = "your_old_api_secret"
    $env:INKSPIRE_API_KEY = "your_new_api_key"
    $env:INKSPIRE_API_SECRET = "your_new_api_secret"
  Then run: python migrate_assets.py
"""

import os
import cloudinary
import cloudinary.api
import cloudinary.uploader

# 1. OLD ACCOUNT (Historia - dn5f5kr16) — load from env vars, never hardcode
HISTORIA_OLD = {
    "cloud_name": "dn5f5kr16",
    "api_key": os.environ.get("HISTORIA_API_KEY"),
    "api_secret": os.environ.get("HISTORIA_API_SECRET"),
}

# 2. NEW ACCOUNT (Inkspire Magazine - dfiaie9as) — load from env vars, never hardcode
INKSPIRE_NEW = {
    "cloud_name": "dfiaie9as",
    "api_key": os.environ.get("INKSPIRE_API_KEY", "485439364958237"),
    "api_secret": os.environ.get("INKSPIRE_API_SECRET"),
}


def migrate():
    # Validate env vars are set
    if not HISTORIA_OLD["api_key"] or not HISTORIA_OLD["api_secret"]:
        print("❌ ERROR: Set HISTORIA_API_KEY and HISTORIA_API_SECRET env vars first.")
        return
    if not INKSPIRE_NEW["api_secret"]:
        print("❌ ERROR: Set INKSPIRE_API_SECRET env var first.")
        return

    # Connect to the old Historia account
    cloudinary.config(**HISTORIA_OLD)
    print(f"Connecting to Historia ({HISTORIA_OLD['cloud_name']})...")

    try:
        resources = cloudinary.api.resources(type="upload", max_results=500)['resources']
        print(f"Success! Found {len(resources)} images in Historia.")
    except Exception as e:
        print(f"Authorization Failed for Historia: {e}")
        print("Check if the API credentials for Historia are correct.")
        return

    # Switch to Inkspire account
    cloudinary.config(**INKSPIRE_NEW)
    print(f"Switching to Inkspire Magazine ({INKSPIRE_NEW['cloud_name']})...")

    success_count = 0
    fail_count = 0

    for res in resources:
        image_url = res['secure_url']
        public_id = res['public_id']
        try:
            cloudinary.uploader.upload(image_url, public_id=public_id)
            print(f"✅ Moved: {public_id}")
            success_count += 1
        except Exception as e:
            print(f"❌ Failed to upload {public_id}: {e}")
            fail_count += 1

    print(f"\n--- Migration Complete! ({success_count} succeeded, {fail_count} failed) ---")


if __name__ == "__main__":
    migrate()