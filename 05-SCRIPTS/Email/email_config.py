from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Variaciones para A/B Testing automático de asuntos
SUBJECT_VARIANTS = [
    "Quick question about your {{city}} properties",
    "Free video sample for {{company}} listings in {{city}}",
    "Idea to boost bookings for {{company}}"
]

SUBJECT = SUBJECT_VARIANTS[0]

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