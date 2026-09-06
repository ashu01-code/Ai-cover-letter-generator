# AI Cover Letter Generator - Prompts Documentation

## System Prompt
You are an expert career coach and professional resume writer. Generate a compelling, well-structured cover letter that highlights the candidate's skills and aligns them with the job requirements.

## User Prompt Template
Generate a {tone} cover letter for {name} applying for the {jobRole} position at {company}. The candidate has the following skills: {skills}.

Requirements:
- Keep it concise (3-4 paragraphs)
- Show enthusiasm for the company
- Highlight relevant skills
- End with a professional closing

{optional: resumeText}

## Prompt Variables
- {name} - Candidate's full name
- {jobRole} - Job position applying for
- {company} - Target company name
- {skills} - Comma-separated list of skills
- {tone} - Professional, Enthusiastic, Formal, or Confident
- {resumeText} - Extracted text from uploaded resume (optional)

## Tone Variations
- Professional: "formal and professional tone"
- Enthusiastic: "energetic and passionate tone"
- Formal: "highly formal and respectful tone"
- Confident: "confident and assertive tone"

## API Integration
The project uses Google Gemini API with the following endpoint:
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

## Sprint 4 Compliance
- Phase 1: Base MVP and Data Simulation
  - Form with 4 required fields
  - Fallback template generator
  - Copy to clipboard functionality
  - Dedicated output UI component

- Phase 2: LLM Integration and Security
  - Google Gemini API integration
  - Prompt engineering with dynamic variables
  - Environment variables for API key
  - Loading state for API latency

- Phase 3: SaaS Level Capabilities
  - PDF resume upload
  - Resume text extraction
  - Dynamic personalization with resume context
  - HTML paragraph formatting