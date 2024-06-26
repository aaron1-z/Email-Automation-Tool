import { openai } from '../openai/openaiClient';

// Function to categorize an email based on its content
export const categorizeEmail = async (emailText: string): Promise<string> => {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Categorize the following email: ${emailText}\nCategories: Interested, Not Interested, More Information`,
      max_tokens: 10,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].text.trim();
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error('Error categorizing email:', error);
    throw error;
  }
};

// Function to generate a reply based on an email
export const generateReply = async (emailText: string): Promise<string> => {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Generate a reply for the following email: ${emailText}`,
      max_tokens: 150,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].text.trim();
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
};
