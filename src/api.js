const express = require('express');
const serverless = require('serverless-http');

const PushNotifications = require('@pusher/push-notifications-server');

const app = express();
const router = express.Router()

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY
});

router.get('/', (request, response) => {
  response.json({
    hello: 'hi'
  })
})

router.get('/pusher/beams-auth', function(req, res) {
  // Do your normal auth checks here 🔒
  let userId = ''
  const userIDInQueryParam = req.query['user_id'];
  if (userId != userIDInQueryParam) {
    res.send(401, 'Inconsistent request');
  } else {
    const beamsToken = beamsClient.generateToken(userId);
    res.send(JSON.stringify(beamsToken));
  }
});

app.use('/.netlify/functions/api', router)

// app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports.handler = serverless(app);