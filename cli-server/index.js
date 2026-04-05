#!/usr/bin/env node

const {exec} = require('child_process');

// 1. Capture the arguments
const args = process.argv.slice(2);
const action = args[0]; // e.g., 'save' or 'get'

// The URL where your Express server is listening
const API_URL = 'https://cli-assistant.onrender.com/api/snippets'; // Update this if your server URL changes

// 2. Main Logic Function
async function runBot() {
    if (!action) {
        console.log(" CLI Assistant: Please provide a command (e.g., bot get <alias>)");
        return;
    }

    if (action === 'get') {
        const alias = args[1]; 
        
        if (!alias) {
            console.log(" You need to tell me what to get! (e.g., bot get react-init)");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${alias}`);
            const data = await response.json();

            if (response.ok) {
                console.log(`\n Found '${data.alias}':`);
                console.log(`----------------------------------`);
                console.log(data.command);
                console.log(`----------------------------------`);
                console.log(`Description: ${data.description}\n`);
            } else {
                console.log(`\n${data.error}\n`);
            }
        } catch (error) {
            console.log(" Could not connect to the Brain. Is your Express server running?");
        }
    } 
    
    // --- NEW: THE 'SAVE' LOGIC ---
    else if (action === 'save') {
        const commandToSave = args[1];
        const asKeyword = args[2]; 
        const aliasToSave = args[3];

        if (!commandToSave || asKeyword !== 'as' || !aliasToSave) {
            console.log(" Oops! Format it like this: bot save \"<command>\" as \"<alias>\"");
            return;
        }

        try {
            // Send a POST request with the new data
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alias: aliasToSave,
                    command: commandToSave,
                    description: "Saved instantly from the terminal!"
                })
            });
            
            const data = await response.json();

            if (response.ok) {
                console.log(`\n${data.message}\n`); // Prints the success message from Express
            } else {
                console.log(`\n${data.error}\n`);
            }
        } catch (error) {
            console.log(" Could not connect to the Brain.");
        }
    } 

    else if (action === 'ask') {
       
        const question = args.slice(1).join(" ");

        if (!question) {
            console.log("⚠️ What do you want to ask? (e.g., bot ask how to reverse an array)");
            return;
        }

        console.log("🤔 Thinking...\n");

        try {
            const response = await fetch(`http://127.0.0.1:3000/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: question })
            });
            
            const data = await response.json();

            if (response.ok) {
                console.log(`🤖 AI:\n${data.answer}\n`);
            } else {
                console.log(`\n${data.error}\n`);
            }
        } catch (error) {
            console.log("❌ Connection Error:", error.message);
        }
    }

    // --- NEW: THE 'RUN' LOGIC ---
    else if (action === 'run') {
        const alias = args[1]; 
        
        if (!alias) {
            console.log("⚠️ You need to tell me what to run! (e.g., bot run react-init)");
            return;
        }

        try {
            console.log(`🔍 Fetching command for '${alias}'...`);
            const response = await fetch(`${API_URL}/${alias}`);
            const data = await response.json();

            if (response.ok) {
                console.log(`🚀 Executing: ${data.command}\n`);
                
                // This executes the command directly in your terminal
                exec(data.command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Execution Failed: ${error.message}`);
                        return;
                    }
                    
                    // Print any standard output or errors from the command itself
                    if (stderr) console.error(stderr);
                    if (stdout) console.log(stdout);
                    
                    console.log(`\n✅ Finished running '${alias}'`);
                });
            } else {
                console.log(`\n${data.error}\n`);
            }
        } catch (error) {
            console.log("❌ Could not connect to the Brain. Is your Express server running?");
        }
    }
    
    else {
        console.log(` I don't know how to '${action}' yet!`);
    }
}

// 3. Execute the function
runBot();