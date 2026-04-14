require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const list = await genAI.listModels();
    console.log("--- Available Models ---");
    for (const model of list.models) {
      console.log(`${model.name} (supports: ${model.supportedGenerationMethods})`);
    }
  } catch (err) {
    console.error("Listing Error:", err.message);
  }
}

listModels();
