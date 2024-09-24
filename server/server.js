import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const configuration = {
    apiKey: process.env.OPEN_AI_KEY
};

const openai = new OpenAI(configuration);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello from upgpt-next!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).json({
        bot: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong' });
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));