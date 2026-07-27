from pathlib import Path
import sys

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

PROJECT_ROOT = Path(__file__).resolve().parents[2]

CONFIG_FOLDER = PROJECT_ROOT / "05-CONFIG"

sys.path.insert(0, str(CONFIG_FOLDER))

from settings import CREDENTIALS, TOKEN

# ============================================
# SCOPES
# ============================================

SCOPES = [
    "https://mail.google.com/"
]

# ============================================
# AUTH
# ============================================

creds = None

if TOKEN.exists():
    creds = Credentials.from_authorized_user_file(
        str(TOKEN),
        SCOPES
    )

if not creds or not creds.valid():

    if creds and creds.expired and creds.refresh_token:

        creds.refresh(Request())

    else:

        flow = InstalledAppFlow.from_client_secrets_file(
            str(CREDENTIALS),
            SCOPES
        )

        creds = flow.run_local_server(port=0)

    TOKEN.write_text(creds.to_json(), encoding="utf-8")

print("\n===================================")
print("Authentication successful")
print("===================================")
print(f"Credentials : {CREDENTIALS}")
print(f"Token       : {TOKEN}")
print("===================================")