require('dotenv').config();
const https = require('https');

const KEY = "9855fde9415e47938583ace9c16d2030.dQZN1B5xVaLR3qYB";

function testZhipu(endpointHost, endpointPath) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: "glm-4-flash", // Zhipu's free/fast model
      messages: [{ role: "user", content: "Hello" }]
    });

    const options = {
      hostname: endpointHost,
      path: endpointPath,
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
        resolve(`[${endpointHost}] ${res.statusCode}: ${data}`);
      });
    });
    req.on('error', (e) => resolve(`[${endpointHost}] Error: ${e.message}`));
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log("Testing Zhipu AI / Z.ai Endpoints...");
  // Test Zhipu AI Chinese Endpoint
  console.log(await testZhipu('open.bigmodel.cn', '/api/paas/v4/chat/completions'));
  // Test common OpenAI-compatible proxies just in case
  console.log(await testZhipu('api.zhipuai.cn', '/v1/chat/completions'));
})();
