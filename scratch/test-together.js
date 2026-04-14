require('dotenv').config();
const https = require('https');

const KEY = "sk-adc013b5b4cb48a5b8ebe4ffcdfae47d";

function testTogether() {
  const body = JSON.stringify({
    model: "togethercomputer/llama-2-7b-chat",
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'api.together.xyz',
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
      console.log("Together Status:", res.statusCode);
      console.log("Together Response:", data);
    });
  });
  req.on('error', (e) => console.log("Together Error:", e.message));
  req.write(body);
  req.end();
}

testTogether();
