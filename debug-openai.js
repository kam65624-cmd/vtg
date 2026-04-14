require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  console.log('Testing GPT-4o-mini...');
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hi" }]
    });
    console.log('✅ Success:', response.choices[0].message.content);
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('Full error:', JSON.stringify(err, null, 2));
  }
}

test();