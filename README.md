# 🤖 Custom CLI Developer Assistant

A decoupled, full-stack Command Line Interface (CLI) tool designed to eliminate context-switching and accelerate developer workflows. Built with Node.js, Express, MongoDB, and Google's Gemini AI.

## 🚀 The Problem it Solves
As a developer, constantly leaving the terminal to Google boilerplate setups, search Stack Overflow, or dig through old projects for reusable code completely breaks mental flow. 

I built this tool to bring my most-used snippets and an AI assistant directly into my terminal using a custom, globally accessible `bot` command.

## 🏗️ Architecture
This project uses a decoupled Client/Server architecture:
* **The Client (Walkie-Talkie):** A Node.js CLI tool that taps into the operating system's PATH. It parses raw terminal arguments and sends HTTP requests.
* **The Server (Brain):** A local Node.js/Express REST API that securely handles data routing, database connections, and AI API keys.
* **The Vault:** A MongoDB Atlas cloud database for persistent storage of code snippets.
* **The Genius:** Integration with the `@google/generative-ai` SDK for natural language coding assistance.

## ✨ Features & Commands

### 1. Save Snippets to the Vault
Save complex setups or boilerplate code instantly from the terminal.
```bash
bot save "npm create vite@latest . -- --template react-ts" as "react-ts"
```

### 2. Retrieve Snippets
Fetch your custom code whenever you need it without opening a browser.
```bash
bot get react-ts
```

### 3. AI Developer Agent
Ask natural language questions directly in your terminal.
```bash
bot ask how do I reverse an array in javascript?
```

## 🛠️ Tech Stack
* **JavaScript / Node.js**
* **Express.js** (REST API)
* **MongoDB & Mongoose** (Database)
* **Google Gemini API** (AI Integration)
* **Git & GitHub**

## 💻 Local Installation

**1. Clone the repository**
```bash
git clone [Insert Your Repo Link Here]
```

**2. Setup the Brain (Server)**
```bash
cd api-server
npm install
```
*Create a `.env` file in the `api-server` directory and add your keys:*
```env
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
```
*Start the server:*
```bash
node server.js
```

**3. Setup the Client (CLI)**
Open a new terminal window:
```bash
cd cli-client
npm install -g .
```
*You can now use the `bot` command globally from any directory on your machine!*
