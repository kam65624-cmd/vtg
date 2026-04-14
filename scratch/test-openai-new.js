require('dotenv').config();
const https = require('https');

const KEY = "sk-adc013b5b4cb48a5b8ebe4ffcdfae47d";

function testOpenAI() {
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
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
      console.log("OpenAI Status:", res.statusCode);
      console.log("OpenAI Response:", data);
    });
  });
  req.on('error', (e) => console.log("OpenAI Error:", e.message));
  req.write(body);
  req.end();
}

testOpenAI();
