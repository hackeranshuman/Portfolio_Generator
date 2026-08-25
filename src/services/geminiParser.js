/**
 * Google Gemini AI Resume Parser Service
 * Extracts and structures resume details from raw text / txt files into portfolio JSON schema.
 * Features automatic multi-model fallback (gemini-2.0-flash, gemini-1.5-flash-latest, gemini-1.5-flash, gemini-pro)
 */

// Preferred models in fallback order
const CANDIDATE_ENDPOINTS = [
  { version: 'v1beta', model: 'gemini-3.6-flash' },
  { version: 'v1beta', model: 'gemini-3.5-flash' },
  { version: 'v1beta', model: 'gemini-2.5-flash' },
  { version: 'v1beta', model: 'gemini-1.5-flash-latest' },
  { version: 'v1beta', model: 'gemini-2.0-flash' },
  { version: 'v1beta', model: 'gemini-1.5-flash' },
  { version: 'v1', model: 'gemini-1.5-flash' },
  { version: 'v1beta', model: 'gemini-2.5-pro' },
  { version: 'v1beta', model: 'gemini-1.5-pro-latest' },
  { version: 'v1beta', model: 'gemini-1.5-pro' },
  { version: 'v1beta', model: 'gemini-pro' }
];

let cachedWorkingEndpoint = null;

/**
 * Get stored Gemini API Key from localStorage or environment variables.
 */
export const getGeminiApiKey = () => {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
};

/**
 * Save Gemini API Key to localStorage.
 */
export const setGeminiApiKey = (key) => {
  const trimmedKey = (key || '').trim();
  if (trimmedKey) {
    localStorage.setItem('gemini_api_key', trimmedKey);
  } else {
    localStorage.removeItem('gemini_api_key');
  }
};

/**
 * Helper to call Gemini API with automatic model fallback.
 * @param {Object} payload - The request payload
 * @param {string} key - The Gemini API key
 * @returns {Promise<string>} The generated text content
 */
export const callGeminiGenerate = async (payload, key) => {
  const endpointsToTry = cachedWorkingEndpoint
    ? [cachedWorkingEndpoint, ...CANDIDATE_ENDPOINTS.filter(e => e.model !== cachedWorkingEndpoint.model || e.version !== cachedWorkingEndpoint.version)]
    : CANDIDATE_ENDPOINTS;

  let lastError = null;

  for (const ep of endpointsToTry) {
    const url = `https://generativelanguage.googleapis.com/${ep.version}/models/${ep.model}:generateContent?key=${key}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          cachedWorkingEndpoint = ep; // Cache working model for future calls
          return text;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData?.error?.message || `Status ${response.status}`;

      // If invalid API key or quota exceeded, don't try other models
      if (response.status === 400 && errMsg.toLowerCase().includes('api key not valid')) {
        throw new Error(`Invalid Gemini API Key: ${errMsg}. Please check your API key.`);
      }
      if (response.status === 429) {
        throw new Error('Gemini API quota/rate limit reached. Please wait a few moments.');
      }

      // If model not found / not supported, continue loop to try next candidate
      lastError = new Error(errMsg);
      console.warn(`Gemini model '${ep.model}' (${ep.version}) failed:`, errMsg, '— Trying next fallback model...');
    } catch (fetchErr) {
      if (fetchErr.message.includes('Invalid Gemini API Key') || fetchErr.message.includes('quota/rate limit')) {
        throw fetchErr;
      }
      lastError = fetchErr;
    }
  }

  throw new Error(`Gemini API Error: ${lastError?.message || 'All candidate models failed. Please check your API key and permissions in Google AI Studio.'}`);
};

/**
 * Parse resume text into structured portfolio data using Gemini API.
 * @param {string} resumeText - Raw text content from .txt file or pasted resume
 * @param {string} [apiKey] - Optional Gemini API key override
 * @returns {Promise<Object>} Structured portfolio resume object
 */
export const parseResumeWithGemini = async (resumeText, apiKey = null) => {
  const key = (apiKey || getGeminiApiKey()).trim();

  if (!key || key === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key is missing. Please provide your Gemini API key in the settings or modal.');
  }

  if (!resumeText || resumeText.trim().length < 10) {
    throw new Error('Resume content is too short. Please provide a detailed resume text or .txt file.');
  }

  const systemPrompt = `You are an elite AI portfolio & resume architect. Your job is to extract, clean, and enrich resume details from the provided raw text and return a strictly structured JSON object for a web portfolio.

Format your response as a valid JSON object with EXACTLY this structure (no markdown fences, no explanatory text, just pure JSON):
{
  "title": "A concise title, e.g., 'Full Stack Engineer Portfolio' or '[Full Name]'s Portfolio'",
  "personal_info": {
    "full_name": "Full Name",
    "email": "Email address or empty string",
    "phone": "Phone number or empty string",
    "location": "City, State / Country or empty string",
    "linkedin": "LinkedIn URL or username or empty string",
    "website": "Personal portfolio URL or GitHub or empty string",
    "profession": "Primary job title / profession (e.g. Senior Software Engineer)",
    "image": null
  },
  "professional_summary": "An engaging, well-crafted 2-3 sentence professional bio highlighting core competencies and accomplishments.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "start_date": "YYYY-MM or Mon YYYY",
      "end_date": "YYYY-MM or Mon YYYY or Present",
      "description": "2-3 bullet points or sentences detailing achievements, tools used, and impact.",
      "is_current": false
    }
  ],
  "education": [
    {
      "institution": "University / College name",
      "degree": "Degree (e.g. B.S., B.Tech, M.S.)",
      "field": "Field of Study (e.g. Computer Science)",
      "graduation_date": "YYYY or YYYY-MM",
      "gpa": "GPA or empty string"
    }
  ],
  "project": [
    {
      "name": "Project Name",
      "type": "Project category (e.g. Web Application, Mobile App, AI System)",
      "description": "Concise description of the project, features, and technologies used."
    }
  ],
  "template": "modern",
  "accent_color": "#EC4899"
}

