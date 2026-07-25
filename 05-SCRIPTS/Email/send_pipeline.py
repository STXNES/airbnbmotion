import csv
import time
import random
from datetime import datetime
from pathlib import Path

from email_config import SUBJECT_VARIANTS
from email_config import TEMPLATE
from email_config import MIN_DELAY, MAX_DELAY

from gmail_sender import send_email
from logger import log

# ==========================================
# LOAD HTML TEMPLATE
# ==========================================

def load_template():

    with open(
        TEMPLATE,
        encoding="utf-8"
    ) as f:

        return f.read()


# ==========================================
# FIND LATEST PIPELINE
# ==========================================

ROOT = Path(__file__).resolve().parents[2]

PIPELINE_FOLDER = ROOT / "02-PIPELINE"

pipelines = sorted(
    PIPELINE_FOLDER.glob("airbnb_pipeline*.csv")
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

batch = PIPELINE.stem.replace("airbnb_pipeline_", "")

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

MASTER_DB_PATH = ROOT / "03-MASTER_DATABASE" / "master_database.csv"
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
# SEND EMAILS
# ==========================================

sent = 0
errors = 0
DAILY_LIMIT = 30

html_template = load_template()

for row in rows:

    if sent >= DAILY_LIMIT:
        print(f"\n[INFO] Se alcanzó el límite diario de {DAILY_LIMIT} correos en frío. Pausando hasta mañana.")
        break

    if row["Status"] != "PENDING":
        continue

    print(f"Sending to {row['Company']}")

    try:

        # A/B Testing de asuntos aleatorios
        selected_subject = random.choice(SUBJECT_VARIANTS)
        subject = selected_subject.replace(
            "{{company}}",
            row["Company"]
        ).replace(
            "{{city}}",
            row.get("City", "") if row.get("City") else "your area"
        )

        html = html_template.replace(
            "{{company}}",
            row["Company"]
        ).replace(
            "{{city}}",
            row.get("City", "")
        )

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

        log(
            company=row["Company"],
            email=row["Email"],
            status="SENT",
            message=f"Batch: {batch}"
        )

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

        log(
            company=row["Company"],
            email=row["Email"],
            status="ERROR",
            message=f"Batch: {batch} | Error: {str(e)}"
        )

    delay = random.randint(MIN_DELAY, MAX_DELAY)
    print(f"Waiting {delay} seconds before next email...")
    time.sleep(delay)


# ==========================================
# SAVE PIPELINE & MASTER DB
# ==========================================

with open(
    PIPELINE,
    "w",
    newline="",
    encoding="utf-8"
) as f:

    writer = csv.DictWriter(
        f,
        fieldnames=rows[0].keys()
    )

    writer.writeheader()
    writer.writerows(rows)

if master_db_fieldnames:
    if "Notes" not in master_db_fieldnames:
        master_db_fieldnames = list(master_db_fieldnames) + ["Notes"]
    for r in master_db_rows:
        if "Notes" not in r:
            r["Notes"] = ""
    with open(MASTER_DB_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=master_db_fieldnames)
        writer.writeheader()
        writer.writerows(master_db_rows)


# ==========================================
# REPORT
# ==========================================

print()
print("=" * 60)
print(f"Batch  : {batch}")
print(f"Sent   : {sent}")
print(f"Errors : {errors}")
print("=" * 60)