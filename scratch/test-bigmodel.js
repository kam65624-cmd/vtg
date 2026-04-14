require('dotenv').config();
const https = require('https');

const KEY = "sk-adc013b5b4cb48a5b8ebe4ffcdfae47d";

function testBigModel() {
  const body = JSON.stringify({
    model: "glm-4-flash",
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'open.bigmodel.cn',
    path: '/api/paas/v4/chat/completions',
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
      console.log("BigModel Status:", res.statusCode);
      console.log("BigModel Response:", data);
    });
  });
  req.on('error', (e) => console.log("BigModel Error:", e.message));
  req.write(body);
  req.end();
}

testBigModel();
