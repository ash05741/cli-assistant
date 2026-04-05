require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Snippet = require('./models/Snippet');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const app = express();

// --- THE RENDER FIX IS HERE ---
// Render will inject its own port into process.env.PORT. 
// If it doesn't exist (like on your local machine), it falls back to 3000.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log('✅ Connected to MongoDB Vault'))
    .catch((err)=> console.error('❌ MongoDB connection error:',err))
    
app.get('/health', (req, res) => {
    res.json({status: "success", message: "API server is awake"});
}); 

// --- THE DOORS (API ROUTES) ---

// 1. POST Route: Save a new command to the vault
app.post('/api/snippets', async (req, res) => {
    try {
        const { alias, command, description } = req.body;
        const newSnippet = new Snippet({ alias, command, description });
        
        await newSnippet.save();
        res.status(201).json({ message: `✅ Snippet '${alias}' saved successfully!`, data: newSnippet });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "⚠️ An alias with this name already exists in your vault!" });
        }
        res.status(500).json({ error: "Server error while saving snippet." });
    }
});

// 2. GET Route: Retrieve a command by its alias
app.get('/api/snippets/:alias', async (req, res) => {
    try {
        const snippet = await Snippet.findOne({ alias: req.params.alias });

        if (!snippet) {
            return res.status(404).json({ error: `⚠️ Snippet '${req.params.alias}' not found in the vault.` });
        }
        res.status(200).json(snippet);

    } catch (error) {
        res.status(500).json({ error: "Server error while fetching snippet." });
    }
});

app.post('/ask', async (req, res) => {
    try {
        const userQuestion = req.body.question;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a helpful CLI developer assistant. Answer this question concisely with code if applicable: ${userQuestion}`;

        const result = await model.generateContent(prompt);
        const aiResponse = await result.response.text();
      
        res.json({ answer: aiResponse });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "My AI brain just short-circuited." });
    }
});

// --- UPDATED LISTENER ---
app.listen(PORT, () => {
    console.log(`🧠 Brain is running on port ${PORT}`);
});