import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const prompt = `You are a highly capable AI Assistant that summarizes complex text into clear, concise notes in Turkish.
      Read the following text and provide a summary. The summary should have:
      1. A short, concise introductory paragraph.
      2. A list of 3-5 key points (Önemli Noktalar), each being a short sentence.
      3. Automatically determine 1 to 2 relevant single-word tags (e.g. Teknoloji, Makale, İş, Toplantı, etc.).
      
      Respond in JSON format with the following structure:
      {
        "title": "A short, relevant title for the summary",
        "intro": "The introductory paragraph",
        "keyPoints": ["Point 1", "Point 2", "Point 3"],
        "tags": ["Tag1", "Tag2"],
        "readingTime": "estimated reading time in minutes (e.g. '3 dk okuma')"
      }
      
      Text to summarize:
      ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              intro: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              readingTime: { type: Type.STRING }
            },
            required: ["title", "intro", "keyPoints", "tags", "readingTime"]
          }
        }
      });

      const summaryStr = response.text || "{}";
      const summaryData = JSON.parse(summaryStr);
      res.json(summaryData);

    } catch (error) {
      console.error("Error summarizing:", error);
      res.status(500).json({ error: "Failed to summarize text" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
