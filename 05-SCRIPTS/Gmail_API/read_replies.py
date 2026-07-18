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

# Cargar las credenciales de Zoho
with open(CREDENTIALS_FILE, "r") as f:
    config = json.load(f)

EMAIL_USER = config["EMAIL"]
EMAIL_PASSWORD = config["APP_PASSWORD"]

def extract_email(header_value):
    match = re.search(r'<(.+?)>', header_value)
    if match:
        return match.group(1).lower().strip()
    return header_value.lower().strip()

def main():
    print("Connecting to Zoho Mail IMAP...")
    try:
        # Conectar al servidor IMAP seguro de Zoho
        mail = imaplib.IMAP4_SSL("imap.zoho.com", 993)
        mail.login(EMAIL_USER, EMAIL_PASSWORD)
    except Exception as e:
        print(f"⚠️ IMAP Connection skipped/disabled: {e}")
        print("[INFO] Automatic reply checking is not available on Zoho Free plans. Please log replies manually via your Dashboard.")
        sys.exit(0)

    # Seleccionar la bandeja de entrada
    mail.select("INBOX")
    
    # Buscar correos NO LEÍDOS (UNSEEN)
    status, messages = mail.search(None, 'UNSEEN')
    if status != 'OK':
        print("No unread messages found or search failed.")
        mail.logout()
        return

    msg_ids = messages[0].split()
    if not msg_ids:
        print("No new replies found.")
        mail.logout()
        return

    print(f"Found {len(msg_ids)} unread messages. Loading Master Database...")
    if not MASTER_DB_PATH.exists():
        print("Master DB not found.")
        mail.logout()
        return

    with open(MASTER_DB_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    # Indizar los registros por email
    db_index = {row["Email"].lower().strip(): row for row in rows if row["Email"]}
    updated_count = 0
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    for msg_id in msg_ids:
        # Descargar los datos del mensaje (cabeceras y cuerpo)
        status, msg_data = mail.fetch(msg_id, '(RFC822)')
        if status != 'OK':
            continue

        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg_body = response_part[1]
                msg_obj = email.message_from_bytes(msg_body)
                
                # Obtener el remitente ("From")
                sender = msg_obj.get("From")
                if sender:
                    # Decodificar cabecera si tiene caracteres especiales
                    decoded_sender, encoding = decode_header(sender)[0]
                    if isinstance(decoded_sender, bytes):
                        sender = decoded_sender.decode(encoding or "utf-8", errors="ignore")
                    
                    sender_email = extract_email(sender)
                    if sender_email in db_index:
                        row = db_index[sender_email]
                        if row["Reply_Status"] != "REPLIED":
                            print(f"Reply detected from {sender_email} ({row['Company']})")
                            row["Reply_Status"] = "REPLIED"
                            row["Reply_Date"] = now
                            row["Last_Status"] = "REPLIED"
                            updated_count += 1
                        
                        # Marcar el correo como LEÍDO en el servidor de Zoho
                        mail.store(msg_id, '+FLAGS', '\\Seen')

    mail.logout()

    if updated_count > 0:
        with open(MASTER_DB_PATH, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"Updated {updated_count} records in Master Database.")
    else:
        print("No new replies matched any leads in the database.")

if __name__ == '__main__':
    main()
