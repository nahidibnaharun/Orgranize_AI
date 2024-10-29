// server.js
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000; // Use Vercel's provided port if available

// Access API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

// ... rest of your server.js code 

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// New route to handle AI request
app.get('/api/process', async (req, res) => {
    const { input } = req.query;
    try {
        const prompt = `Parse this schedule: ${input}`;
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error in API call:", error);
        res.status(500).json({ error: 'Failed to process input' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
