import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, language } = req.body;

  if (!message || message.split(/\s+/).length > 50) {
    return res.json({ reply: "Limit exceeded (50 words max)." });
  }

  const prompts = {
    en: "Reply in English with Indian tone",
    hi: "हिंदी में उत्तर दें",
    ta: "தமிழில் பதிலளிக்கவும்",
    ml: "മലയാളത്തിൽ മറുപടി നൽകുക",
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompts[language] },
      { role: "user", content: message },
    ],
  });

  res.json({ reply: response.choices[0].message.content });
});

app.listen(process.env.PORT || 5000);
