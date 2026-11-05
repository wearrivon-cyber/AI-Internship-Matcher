import re

from pathlib import Path


SKILLS = [

    "python",
    "java",
    "javascript",
    "typescript",
    "react",

    "html",
    "css",

    "sql",
    "mysql",
    "mongodb",

    "fastapi",
    "django",
    "flask",

    "machine learning",
    "deep learning",

    "data analysis",
    "pandas",
    "numpy",
    "scikit-learn",

    "tensorflow",
    "pytorch",

    "excel",
    "power bi",
    "tableau",

    "git",
    "github",

    "api",
    "node.js",
    "c++",

    "communication",
    "problem solving",
    "teamwork",

    "ui/ux",
    "figma",
    "aws"

]


def extract_text(path):

    ext = Path(path).suffix.lower()

    if ext == ".pdf":

        from pypdf import PdfReader

        reader = PdfReader(path)

        return "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    if ext == ".docx":

        from docx import Document

        document = Document(path)

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    if ext == ".txt":

        return Path(path).read_text(
            encoding="utf-8",
            errors="ignore"
        )

    raise ValueError(
        "Only PDF, DOCX and TXT are supported."
    )


def extract_skills(text):

    text = re.sub(
        r"\s+",
        " ",
        text.lower()
    )

    found = []

    for skill in SKILLS:

        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(skill)
            + r"(?![a-z0-9])"
        )

        if re.search(pattern, text):

            found.append(skill)

    return sorted(found)