require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//Summarize Text
app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  try {
    const chat = model.startChat();
    const prompt = `Summarize this text:\n\n${text}`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (err) {
    console.error('Summarization error:', err);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

//Translate
app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const prompt = `Translate the following text to ${targetLang}:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    res.json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Generate Email
app.post('/generate-email', async (req, res) => {
  const { topic, tone } = req.body;
  try {
    const chat = model.startChat();
    const prompt = `Write a ${tone} email about: "${topic}"`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const email = response.text();

    res.json({ email });
  } catch (err) {
    console.error('Email generation error:', err);
    res.status(500).json({ error: 'Email generation failed' });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));