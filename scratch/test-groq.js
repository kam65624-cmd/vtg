require('dotenv').config();
const https = require('https');

const KEY = "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";

function testGroq() {
  const body = JSON.stringify({
    model: "llama-3.3-70b-versatile", // One of Groq's fast models
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log("Groq Status:", res.statusCode);
      console.log("Groq Response:", data);
    });
  });
  req.on('error', (e) => console.log("Groq Error:", e.message));
  req.write(body);
  req.end();
}

testGroq();
