import csv
import time
from datetime import datetime
from pathlib import Path

from email_config import SUBJECT
from email_config import TEMPLATE
from email_config import SEND_DELAY

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
    PIPELINE_FOLDER.glob("airbnb_pipeline*.csv"),
    reverse=True
)

if not pipelines:

    print("No pipeline found.")
    exit()

PIPELINE = pipelines[0]

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

html_template = load_template()

for row in rows:

    if row["Status"] != "PENDING":
        continue

    print(f"Sending to {row['Company']}")

    try:

        subject = SUBJECT.replace(
            "{{company}}",
            row["Company"]
        )

        html = html_template.replace(
            "{{company}}",
            row["Company"]
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
            batch=batch,
            company=row["Company"],
            email=row["Email"],
            status="SENT",
            error=""
        )

    except Exception as e:

        errors += 1

        print(e)

        log(
            batch=batch,
            company=row["Company"],
            email=row["Email"],
            status="ERROR",
            error=str(e)
        )

    time.sleep(SEND_DELAY)


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