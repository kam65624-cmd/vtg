require('dotenv').config();
const https = require('https');

const KEY = process.env.GEMINI_API_KEY;

// Test direct REST call to v1beta
function testModel(modelId) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: "قل مرحباً" }] }]
    });
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${modelId}:generateContent?key=${KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          resolve(`✅ WORKS: ${json.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 40) || 'OK'}`);
        } else {
          resolve(`❌ ${res.statusCode}: ${data.slice(0, 80)}`);
        }
      });
    });
    req.on('error', (e) => resolve(`❌ Error: ${e.message}`));
    req.write(body);
    req.end();
  });
}

(async () => {
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.5-flash-preview-04-17", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
  for (const m of models) {
    process.stdout.write(`Testing ${m}... `);
    const result = await testModel(m);
    console.log(result);
  }
})();
