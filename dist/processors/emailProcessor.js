"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReply = exports.categorizeEmail = void 0;
const openaiClient_1 = require("../openai/openaiClient");
// Function to categorize an email based on its content
const categorizeEmail = async (emailText) => {
    try {
        const response = await openaiClient_1.openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Categorize the following email: ${emailText}\nCategories: Interested, Not Interested, More Information`,
            max_tokens: 10,
        });
        if (response.choices && response.choices.length > 0) {
            return response.choices[0].text.trim();
        }
        else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    }
    catch (error) {
        console.error('Error categorizing email:', error);
        throw error;
    }
};
exports.categorizeEmail = categorizeEmail;
// Function to generate a reply based on an email
const generateReply = async (emailText) => {
    try {
        const response = await openaiClient_1.openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Generate a reply for the following email: ${emailText}`,
            max_tokens: 150,
        });
        if (response.choices && response.choices.length > 0) {
            return response.choices[0].text.trim();
        }
        else {
            throw new Error('Unexpected response format from OpenAI API');
        }
    }
    catch (error) {
        console.error('Error generating reply:', error);
        throw error;
    }
};
exports.generateReply = generateReply;
