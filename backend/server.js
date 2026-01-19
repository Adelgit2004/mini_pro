import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Needed for serving React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === API ROUTES ===

// Health check
app.get("/api", (req, res) => {
  res.send("AI Voice Assistant Backend is running 🚀");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || message.split(/\s+/).length > 50) {
      return res.json({
        reply: "Please limit your input to fifty words.",
      });
    }

    const prompts = {
      en: "Reply in English with Indian tone.",
      hi: "हिंदी में उत्तर दें।",
      ta: "தமிழில் பதிலளிக்கவும்।",
      ml: "മലയാളത്തിൽ മറുപടി നൽകുക।",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompts[language] },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Server error. Please try again later.",
    });
  }
});

// === Serve React frontend ===
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


