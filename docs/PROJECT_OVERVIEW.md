# AI Internship Matcher — TalentPath

## Project Purpose

AI Internship Matcher is a full-stack web application
designed to help students discover internship programmes
based on their skills, education and career interests.

## Problem Statement

Students often struggle to identify internships that
match their existing technical skills and experience.

## Proposed Solution

The application provides:

- CV upload and parsing
- Manual student profile input
- Technical skill extraction
- Internship matching
- Skill-gap analysis
- Eligibility checks
- Internship catalogue

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios

### Backend
- Python
- FastAPI
- Pydantic

### Database
- SQLite
- JSON programme catalogue

### Document Processing
- PyPDF
- Python-docx

## Matching Methodology

The matching engine uses a transparent
rule-based scoring method.

- 80% required skill coverage
- 20% interest overlap

Education and programme active status
are separate eligibility filters.

## Architecture

React Frontend
        |
        v
FastAPI REST API
        |
        v
CV Parser and Matching Engine
        |
        v
SQLite Database and JSON Catalogue

## Limitations

- CV parsing uses keyword-based extraction.
- Scanned PDFs requiring OCR are not supported.
- The included internship catalogue contains
  illustrative records for testing.
- Matching scores are heuristic indicators,
  not probabilities of selection.

## Future Improvements

- Verified live internship catalogue
- OCR integration
- User authentication
- PostgreSQL database
- Admin dashboard
- Advanced semantic matching