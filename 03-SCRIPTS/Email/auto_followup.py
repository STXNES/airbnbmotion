import csv
import time
import random
from datetime import datetime
from pathlib import Path

from email_config import MIN_DELAY, MAX_DELAY
from gmail_sender import send_email

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB_PATH = ROOT / "02-MASTER_DATABASE" / "master_database.csv"

TEMPLATE_2_PATH = ROOT / "03-SCRIPTS" / "Email" / "email_template_2.html"
TEMPLATE_2_ES_PATH = ROOT / "03-SCRIPTS" / "Email" / "email_template_2_es.html"
TEMPLATE_3_PATH = ROOT / "03-SCRIPTS" / "Email" / "email_template_3.html"
TEMPLATE_3_ES_PATH = ROOT / "03-SCRIPTS" / "Email" / "email_template_3_es.html"

def load_template(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except Exception:
        return ""

def main():
    if not MASTER_DB_PATH.exists():
        print("[INFO] Master DB not found.")
        return

    # Load DB
    with open(MASTER_DB_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames) if reader.fieldnames else []
        rows = list(reader)

    if "Notes" not in fieldnames:
        fieldnames.append("Notes")

    template_2_en = load_template(TEMPLATE_2_PATH)
    template_2_es = load_template(TEMPLATE_2_ES_PATH) or template_2_en
    template_3_en = load_template(TEMPLATE_3_PATH)
    template_3_es = load_template(TEMPLATE_3_ES_PATH) or template_3_en

    def save_state():
        with open(MASTER_DB_PATH, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    now = datetime.now()
    sent_count = 0
    MAX_FOLLOWUPS = 10

    for row in rows:
        if "Notes" not in row:
            row["Notes"] = ""

        if sent_count >= MAX_FOLLOWUPS:
            print(f"[INFO] Se alcanzó el límite de {MAX_FOLLOWUPS} seguimientos por ejecución.")
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
            try:
                last_sent_date = datetime.strptime(last_sent_str.split()[0], "%Y-%m-%d")
            except Exception:
                continue

        days_elapsed = (now - last_sent_date).days
        step = str(row.get("Follow_Up_Step", ""))

        country = row.get("Country", "").lower()
        is_latam = "costa rica" in country or "mexico" in country or "colombia" in country or "españa" in country or "spain" in country

        send_html = None
        new_step = ""
        subject = ""

        city = row.get("City", "").strip()
        if is_latam:
            city_phrase = f" en <strong>{city}</strong>" if city else ""
        else:
            city_phrase = f" in <strong>{city}</strong>" if city else ""

        # Step 1 -> Step 2 (Wait >= 3 days)
        if step == "1" and days_elapsed >= 3:
            t2 = template_2_es if is_latam else template_2_en
            send_html = t2.replace("{{company}}", row["Company"])\
                          .replace("{{city_phrase}}", city_phrase)\
                          .replace("{{city}}", city)
            new_step = "2"
            subject = f"Re: AI videos for {row['Company']}" if not is_latam else f"Re: Videos IA para {row['Company']}"
        
        # Step 2 -> Step 3 (Wait >= 7 days after Step 2)
        elif step == "2" and days_elapsed >= 7:
            t3 = template_3_es if is_latam else template_3_en
            send_html = t3.replace("{{company}}", row["Company"])\
                          .replace("{{city_phrase}}", city_phrase)\
                          .replace("{{city}}", city)
            new_step = "3"
            subject = f"Re: AI videos for {row['Company']}" if not is_latam else f"Re: Videos IA para {row['Company']}"

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
                save_state()

            except Exception as e:
                print(f"Error sending follow-up to {row['Email']}: {e}")

            delay = random.randint(MIN_DELAY, MAX_DELAY)
            print(f"Waiting {delay} seconds before next follow-up...")
            time.sleep(delay)

    print(f"Follow-ups sent in this run: {sent_count}")

if __name__ == "__main__":
    main()
