from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

SUBJECT = "Quick idea for {{company}}"

SEND_DELAY = 60

TEMPLATE = (
    Path(__file__).parent
    / "email_template.html"
)

LOG_FILE = (
    ROOT
    / "08-LOGS"
    / "send_log.txt"
)