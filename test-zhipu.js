require('dotenv').config();
const https = require('https');

const KEY = process.env.ZHIPU_API_KEY;

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
          const json = JSON.parse(data);
          resolve(`✅ Model ${modelName} works! Response: ${json.choices[0].message.content.substring(0, 50)}`);
        } else {
          resolve(`❌ Model ${modelName}: ${res.statusCode} -> ${data.substring(0, 80)}`);
        }
      });
    });
    req.on('error', err => resolve(`❌ Model ${modelName}: ${err.message}`));
    req.write(body);
    req.end();
  });
}

(async () => {
  const models = ["glm-4", "glm-4-plus", "glm-4-flash", "glm-3-turbo"];
  for (const m of models) {
    console.log(await testModelName(m));
  }
})();