const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true,
        unique: true, // This ensures you don't accidentally save two different commands with the same name
        trim: true
    },
    command: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description provided."
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model('Snippet', snippetSchema);