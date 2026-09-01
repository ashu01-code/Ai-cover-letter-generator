# AI Cover Letter Generator

A SaaS utility that generates professional cover letters using Google Gemini API. Built as part of Sprint 4 - Phase 2 Foundation Projects.

## Features

- Dynamic form inputs (Name, Job Role, Company, Skills)
- Google Gemini API integration
- Prompt engineering with tone variations
- "Generating..." loading state
- Copy to clipboard
- PDF resume upload support
- Fallback template (if API fails)
- Fully responsive design
 Secure API key management

## Tech Stack

- HTML5
- CSS3 (Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Google Gemini API

## Setup Instructions

1. Clone the repository
2. Open `index.html` in your browser
3. Fill in the form
4. Click "Generate Cover Letter"
5. Copy the generated cover letter

## API Key

This project uses Google Gemini API. The API key is hardcoded in `script.js` for demo purposes. In production, use `.env` file.

## Project Structure
-> index.html # Main HTML structure
-> style.css # Responsive styling
-> script.js # Core logic + API integration
-> prompt.md # Prompt engineering documentation
-> .gitignore # Ignored files
-> README.md # Project documentation

