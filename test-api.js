require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(genAI)).join(', '));

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  try {
    const result = await model.generateContent('Hello');
    console.log('✅ gemini-1.5-flash works:', result.response.text().substring(0, 50));
  } catch (err) {
    console.log('❌ gemini-1.5-flash:', err.message);
  }
  
  try {
    const model2 = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result2 = await model2.generateContent('Hello');
    console.log('✅ gemini-2.0-flash works:', result2.response.text().substring(0, 50));
  } catch (err) {
    console.log('❌ gemini-2.0-flash:', err.message);
  }
}

test();