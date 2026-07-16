import csv
from datetime import datetime

CSV_FILE = "../02-PIPELINE/airbnb_pipeline.csv"

def load_rows():

    with open(CSV_FILE, newline="", encoding="utf-8") as f:

        reader = csv.DictReader(f)

        rows = list(reader)

        fields = reader.fieldnames

    return rows, fields


def save_rows(rows, fields):

    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:

        writer = csv.DictWriter(f, fieldnames=fields)

        writer.writeheader()

        writer.writerows(rows)


def main():

    rows, fields = load_rows()

    for row in rows:

        if row["Status"] != "OPENED":
            continue

        row["Status"] = "SENT"

        row["Sent_Date"] = datetime.now().strftime("%Y-%m-%d %H:%M")

        save_rows(rows, fields)

        print("\n===========================")
        print(" Prospect marked as SENT")
        print("===========================")
        print(row["Company"])
        print(row["Email"])
        print("===========================\n")

        return

    print("\nNo OPENED prospects found.\n")


if __name__ == "__main__":
    main()