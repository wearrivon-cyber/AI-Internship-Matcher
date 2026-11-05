import json
from pathlib import Path

DATA = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "internships.json"
)


def load_catalogue():
    print("Catalogue file location:", DATA)
    print("File exists:", DATA.exists())

    if not DATA.exists():
        return []

    with DATA.open("r", encoding="utf-8") as file:
        records = json.load(file)

    print("Catalogue records loaded:", len(records))

    return records