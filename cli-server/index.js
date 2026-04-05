#!/usr/bin/env node

import { exec } from 'child_process';
import chalk from 'chalk';

// 1. Capture the arguments
const args = process.argv.slice(2);
const action = args[0]; // e.g., 'save' or 'get'

// The URL where your Express server is listening
const API_URL = 'https://cli-assistant.onrender.com/api/snippets'; // Update this if your server URL changes

// 2. Main Logic Function
async function runBot() {
    if (!action) {
        console.log(chalk.yellow("⚠️ CLI Assistant: Please provide a command (e.g., bot get <alias>)"));
        return;
    }

    if (action === 'get') {
        const alias = args[1]; 
        
        if (!alias) {
            console.log(chalk.yellow("⚠️ You need to tell me what to get! (e.g., bot get react-init)"));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${alias}`);
            const data = await response.json();

            if (response.ok) {
                console.log(chalk.green(`\n✅ Found '${data.alias}':`));
                console.log(chalk.gray(`----------------------------------`));
                console.log(chalk.white(data.command));
                console.log(chalk.gray(`----------------------------------`));
                console.log(chalk.cyan(`Description: ${data.description}\n`));
            } else {
                console.log(chalk.red(`\n❌ ${data.error}\n`));
            }
        } catch (error) {
            console.log(chalk.red("❌ Could not connect to the Brain. Is your Express server running?"));
        }
    } 
    
    // --- NEW: THE 'SAVE' LOGIC ---
    else if (action === 'save') {
        const commandToSave = args[1];
        const asKeyword = args[2]; 
        const aliasToSave = args[3];

        if (!commandToSave || asKeyword !== 'as' || !aliasToSave) {
            console.log(chalk.yellow("⚠️ Oops! Format it like this: bot save \"<command>\" as \"<alias>\""));
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
                console.log(chalk.green(`\n✅ ${data.message}\n`)); // Prints the success message from Express
            } else {
                console.log(chalk.red(`\n❌ ${data.error}\n`));
            }
        } catch (error) {
            console.log(chalk.red("❌ Could not connect to the Brain."));
        }
    } 

    else if (action === 'ask') {
       
        const question = args.slice(1).join(" ");

        if (!question) {
            console.log(chalk.yellow("⚠️ What do you want to ask? (e.g., bot ask how to reverse an array)"));
            return;
        }

        console.log(chalk.cyan("🤔 Thinking...\n"));

        try {
            const response = await fetch(`https://cli-assistant.onrender.com/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: question })
            });
            
            const data = await response.json();

            if (response.ok) {
                console.log(chalk.cyan(`🤖 AI:\n${data.answer}\n`));
            } else {
                console.log(chalk.red(`\n❌ ${data.error}\n`));
            }
        } catch (error) {
            console.log(chalk.red(`❌ Connection Error: ${error.message}`));
        }
    }

    // --- NEW: THE 'RUN' LOGIC ---
    else if (action === 'run') {
        const alias = args[1]; 
        
        if (!alias) {
            console.log(chalk.yellow("⚠️ You need to tell me what to run! (e.g., bot run react-init)"));
            return;
        }

        try {
            console.log(chalk.cyan(`🔍 Fetching command for '${alias}'...`));
            const response = await fetch(`${API_URL}/${alias}`);
            const data = await response.json();

            if (response.ok) {
                console.log(chalk.yellow(`🚀 Executing: ${data.command}\n`));
                
                // This executes the command directly in your terminal
                exec(data.command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(chalk.red(`❌ Execution Failed: ${error.message}`));
                        return;
                    }
                    
                    // Print any standard output or errors from the command itself
                    if (stderr) console.error(chalk.yellow(stderr));
                    if (stdout) console.log(chalk.white(stdout));
                    
                    console.log(chalk.green(`\n✅ Finished running '${alias}'`));
                });
            } else {
                console.log(chalk.red(`\n❌ ${data.error}\n`));
            }
        } catch (error) {
            console.log(chalk.red("❌ Could not connect to the Brain. Is your Express server running?"));
        }
    }
    
    else {
        console.log(chalk.red(`❌ I don't know how to '${action}' yet!`));
    }
}

// 3. Execute the function
runBot();