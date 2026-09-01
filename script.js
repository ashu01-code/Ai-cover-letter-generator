(function() {
    "use strict";

    const form = document.getElementById('coverForm');
    const nameInput = document.getElementById('name');
    const jobRoleInput = document.getElementById('jobRole');
    const companyInput = document.getElementById('company');
    const skillsInput = document.getElementById('skills');
    const toneSelect = document.getElementById('tone');
    const resumeUpload = document.getElementById('resumeUpload');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const outputSection = document.getElementById('outputSection');
    const coverLetterDiv = document.getElementById('coverLetter');
    const copyBtn = document.getElementById('copyBtn');


    const API_KEY = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;


    async function callGeminiAPI(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API call failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }


    function buildPrompt(data) {
        const { name, jobRole, company, skills, tone } = data;
        
        let resumeText = '';
        if (data.resumeText) {
            resumeText = `\n\nAdditional context from candidate's resume:\n${data.resumeText}`;
        }

        return `You are an expert career coach and professional resume writer. 

Generate a ${tone} cover letter for ${name} applying for the ${jobRole} position at ${company}. 
The candidate has the following skills: ${skills}.

Requirements:
- Keep it concise (3-4 paragraphs)
- Show enthusiasm for the company
- Highlight relevant skills
- End with a professional closing
- Format with proper line breaks between paragraphs${resumeText}`;
    }


    function generateFallbackCoverLetter(data) {
        const { name, jobRole, company, skills, tone } = data;
        const toneMap = {
            professional: "I am writing to express my strong interest in the",
            enthusiastic: "I'm absolutely thrilled to apply for the",
            formal: "I hereby submit my application for the",
            confident: "I am confident in my ability to excel as a"
        };

        const opening = toneMap[tone] || toneMap.professional;
        const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);

        let skillsText = '';
        if (skillsList.length === 1) {
            skillsText = skillsList[0];
        } else if (skillsList.length === 2) {
            skillsText = skillsList.join(' and ');
        } else if (skillsList.length > 2) {
            const last = skillsList.pop();
            skillsText = skillsList.join(', ') + ', and ' + last;
        }

        const closing = tone === 'formal'
            ? 'Yours sincerely,'
            : tone === 'enthusiastic'
            ? 'I look forward to the possibility of contributing to your team!'
            : tone === 'confident'
            ? 'I am eager to bring my expertise to your company.'
            : 'I look forward to discussing my application with you.';

        return `Dear Hiring Manager at ${company},

${opening} ${jobRole} position at ${company}. With a strong background in ${skillsText}, I am confident that my skills align perfectly with the requirements of this role.

Throughout my career, I have developed expertise in ${skillsText}, allowing me to deliver impactful results in fast-paced environments. I am particularly drawn to ${company} because of your commitment to innovation and excellence, and I would be honored to contribute to your continued success.

${closing}

${name}`;
    }


    async function generateWithAI(data) {
        try {
            const prompt = buildPrompt(data);
            const result = await callGeminiAPI(prompt);
            return result;
        } catch (error) {
            console.warn('API call failed, using fallback template:', error);
            return generateFallbackCoverLetter(data);
        }
    }


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const jobRole = jobRoleInput.value.trim();
        const company = companyInput.value.trim();
        const skills = skillsInput.value.trim();
        const tone = toneSelect.value;

        if (!name || !jobRole || !company || !skills) {
            alert('Please fill in all required fields (*).');
            return;
        }

        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        generateBtn.disabled = true;
        outputSection.classList.add('hidden');

        const data = { name, jobRole, company, skills, tone };

        
        if (resumeUpload.files && resumeUpload.files[0]) {
            const file = resumeUpload.files[0];
            if (file.type === 'application/pdf') {
                data.resumeText = '[Resume content would be extracted here]';
            }
        }

        try {
            const coverLetter = await generateWithAI(data);
            
            
            const paragraphs = coverLetter.split('\n\n').filter(p => p.trim() !== '');
            coverLetterDiv.innerHTML = paragraphs
                .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                .join('');

            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate cover letter. Please try again.');
        } finally {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    
    copyBtn.addEventListener('click', () => {
        const text = coverLetterDiv.textContent;
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                const original = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => { copyBtn.textContent = original; }, 2000);
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        try {
            textarea.select();
            document.execCommand('copy');
            const original = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => { copyBtn.textContent = original; }, 2000);
        } catch (e) {
            alert('Unable to copy. Please select and copy manually.');
        }
        document.body.removeChild(textarea);
    }
})();