# TalentPath — AI Internship Matcher

A full-stack web application that helps students
discover internship opportunities based on their
skills, education and career interests.

## Features

- CV Upload and Parsing
- Manual Skills Input
- Student Profile Management
- Internship Matching Engine
- Skill Gap Analysis
- Eligibility Filtering
- Internship Catalogue
- Responsive Dashboard

## Technology Stack

Frontend:
React, Vite, JavaScript, CSS

Backend:
Python, FastAPI

Database:
SQLite

Document Processing:
PyPDF, Python-docx

## Matching Algorithm

The system calculates a transparent alignment score:

80% Required Skill Coverage
20% Interest Overlap

Eligibility requirements are checked separately.

## Installation

### Backend

cd backend

py -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000

### Frontend

cd frontend

npm install

npm run dev

## API Documentation

http://127.0.0.1:8000/docs

## Project Documentation

See the docs folder for:

- Project Overview
- Presentation Outline
- Testing Checklist
- GitHub and Deployment Guide

## Important

The included catalogue contains illustrative
testing records, not verified live vacancies.

Replace them with verified official programmes
before submitting the final application.

## Author

Developed as an AI & ML Internship Project.