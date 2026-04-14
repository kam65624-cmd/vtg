require('dotenv').config();
const https = require('https');

const KEY = "sk-1141c1f99e4c4676a37836dc23b87dd8";

function testAlibaba(host) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: "qwen-plus",
      messages: [{ role: "user", content: "Hi" }]
    });
    
    const options = {
      hostname: host,
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
        resolve(`[${host}] Status: ${res.statusCode}, Body: ${data}`);
      });
    });
    req.on('error', (e) => resolve(`[${host}] Error: ${e.message}`));
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log(await testAlibaba('dashscope.aliyuncs.com'));
})();
