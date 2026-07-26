from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Variaciones para A/B Testing automático de asuntos
SUBJECT_VARIANTS = [
    "Quick question about your {{city}} real estate listings",
    "Free video tour sample for {{company}} properties in {{city}}",
    "Idea to sell properties faster for {{company}}"
]

SUBJECT_VARIANTS_ES = [
    "Pregunta rápida sobre tus propiedades en {{city}}",
    "Muestra de video gratis para las propiedades de {{company}} en {{city}}",
    "Idea para vender propiedades más rápido para {{company}}"
]

SUBJECT = SUBJECT_VARIANTS[0]

MIN_DELAY = 90
MAX_DELAY = 150

TEMPLATE = (
    Path(__file__).parent
    / "email_template.html"
)

TEMPLATE_ES = (
    Path(__file__).parent
    / "email_template_es.html"
)

LOG_FILE = (
    ROOT
    / "08-LOGS"
    / "send_log.txt"
)