import csv
import os
import re
from pathlib import Path

from datetime import datetime

# =====================================================
# CONFIG
# =====================================================

INPUT_FILE = "../../01-INBOX/altus_prospects.csv"

OUTPUT_FOLDER = "../../02-PIPELINE"

MASTER_DATABASE = "../../03-MASTER_DATABASE/master_database.csv"

BATCH_PREFIX = "Batch_"

EMAIL_REGEX = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

def normalize_text(text):

    if text is None:
        return ""

    return text.strip().lower()


def normalize_website(url):

    url = normalize_text(url)

    url = url.replace("https://", "")
    url = url.replace("http://", "")
    url = url.replace("www.", "")

    return url

def find_email_column(fieldnames):

    for field in fieldnames:

        if "email" in field.lower():
            return field

    raise Exception("No email column found.")

def create_master_database():

    Path(MASTER_DATABASE).parent.mkdir(
        parents=True,
        exist_ok=True
    )

    if (
        os.path.exists(MASTER_DATABASE)
        and
        os.path.getsize(MASTER_DATABASE) > 0
    ):
        return

    with open(
        MASTER_DATABASE,
        "w",
        newline="",
        encoding="utf-8"
    ) as f:

        writer = csv.writer(f)

        writer.writerow([
            "Company",
            "Website",
            "Email",
            "City",
            "State",
            "First_Added",
            "Batch",
            "Last_Status",
            "Last_Sent",
            "Video_Created",
            "Client",
            "Reply_Status",
            "Reply_Date",
            "Follow_Up_Step",
            "Thread_ID",
            "Message_ID",
            "Notes"
        ])

    print("Master database created.")

def load_master_database():

    known_companies = set()

    known_websites = set()

    known_emails = set()

    with open(
        MASTER_DATABASE,
        newline="",
        encoding="utf-8"
    ) as f:

        reader = csv.DictReader(f)

        for row in reader:

            known_companies.add(
                normalize_text(row["Company"])
            )

            known_websites.add(
                normalize_website(row["Website"])
            )

            known_emails.add(
                normalize_text(row["Email"])
            )

    return (
        known_companies,
        known_websites,
        known_emails
    )

# =====================================================
# NEXT BATCH NUMBER
# =====================================================

def get_next_batch():

    with open(
        MASTER_DATABASE,
        newline="",
        encoding="utf-8"
    ) as f:

        reader = csv.DictReader(f)

        batches = []

        for row in reader:

            batch = row.get("Batch", "")

            if batch.startswith(BATCH_PREFIX):

                try:

                    batches.append(
                        int(
                            batch.replace(
                                BATCH_PREFIX,
                                ""
                            )
                        )
                    )

                except:
                    pass

    if len(batches) == 0:

        return f"{BATCH_PREFIX}001"

    return f"{BATCH_PREFIX}{max(batches)+1:03d}"


# =====================================================
# UPDATE MASTER DATABASE
# =====================================================

def update_master_database(clean_rows):

    batch = get_next_batch()

    today = datetime.now().strftime("%Y-%m-%d")

    with open(
        MASTER_DATABASE,
        "a",
        newline="",
        encoding="utf-8"
    ) as f:

        writer = csv.writer(f)

        for row in clean_rows:

            writer.writerow([

                row["Company"],

                row["Website"],

                row["Email"],

                row["City"],

                row["State"],

                today,

                batch,

                row["Status"],

                "",

                "NO",

                "NO",

                "",

                "",

                "",

                "",

                ""

            ])

    return batch

def main():

    create_master_database()

    (
        known_companies,
        known_websites,
        known_emails
    ) = load_master_database()

    if not os.path.exists(INPUT_FILE):

        print(f"\nInput file not found:\n{INPUT_FILE}")

        return

    with open(
        INPUT_FILE,
        newline="",
        encoding="utf-8"
    ) as f:

        reader = csv.DictReader(f)

        rows = list(reader)

    email_column = find_email_column(reader.fieldnames)

    original = len(rows)

    no_email = 0

    invalid = 0

    duplicate_email = 0

    already_exists = 0

    seen = set()

    clean_rows = []

    for row in rows:

        email = normalize_text(
            row[email_column]
        )

        company_raw = row.get("Company name") or row.get("Company") or ""
        company = normalize_text(company_raw)

        website = normalize_website(
            row["Website"]
        )

        if email == "":

            no_email += 1

            continue

        if not EMAIL_REGEX.match(email):

            invalid += 1

            continue

        if email in seen:

            duplicate_email += 1

            continue

        seen.add(email)

        if company in known_companies:

            already_exists += 1

            continue

        if website in known_websites:

            already_exists += 1

            continue

        if email in known_emails:

            already_exists += 1

            continue

        known_companies.add(company)

        known_websites.add(website)

        known_emails.add(email)

        clean_rows.append({

            "Company": (row.get("Company name") or row.get("Company") or "").strip(),

            "Website": row.get("Website", "").strip(),

            "Email": email,

            "City": row.get("City", "").strip(),

            "State": row.get("State", "").strip(),

            "Contact_Page": row.get("Contact page", "").strip(),

            "Managed_Properties": row.get(
                "Number of managed properties",
                ""
            ).strip(),

            "Status": "PENDING",

            "Sent_Date": "",

            "Reply_Status": "NO_REPLY",

            "Reply_Date": "",

            "Video_Status": "NOT_CREATED",

            "Video_Link": "",

            "Follow_Up": "NO",

            "Payment_Status": "NOT_PAID",

            "Notes": ""

        })

    fieldnames = [

        "Company",
        "Website",
        "Email",
        "City",
        "State",
        "Contact_Page",
        "Managed_Properties",

        "Status",
        "Sent_Date",

        "Reply_Status",
        "Reply_Date",

        "Video_Status",
        "Video_Link",

        "Follow_Up",

        "Payment_Status",

        "Notes"

    ]

    Path(OUTPUT_FOLDER).mkdir(
    parents=True,
    exist_ok=True
    )

    batch = update_master_database(clean_rows)

    output_file = (
        Path(OUTPUT_FOLDER)
        / f"altus_pipeline_{batch}.csv"
    )

    with open(
        output_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as f:

        writer = csv.DictWriter(
            f,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(clean_rows)

        print()
        print("=" * 60)
        print("ALTUS PIPELINE REPORT")
        print("=" * 60)

        print(f"Batch Created      : {batch}")
        print(f"Original Leads     : {original}")
        print(f"Without Email      : {no_email}")
        print(f"Invalid Emails     : {invalid}")
        print(f"Duplicate Emails   : {duplicate_email}")
        print(f"Already In Master  : {already_exists}")
        print(f"New Prospects      : {len(clean_rows)}")

        print()
        print("Pipeline Created:")
        print(output_file.resolve())

        print()
        print("Master Database:")
        print(MASTER_DATABASE)

        print("=" * 60)


if __name__ == "__main__":
    main()

