# GitHub and Deployment Guide

## GitHub Repository

Repository Name:
ai-internship-matcher

## Initial Git Setup

git init

git add .

git commit -m "Initial full-stack project"

git branch -M main

## Connect GitHub

git remote add origin https://github.com/YOUR-USERNAME/ai-internship-matcher.git

git push -u origin main

## Backend Deployment

Use a Python ASGI hosting service.

Start command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT

Set CORS_ORIGINS to the deployed frontend URL.

## Frontend Deployment

Build command:

npm run build

Output directory:

dist

Set VITE_API_URL to the deployed backend URL.

## Final Verification

Test the complete application using
the public deployment URL.

Do not submit an untested deployment link.