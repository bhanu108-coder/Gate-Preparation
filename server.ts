import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured. Please add your Google Gemini API Key in the Settings/Secrets panel.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Check API key status
  app.get('/api/gemini/status', (_req, res) => {
    res.json({
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 1. AI GATE Doubt Solver & Concept Clarifier
  app.post('/api/gemini/ask-doubt', async (req, res) => {
    try {
      const { prompt, context, lectureTitle, timestamp } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are a world-class GATE (Graduate Aptitude Test in Engineering) CS/IT Professor and academic mentor.
Your goal is to provide precise, rigorous, mathematically sound, and intuitive explanations for GATE aspirants.
Always emphasize:
1. Core conceptual insight & intuition
2. Standard GATE terminology & notation
3. Mathematical proof or step-by-step calculation where applicable
4. Common traps/misconceptions GATE examiners test
5. Direct high-yield formula recap.
Format using clean Markdown with bolding, lists, and LaTeX-style code blocks where appropriate. Keep responses concise and focused on high-yield GATE concepts.`;

      const userContent = `Context: ${context || 'General GATE CS preparation'}
Lecture: ${lectureTitle || 'N/A'} (Timestamp: ${timestamp || 'N/A'})

Student Question/Doubt:
${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userContent,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({
        answer: response.text || 'Unable to generate response from Gemini.',
      });
    } catch (error: any) {
      console.error('Error in /api/gemini/ask-doubt:', error);
      res.status(500).json({
        error: error.message || 'Failed to process AI doubt query',
      });
    }
  });

  // 2. AI Question Paper Digitization & PYQ Extraction
  app.post('/api/gemini/digitize-paper', async (req, res) => {
    try {
      const { textContent, subject, year } = req.body;
      const ai = getGeminiClient();

      const prompt = `Analyze the following GATE study text, previous year paper excerpt, or topic syllabus notes, and generate 2 to 3 high-quality authentic GATE-standard multiple-choice questions (MCQs).
For each question, provide:
- questionText: Clear GATE question statement with all necessary constraints
- options: Array of 4 distinct plausible options (A, B, C, D)
- correctOptionIndex: 0, 1, 2, or 3 corresponding to the correct option in the options array
- subject: Academic subject (e.g., "${subject || 'Computer Science'}")
- topic: Specific topic/concept tested
- difficulty: "Easy", "Medium", or "Hard"
- explanation: In-depth step-by-step solution showing mathematical derivation or rigorous proof
- formulaRecap: 1-2 line essential formula or key theorem to memorize for this problem

Input Content:
${textContent || `Generate GATE ${year || 2024} ${subject || 'Algorithms'} questions covering fundamental topics.`}

Return ONLY valid JSON matching this exact JSON schema:
{
  "questions": [
    {
      "subject": "string",
      "topic": "string",
      "difficulty": "Easy" | "Medium" | "Hard",
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctOptionIndex": 0,
      "explanation": "string",
      "formulaRecap": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '{"questions": []}';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/gemini/digitize-paper:', error);
      res.status(500).json({
        error: error.message || 'Failed to extract questions with Gemini',
      });
    }
  });

  // 3. AI Lecture Notes Summarizer & Formula Extractor
  app.post('/api/gemini/summarize-notes', async (req, res) => {
    try {
      const { lectureTitle, subject, module, existingNotes } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are a GATE topper producing concise revision cheat-sheets.
Summarize the key GATE examination formulas, theorems, time/space complexities, and critical edge cases for:
Lecture: ${lectureTitle}
Subject: ${subject}
Module: ${module}
Existing Student Notes: ${existingNotes || 'None'}

Provide:
1. High-Yield Summary (3-4 bullet points)
2. Core Formula Sheet & Complexities (table or list)
3. Top 3 GATE Traps to Avoid
Format with clean Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      res.json({
        summary: response.text || '',
      });
    } catch (error: any) {
      console.error('Error in /api/gemini/summarize-notes:', error);
      res.status(500).json({
        error: error.message || 'Failed to summarize lecture notes',
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GATE Mastery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
