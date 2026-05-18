import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Recipe Suggestion Endpoint
  app.post("/api/recipes/suggest", async (req, res) => {
    try {
      const { ingredients } = req.body;
      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients array is required" });
      }

      const prompt = `Suggest a creative and delicious recipe that uses these ingredients: ${ingredients.join(", ")}. Provide the recipe title, a brief description, a list of ingredients (including common pantry staples), and step-by-step instructions. Return the response in JSON format with keys: title, description, ingredients, instructions.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = result.text || "";
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "AI generation failed" });
    }
  });

  // Handle Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
