require('dotenv').config();
const https = require('https');

const KEY = "sk-adc013b5b4cb48a5b8ebe4ffcdfae47d";

function testAlibaba() {
  const body = JSON.stringify({
    model: "qwen-turbo",
    messages: [{ role: "user", content: "Hi" }]
  });
  
  const options = {
    hostname: 'dashscope-intl.aliyuncs.com',
    path: '/compatible-mode/v1/chat/completions',
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
      console.log("Alibaba Status:", res.statusCode);
      console.log("Alibaba Response:", data);
    });
  });
  req.on('error', (e) => console.log("Alibaba Error:", e.message));
  req.write(body);
  req.end();
}

testAlibaba();
