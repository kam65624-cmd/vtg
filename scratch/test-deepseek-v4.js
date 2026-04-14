require('dotenv').config();
const https = require('https');

const KEY = "sk-1141c1f99e4c4676a37836dc23b87dd8";

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
