from pathlib import Path

print(__file__)

# ============================================
# PROJECT ROOT
# ============================================

# settings.py está en:
# Airbnb/03-SCRIPTS/Gmail_API/settings.py
# Por eso subimos dos niveles hasta Airbnb

ROOT = Path(__file__).resolve().parents[1]

# ============================================
# FILES
# ============================================

PIPELINE_FOLDER = ROOT / "01-PIPELINE"

MASTER_DATABASE = ROOT / "02-MASTER_DATABASE" / "master_database.csv"

LOG_FILE = ROOT / "05-LOGS" / "send_log.txt"

# ============================================
# GMAIL API
# ============================================

CREDENTIALS = ROOT / "05-CONFIG" / "credentials.json"

TOKEN = ROOT / "05-CONFIG" / "token.json"

# ============================================
# EMAIL SETTINGS
# ============================================

DELAY_SECONDS = 60

SUBJECT = "Free cinematic AI video for your Airbnb listings"

print("ROOT =", ROOT)
print("TOKEN =", TOKEN)