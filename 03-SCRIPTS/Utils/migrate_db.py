import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB_PATH = ROOT / "02-MASTER_DATABASE" / "master_database.csv"

def migrate_db():
    if not MASTER_DB_PATH.exists():
        print("Master DB not found.")
        return

    with open(MASTER_DB_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames

    if not fieldnames:
        print("Empty DB.")
        return

    new_columns = ["Reply_Status", "Reply_Date", "Follow_Up_Step", "Thread_ID", "Message_ID"]
    
    modified = False
    for col in new_columns:
        if col not in fieldnames:
            fieldnames.append(col)
            modified = True

    if not modified:
        print("Database already has the new columns. No migration needed.")
        return

    for row in rows:
        for col in new_columns:
            if col not in row:
                row[col] = ""

    with open(MASTER_DB_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print("Migration successful! Added columns:", new_columns)

if __name__ == "__main__":
    migrate_db()
