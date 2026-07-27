import csv
import time
import random
from datetime import datetime
from pathlib import Path

from email_config import SUBJECT_VARIANTS, SUBJECT_VARIANTS_ES
from email_config import TEMPLATE, TEMPLATE_ES
from email_config import MIN_DELAY, MAX_DELAY

from gmail_sender import send_email
from llm_writer import generate_icebreaker

# ==========================================
# LOAD HTML TEMPLATES
# ==========================================

def load_template(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

html_template_en = load_template(TEMPLATE)
try:
    html_template_es = load_template(TEMPLATE_ES)
except FileNotFoundError:
    html_template_es = html_template_en


# ==========================================
# FIND LATEST PIPELINE
# ==========================================

ROOT = Path(__file__).resolve().parents[2]

PIPELINE_FOLDER = ROOT / "01-PIPELINE"

pipelines = sorted(
    PIPELINE_FOLDER.glob("altus_pipeline*.csv")
)

PIPELINE = None
for p in pipelines:
    with open(p, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("Status") == "PENDING":
                PIPELINE = p
                break
    if PIPELINE:
        break

if not PIPELINE:
    print("[INFO] No se encontraron correos PENDING en ningún lote activo.")
    exit(0)

batch = PIPELINE.stem.replace("altus_pipeline_", "")

print("=" * 60)
print("PIPELINE")
print("=" * 60)
print(PIPELINE)
print()


# ==========================================
# LOAD PIPELINE & MASTER DB
# ==========================================

with open(
    PIPELINE,
    newline="",
    encoding="utf-8"
) as f:

    reader = csv.DictReader(f)
    rows = list(reader)

MASTER_DB_PATH = ROOT / "02-MASTER_DATABASE" / "master_database.csv"
master_db_rows = []
master_db_fieldnames = []
master_db_map = {}

if MASTER_DB_PATH.exists():
    with open(MASTER_DB_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        master_db_fieldnames = reader.fieldnames
        for r in reader:
            master_db_rows.append(r)
            master_db_map[r["Email"].lower()] = r


# ==========================================
# ==========================================
# SAVE STATE FUNCTION
# ==========================================

def save_state():
    with open(PIPELINE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    if master_db_fieldnames:
        if "Notes" not in master_db_fieldnames:
            master_db_fieldnames.append("Notes")
        for r in master_db_rows:
            if "Notes" not in r:
                r["Notes"] = ""
        with open(MASTER_DB_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=master_db_fieldnames)
            writer.writeheader()
            writer.writerows(master_db_rows)

# ==========================================
# SEND EMAILS
# ==========================================

sent = 0
errors = 0
DAILY_LIMIT = 30


for row in rows:

    if sent >= DAILY_LIMIT:
        print(f"\n[INFO] Se alcanzó el límite diario de {DAILY_LIMIT} correos en frío. Pausando hasta mañana.")
        break

    if row["Status"] != "PENDING":
        continue

    print(f"Sending to {row['Company']}")

    try:

        # Determinar idioma basado en el país
        country = row.get("Country", "").lower()
        is_latam = "costa rica" in country or "mexico" in country or "colombia" in country or "españa" in country
        
        if is_latam:
            selected_subject = random.choice(SUBJECT_VARIANTS_ES)
            html_to_use = html_template_es
        else:
            selected_subject = random.choice(SUBJECT_VARIANTS)
            html_to_use = html_template_en

        state_or_city = row.get("State", "") or row.get("City", "") or ("su área" if is_latam else "your area")

        subject = selected_subject.replace("{{company}}", row["Company"])\
                                  .replace("{company}", row["Company"])\
                                  .replace("{{city}}", row.get("City", "") or state_or_city)\
                                  .replace("{city}", row.get("City", "") or state_or_city)\
                                  .replace("{{state}}", state_or_city)\
                                  .replace("{state}", state_or_city)
        
        # Generar Icebreaker con IA
        print(f"Generando Icebreaker con Gemini para {row['Company']}...")
        icebreaker = generate_icebreaker(row["Company"], row.get("City", ""), is_latam=is_latam)

        html = html_to_use.replace("{{company}}", row["Company"])\
                          .replace("{company}", row["Company"])\
                          .replace("{{city}}", row.get("City", "") or state_or_city)\
                          .replace("{city}", row.get("City", "") or state_or_city)\
                          .replace("{{state}}", state_or_city)\
                          .replace("{state}", state_or_city)\
                          .replace("{{ai_icebreaker}}", icebreaker)\
                          .replace("{ai_icebreaker}", icebreaker)

        result = send_email(
            row["Email"],
            subject,
            html
        )

        row["Status"] = "SENT"
        
        sent_date = datetime.now().strftime("%Y-%m-%d %H:%M")

        row["Sent_Date"] = sent_date
        
        # Update Master Database record
        email_key = row["Email"].lower()
        if email_key in master_db_map:
            master_row = master_db_map[email_key]
            master_row["Last_Status"] = "SENT"
            master_row["Last_Sent"] = sent_date
            master_row["Follow_Up_Step"] = "1"
            master_row["Thread_ID"] = result.get("thread_id", "")
            master_row["Message_ID"] = result.get("message_id", "")

        sent += 1

        print("✓ Sent")
        save_state()


    except Exception as e:

        errors += 1

        print(f"Error sending to {row['Email']}: {e}")

        row["Status"] = "FAILED"
        email_key = row["Email"].lower()
        if email_key in master_db_map:
            master_row = master_db_map[email_key]
            master_row["Last_Status"] = "FAILED"
            master_row["Follow_Up_Step"] = "CLOSED"
            master_row["Notes"] = f"SMTP Error: {str(e)}"


    delay = random.randint(MIN_DELAY, MAX_DELAY)
    print(f"Waiting {delay} seconds before next email...")
    save_state()
    time.sleep(delay)


# ==========================================
# ==========================================
# REPORT
# ==========================================

print()
print("=" * 60)
print(f"Batch  : {batch}")
print(f"Sent   : {sent}")
print(f"Errors : {errors}")
print("=" * 60)