Guidelines:
1. Extract all realistic data present in the resume.
2. If fields like projects or summary are sparse, enhance and polish them professionally.
3. Suggest a fitting "template" from: "modern", "classic", "minimal-image", "minimal", "executive".
4. Suggest a fitting "accent_color" hex code (e.g. #EC4899, #3B82F6, #10B981, #6366F1, #8B5CF6, #F97316, #14B8A6).
5. Output ONLY the JSON object. Do not wrap in backticks or markdown if possible.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `Raw Resume Content:\n\n${resumeText}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40
    }
  };

  const rawOutput = await callGeminiGenerate(payload, key);

  if (!rawOutput) {
    throw new Error('Gemini API returned an empty response. Please try again.');
  }

  // Sanitize JSON string: remove markdown code blocks if any
  let jsonString = rawOutput.trim();
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  // Find first { and last } in case there is surrounding text
  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonString = jsonString.substring(firstBrace, lastBrace + 1);
  }

  let parsedData;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (parseErr) {
    console.error('Failed to parse Gemini output as JSON:', rawOutput);
    throw new Error('Could not parse AI response into portfolio format. Please try again or rephrase the text.');
  }

  // Normalize structure to ensure all required fields exist
  const newResumeId = 'resume_' + Date.now();
  const normalized = {
    _id: newResumeId,
    title: parsedData.title || (parsedData.personal_info?.full_name ? `${parsedData.personal_info.full_name}'s Portfolio` : 'AI Generated Portfolio'),
    personal_info: {
      full_name: parsedData.personal_info?.full_name || 'Your Name',
      email: parsedData.personal_info?.email || '',
      phone: parsedData.personal_info?.phone || '',
      location: parsedData.personal_info?.location || '',
      linkedin: parsedData.personal_info?.linkedin || '',
      website: parsedData.personal_info?.website || '',
      profession: parsedData.personal_info?.profession || 'Professional',
      image: null
    },
    professional_summary: parsedData.professional_summary || '',
    skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
    experience: Array.isArray(parsedData.experience)
      ? parsedData.experience.map((exp, i) => ({
          _id: `exp_${Date.now()}_${i}`,
          company: exp.company || '',
          position: exp.position || '',
          start_date: exp.start_date || '',
          end_date: exp.end_date || (exp.is_current ? 'Present' : ''),
          description: exp.description || '',
          is_current: exp.is_current || exp.end_date === 'Present' || false
        }))
      : [],
    education: Array.isArray(parsedData.education)
      ? parsedData.education.map((edu, i) => ({
          _id: `edu_${Date.now()}_${i}`,
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          graduation_date: edu.graduation_date || '',
          gpa: edu.gpa || ''
        }))
      : [],
    project: Array.isArray(parsedData.project)
      ? parsedData.project.map((proj, i) => ({
          _id: `proj_${Date.now()}_${i}`,
          name: proj.name || `Project ${i + 1}`,
          type: proj.type || 'Web Application',
          description: proj.description || ''
        }))
      : [],
    template: parsedData.template || 'modern',
    accent_color: parsedData.accent_color || '#EC4899',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  return normalized;
};

/**
 * Enhance a single field (summary, experience, project) with AI.
 */
export const enhanceFieldWithGemini = async (promptText, apiKey = null) => {
  const key = (apiKey || getGeminiApiKey()).trim();
  if (!key) throw new Error('Gemini API key is not configured.');

  const payload = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  return await callGeminiGenerate(payload, key);
};

/**
 * Sample resume text for instant 1-click testing
 */
export const SAMPLE_RESUME_TEXT = `Johnathan Doe
Full Stack Software Engineer
Email: john.doe.dev@example.com | Phone: +1 (555) 234-5678
Location: San Francisco, CA | LinkedIn: linkedin.com/in/johndoe-dev | GitHub: github.com/johndoe-dev

PROFESSIONAL SUMMARY
Innovative Full Stack Engineer with 5+ years of experience building highly scalable web applications, RESTful APIs, and cloud-native solutions. Proven track record in improving system performance by 40% and leading agile development teams to deliver user-centric software.

SKILLS
JavaScript, TypeScript, React.js, Next.js, Node.js, Express, Python, Django, PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2, Lambda), Git, Tailwind CSS, GraphQL

WORK EXPERIENCE
Senior Full Stack Engineer | Apex Cloud Solutions | 2022-03 - Present
- Designed and built a multi-tenant analytics dashboard in React & Node.js, reducing query response times by 35%.
- Led a team of 4 frontend engineers, migrating legacy codebase to Next.js 14 and Tailwind CSS.
- Implemented real-time collaboration features using WebSockets and Redis caching.

Software Engineer | BrightTech Labs | 2019-06 - 2022-02
- Developed responsive customer-facing web interfaces using React.js and Redux.
- Built automated CI/CD deployment pipelines using GitHub Actions and AWS EC2.
- Integrated Stripe payment processing and OAuth2 authentication for over 50,000 active users.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015-08 - 2019-05
GPA: 3.85 / 4.0

PROJECTS
- DevPulse - Real-time Developer Analytics Platform
A modern full-stack web application tracking repository activity and PR cycle times with automated AI summaries. Built with Next.js, FastAPI, and PostgreSQL.

- CloudSync - Distributed File Sharing Service
Secure end-to-end encrypted cloud storage tool featuring chunked file uploads and instant link sharing using Node.js and AWS S3.`;
