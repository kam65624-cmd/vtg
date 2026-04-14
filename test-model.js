require('dotenv').config();
const https = require('https');

const KEY = "9855fde9415e47938583ace9c16d2030.dQZN1B5xVaLR3qYB";

function testModelName(modelName) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: modelName,
      messages: [{ role: "user", content: "Hi" }]
    });

    const options = {
      hostname: 'open.bigmodel.cn',
      path: '/api/paas/v4/chat/completions',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(`✅ Model ${modelName} works!`);
        } else {
          resolve(`❌ Model ${modelName}: ${res.statusCode} -> ${data.substring(0, 80)}`);
        }
      });
    });
    req.write(body);
    req.end();
  });
}

(async () => {
  const models = ["glm-4", "glm-4-plus", "glm-3-turbo", "gpt-4", "gpt-3.5-turbo"];
  for (const m of models) {
    console.log(await testModelName(m));
  }
})();
