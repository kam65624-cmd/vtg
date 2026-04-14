require('dotenv').config();
const https = require('https');

const KEY = "sk-adc013b5b4cb48a5b8ebe4ffcdfae47d";

function testDeepSeek() {
  const body = JSON.stringify({
    model: "deepseek-chat",
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'api.deepseek.com',
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
      console.log("DeepSeek Status:", res.statusCode);
      console.log("DeepSeek Response:", data);
    });
  });
  req.on('error', (e) => console.log("DeepSeek Error:", e.message));
  req.write(body);
  req.end();
}

testDeepSeek();
