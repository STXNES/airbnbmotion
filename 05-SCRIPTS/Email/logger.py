from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[2]

LOG_FOLDER = ROOT / "08-LOGS"

LOG_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)

LOG_FILE = LOG_FOLDER / "send_log.txt"


def log(company, email, status, message=""):

    with open(
        LOG_FILE,
        "a",
        encoding="utf-8"
    ) as f:

        f.write(
            f"[{datetime.now():%Y-%m-%d %H:%M:%S}] "
            f"{status} | "
            f"{company} | "
            f"{email} | "
            f"{message}\n"
        )