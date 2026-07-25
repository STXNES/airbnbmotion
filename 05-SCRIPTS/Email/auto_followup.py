import csv
import time
from datetime import datetime
from pathlib import Path

import random
from email_config import MIN_DELAY, MAX_DELAY
from gmail_sender import send_email
from logger import log

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB_PATH = ROOT / "03-MASTER_DATABASE" / "master_database.csv"
TEMPLATE_2_PATH = ROOT / "05-SCRIPTS" / "Email" / "email_template_2.html"
TEMPLATE_3_PATH = ROOT / "05-SCRIPTS" / "Email" / "email_template_3.html"

def load_template(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def main():
    if not MASTER_DB_PATH.exists():
        print("Master DB not found.")
        return

    # Load DB
    with open(MASTER_DB_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    template_2 = load_template(TEMPLATE_2_PATH)
    template_3 = load_template(TEMPLATE_3_PATH)

    now = datetime.now()
    sent_count = 0
    MAX_FOLLOWUPS = 10

    for row in rows:
        if sent_count >= MAX_FOLLOWUPS:
            print(f"[INFO] Se alcanzó el límite de {MAX_FOLLOWUPS} seguimientos por ejecución para proteger el correo.")
            break

        # Don't follow up if they replied or bounced/closed
        if row.get("Reply_Status") == "REPLIED" or row.get("Last_Status") in ["CLOSED", "BOUNCED", "FAILED"]:
            continue

        last_sent_str = row.get("Last_Sent", "")
        if not last_sent_str:
            continue

        try:
            last_sent_date = datetime.strptime(last_sent_str, "%Y-%m-%d %H:%M")
        except ValueError:
            continue

        days_elapsed = (now - last_sent_date).days
        step = str(row.get("Follow_Up_Step", ""))

        send_html = None
        new_step = ""
        subject = ""

        # Step 1 -> Step 2 (Wait >= 3 days)
        if step == "1" and days_elapsed >= 3:
            send_html = template_2.replace("{{company}}", row["Company"]).replace("{{city}}", row.get("City", ""))
            new_step = "2"
            subject = "Re: AI videos for " + row["Company"]
        
        # Step 2 -> Step 3 (Wait >= 7 days after Step 2)
        elif step == "2" and days_elapsed >= 7:
            send_html = template_3.replace("{{company}}", row["Company"]).replace("{{city}}", row.get("City", ""))
            new_step = "3"
            subject = "Re: AI videos for " + row["Company"]

        if send_html:
            print(f"Sending follow-up {new_step} to {row['Company']} ({row['Email']})")
            
            try:
                result = send_email(
                    to_email=row["Email"],
                    subject=subject,
                    html=send_html,
                    thread_id=row.get("Thread_ID"),
                    in_reply_to=row.get("Message_ID")
                )

                row["Follow_Up_Step"] = new_step
                row["Last_Sent"] = now.strftime("%Y-%m-%d %H:%M")
                row["Message_ID"] = result.get("message_id", "")
                
                # If it's step 3, mark as CLOSED so we stop emailing
                if new_step == "3":
                    row["Last_Status"] = "CLOSED"

                sent_count += 1
                print("✓ Sent")

                log(
                    company=row["Company"],
                    email=row["Email"],
                    status=f"SENT_FOLLOW_UP_{new_step}",
                    message="Batch: FOLLOW_UP"
                )

            except Exception as e:
                print(e)
                log(
                    company=row["Company"],
                    email=row["Email"],
                    status=f"ERROR_FOLLOW_UP_{new_step}",
                    message=f"Batch: FOLLOW_UP | Error: {str(e)}"
                )

            delay = random.randint(MIN_DELAY, MAX_DELAY)
            print(f"Waiting {delay} seconds before next follow-up...")
            time.sleep(delay)

    if sent_count > 0:
        if fieldnames and "Notes" not in fieldnames:
            fieldnames = list(fieldnames) + ["Notes"]
        for r in rows:
            if "Notes" not in r:
                r["Notes"] = ""
        with open(MASTER_DB_PATH, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
            
    print(f"Follow-ups sent: {sent_count}")

if __name__ == "__main__":
    main()
