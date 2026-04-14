const https = require('https');

const KEY = "9855fde9415e47938583ace9c16d2030.dQZN1B5xVaLR3qYB";

function testModelsEndpoint(hostname) {
  return new Promise((resolve) => {
    const options = {
      hostname,
      path: '/v1/models',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${KEY}` }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(`[${hostname}] ${res.statusCode}: ${data.substring(0, 500)}`);
      });
    });
    req.on('error', (e) => resolve(`[${hostname}] Error: ${e.message}`));
    req.end();
  });
}

(async () => {
  console.log(await testModelsEndpoint('api.z.ai'));
  console.log(await testModelsEndpoint('open.bigmodel.cn')); // path here is usually /api/paas/v4/models but let's test openai compat
})();
