import csv
import webbrowser
from urllib.parse import quote

CSV_FILE = "../02-PIPELINE/airbnb_pipeline.csv"


SUBJECT = "Free promotional video for one of your vacation rentals"


BODY = """
Hi,

I came across your vacation rental business and was impressed by your portfolio.

I create short AI promotional videos that help vacation rental companies showcase their properties in a more engaging way across Airbnb, social media and their own websites.

I'd like to create one cinematic promotional video for one of your properties completely free.

No payment.
No contract.
No obligation.

If you enjoy the result, we can discuss creating additional videos in the future.

If you're interested, simply reply:

YES

I'll take care of the rest.

Best regards,

Axel R.
AI Video Creator
Costa Rica
"""


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

        if row["Status"] != "PENDING":
            continue

        email = row["Email"]

        company = row["Company"]

        body = BODY

        gmail = (
            "https://mail.google.com/mail/?view=cm"
            "&fs=1"
            f"&to={quote(email)}"
            f"&su={quote(SUBJECT)}"
            f"&body={quote(body)}"
        )

        webbrowser.open(gmail)

        row["Status"] = "OPENED"

        save_rows(rows, fields)

        print()

        print("===============================")
        print("Email generated")
        print(company)
        print(email)
        print("===============================")

        return

    print("No pending prospects found.")


if __name__ == "__main__":
    main()