import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  organization: process.env.OPEN_AI_ORG,
  apiKey: process.env.OPEN_AI_API_KEY,
});

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E!');
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt); // Debugging statement

    // Validate the prompt
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use the correct method for generating images
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3', // Explicitly specify the model, if desired
    });

    console.log('AI Response:', aiResponse); // Debugging statement

    // Check if the response contains the expected data
    if (aiResponse.data && aiResponse.data.length > 0) {
      const imageUrl = aiResponse.data[0].url;
      res.status(200).json({ photo: imageUrl });
    } else {
      res.status(400).json({ error: 'No image data returned from DALL·E' });
    }
  } catch (error) {
    console.error(error);

    // If an error message is available from the API response, use it
    const errorMessage = error?.response?.data?.error?.message || 'An error occurred';
    
    // Respond with the appropriate error message
    res.status(500).send(errorMessage);
  }
});

export default router;