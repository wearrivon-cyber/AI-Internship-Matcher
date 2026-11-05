import json
import os
import tempfile

from pathlib import Path

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from .database import init_db, connect

from .schemas import (
    ProfileInput,
    MatchRequest
)

from .catalogue import load_catalogue

from .parser import (
    extract_text,
    extract_skills
)

from .matcher import rank_programs


app = FastAPI(
    title="AI Internship Matcher API",
    version="1.0.0"
)


# CORS: Allow the Vite frontend on ports 5173 and 5174
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {
        "name": "AI Internship Matcher API",
        "docs": "/docs"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/catalogue")
def catalogue():
    return load_catalogue()


@app.post("/api/profiles")
def save_profile(profile: ProfileInput):

    with connect() as con:

        cursor = con.execute(
            """
            INSERT INTO profiles
            (
                name,
                email,
                education,
                experience,
                skills_json,
                interests_json
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                profile.name,
                profile.email,
                profile.education,
                profile.experience,
                json.dumps(profile.skills),
                json.dumps(profile.interests)
            )
        )

        con.commit()

        return {
            "id": cursor.lastrowid,
            **profile.model_dump()
        }


@app.get("/api/profiles/{pid}")
def get_profile(pid: int):

    with connect() as con:

        row = con.execute(
            "SELECT * FROM profiles WHERE id = ?",
            (pid,)
        ).fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    data = dict(row)

    data["skills"] = json.loads(
        data.pop("skills_json")
    )

    data["interests"] = json.loads(
        data.pop("interests_json")
    )

    return data


@app.post("/api/parse-cv")
async def parse_cv(file: UploadFile = File(...)):

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if extension not in {
        ".pdf",
        ".docx",
        ".txt"
    }:
        raise HTTPException(
            status_code=400,
            detail="Upload PDF, DOCX or TXT."
        )

    data = await file.read()

    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Maximum file size is 5 MB."
        )

    path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_file.write(data)
            path = temp_file.name

        text = extract_text(path)

        if not text.strip():
            raise HTTPException(
                status_code=422,
                detail=(
                    "No readable text found; "
                    "try a text PDF or enter skills manually."
                )
            )

        return {
            "filename": file.filename,
            "skills": extract_skills(text),
            "extracted_text_preview": text[:2000]
        }

    finally:

        if path and os.path.exists(path):
            os.remove(path)


@app.post("/api/matches")
def matches(request: MatchRequest):

    profile = {
        "skills": request.skills,
        "interests": request.interests,
        "education": request.education
    }

    results = rank_programs(
        profile,
        load_catalogue()
    )

    return {
        "count": len(results),
        "matches": results[:10],
        "method": (
            "80% required-skill coverage + "
            "20% interest-tag overlap; "
            "education and active status are eligibility filters."
        )
    }