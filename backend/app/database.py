import os
import sqlite3

from pathlib import Path


DB_PATH = Path(
    os.getenv(
        "DATABASE_PATH",
        Path(__file__).resolve().parents[1] / "matcher.db"
    )
)


def connect():

    DB_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    con = sqlite3.connect(DB_PATH)

    con.row_factory = sqlite3.Row

    return con


def init_db():

    with connect() as con:

        con.execute("""
            CREATE TABLE IF NOT EXISTS profiles (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                name TEXT NOT NULL DEFAULT '',

                email TEXT NOT NULL DEFAULT '',

                education TEXT NOT NULL DEFAULT '',

                experience TEXT NOT NULL DEFAULT '',

                skills_json TEXT NOT NULL DEFAULT '[]',

                interests_json TEXT NOT NULL DEFAULT '[]',

                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP

            )
        """)

        con.commit()