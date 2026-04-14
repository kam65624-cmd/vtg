require('dotenv').config();
const https = require('https');

const KEY = process.env.GEMINI_API_KEY;

function testV1() {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: "Hi" }] }]
  });
  
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log("V1 Status:", res.statusCode);
      console.log("V1 Response:", data);
    });
  });
  req.write(body);
  req.end();
}

testV1();
