const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const OpenAI = require("openai");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database("./taglines.db");
db.run("CREATE TABLE IF NOT EXISTS taglines (id INTEGER PRIMARY KEY, product TEXT, tagline TEXT)");

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /tagline
app.post("/tagline", async (req, res) => {
  const { name, description, audience, tone, count } = req.body;

  try {
    const prompt = `Suggest ${count} catchy marketing taglines for the following product.
    Name: ${name}
    Description: ${description}
    Target Audience: ${audience}
    Tone: ${tone}
    Return only the taglines as a list.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;
    const taglines = text.split("\n").filter(t => t.trim() !== "");

    // Save to DB
    taglines.forEach(t => {
      db.run("INSERT INTO taglines (product, tagline) VALUES (?, ?)", [name, t]);
    });

    res.json({ taglines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate taglines" });
  }
});

// GET /history
app.get("/history", (req, res) => {
  db.all("SELECT * FROM taglines ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
