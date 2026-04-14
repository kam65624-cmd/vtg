require('dotenv').config();
const https = require('https');

const KEY = "sk-171585ad5d224f33ab718c1c40420e16";

function testModel(modelName) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: modelName,
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
        resolve(`[${modelName}] Status: ${res.statusCode}, Body: ${data}`);
      });
    });
    req.on('error', (e) => resolve(`[${modelName}] Error: ${e.message}`));
    req.write(body);
    req.end();
  });
}

(async () => {
  const models = ["deepseek-v3", "deepseek-r1", "qwen-max", "qwen-turbo"];
  for (const m of models) {
    console.log(await testModel(m));
  }
})();
