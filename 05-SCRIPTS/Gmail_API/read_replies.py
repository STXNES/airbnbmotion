import sys
import csv
import json
import imaplib
import email
from email.header import decode_header
from pathlib import Path
from datetime import datetime
import re

PROJECT_ROOT = Path(__file__).resolve().parents[2]
CREDENTIALS_FILE = PROJECT_ROOT / "09-CONFIG" / "email_credentials.json"
MASTER_DB_PATH = PROJECT_ROOT / "03-MASTER_DATABASE" / "master_database.csv"

# Cargar las credenciales
with open(CREDENTIALS_FILE, "r") as f:
    config = json.load(f)

# Soporta tanto Gmail IMAP como Zoho IMAP
EMAIL_USER = config.get("GMAIL_USER") or config.get("EMAIL")
EMAIL_PASSWORD = config.get("GMAIL_APP_PASSWORD") or config.get("APP_PASSWORD")
IMAP_SERVER = config.get("IMAP_SERVER", "imap.gmail.com")

def extract_email(header_value):
    match = re.search(r'<(.+?)>', header_value)
    if match:
        return match.group(1).lower().strip()
    return header_value.lower().strip()

def extract_bounced_email(msg_obj):
    """Intenta extraer la dirección de correo original que rebotó desde una notificación Delivery Status."""
    text_content = ""
    if msg_obj.is_multipart():
        for part in msg_obj.walk():
            content_type = part.get_content_type()
            if content_type in ["text/plain", "message/delivery-status"]:
                try:
                    text_content += part.get_payload(decode=True).decode('utf-8', errors='ignore') + "\n"
                except Exception:
                    pass
    else:
        try:
            text_content = msg_obj.get_payload(decode=True).decode('utf-8', errors='ignore')
        except Exception:
            text_content = str(msg_obj.get_payload())

    # Buscar patrones de destinatarios fallidos en el cuerpo del rebote
    matches = re.findall(r'(?:Original-Recipient|Final-Recipient|To|Recipient):\s*(?:rfc822;)?\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})', text_content, re.IGNORECASE)
    if matches:
        return matches[0].lower().strip()
    
    # Buscar cualquier email dentro de corchetes o texto de error
    all_emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text_content)
    for em in all_emails:
        em_lower = em.lower().strip()
        if not any(b in em_lower for b in ['zoho', 'gmail', 'mailer-daemon', 'googlemail', 'sentry', 'wixpress']):
            return em_lower
            
    return None

def main():
    print(f"Connecting to IMAP Server ({IMAP_SERVER}) for user {EMAIL_USER}...")
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, 993)
        mail.login(EMAIL_USER, EMAIL_PASSWORD)
    except Exception as e:
        print(f"⚠️ IMAP Connection error on {IMAP_SERVER}: {e}")
        print("[INFO] Skipping automatic reply/bounce check.")
        sys.exit(0)

    mail.select("INBOX")
    
    # Buscar correos NO LEÍDOS (UNSEEN)
    status, messages = mail.search(None, 'UNSEEN')
    if status != 'OK' or not messages[0]:
        print("No unread messages or bounces found.")
        mail.logout()
        return

    msg_ids = messages[0].split()
    print(f"Found {len(msg_ids)} unread messages. Loading Master Database...")
    
    if not MASTER_DB_PATH.exists():
        print("Master DB not found.")
        mail.logout()
        return

    with open(MASTER_DB_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    db_index = {row["Email"].lower().strip(): row for row in rows if row.get("Email")}
    updated_count = 0
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    for msg_id in msg_ids:
        status, msg_data = mail.fetch(msg_id, '(RFC822)')
        if status != 'OK':
            continue

        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg_body = response_part[1]
                msg_obj = email.message_from_bytes(msg_body)
                
                sender = msg_obj.get("From", "")
                subject = msg_obj.get("Subject", "")
                
                if sender:
                    decoded_sender, encoding = decode_header(sender)[0]
                    if isinstance(decoded_sender, bytes):
                        sender = decoded_sender.decode(encoding or "utf-8", errors="ignore")
                
                if subject:
                    decoded_subj, encoding = decode_header(subject)[0]
                    if isinstance(decoded_subj, bytes):
                        subject = decoded_subj.decode(encoding or "utf-8", errors="ignore")

                sender_email = extract_email(sender)
                subject_lower = subject.lower()

                # DETECCIÓN DE REBOTES (Undelivered / Bounces)
                is_bounce = any(b in sender_email for b in ['mailer-daemon', 'postmaster']) or \
                            any(b in subject_lower for b in ['undelivered', 'delivery status', 'failure', 'returned to sender', 'mail delivery'])

                if is_bounce:
                    bounced_email = extract_bounced_email(msg_obj)
                    if bounced_email and bounced_email in db_index:
                        row = db_index[bounced_email]
                        print(f"🚫 Bounce detected for {bounced_email} ({row['Company']}). Marking as BOUNCED & CLOSED.")
                        row["Last_Status"] = "BOUNCED"
                        row["Follow_Up_Step"] = "CLOSED"
                        row["Notes"] = "Email address non-existent / bounced"
                        updated_count += 1
                    mail.store(msg_id, '+FLAGS', '\\Seen')
                    continue

                # DETECCIÓN DE RESPUESTAS REALES DE CLIENTES
                if sender_email in db_index:
                    row = db_index[sender_email]
                    if row["Reply_Status"] != "REPLIED":
                        print(f"💬 Reply detected from {sender_email} ({row['Company']})!")
                        row["Reply_Status"] = "REPLIED"
                        row["Reply_Date"] = now
                        row["Last_Status"] = "REPLIED"
                        updated_count += 1
                    mail.store(msg_id, '+FLAGS', '\\Seen')

    mail.logout()

    if updated_count > 0:
        with open(MASTER_DB_PATH, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"✅ Successfully updated {updated_count} records in Master Database.")
    else:
        print("No new replies or bounces matched leads in the database.")

if __name__ == '__main__':
    main()
