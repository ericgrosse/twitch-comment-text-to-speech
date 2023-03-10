const axios = require('axios');
const http = require('http');
const WebSocketClient = require('websocket').client;
const config = require('./config');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

function connectWebSocketClient() {
  const client = new WebSocketClient();
  
  client.on('connectFailed', function(error) {
      console.log('Connect Error: ' + error.toString());
  });
  
  client.on('connect', function(connection) {
      console.log('WebSocket Client Connected');
      
      // Send CAP (optional), PASS, and NICK messages
  });
  
  client.connect('ws://irc-ws.chat.twitch.tv:80'); // Non-SSL, SSL is port 443
}

async function getBearerToken(apiKey, apiSecret) {
  try {
    const response = await axios.post('https://api.twitter.com/oauth2/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.twitter.apiKey}:${config.twitter.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
}

server.listen(port, hostname, () => {
  console.log(`HTTP Server running at http://${hostname}:${port}/`);
  //connectWebSocketClient();
  getBearerToken();
});

/*
  // chatgpt code, likely out of date

  const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.on('open', () => {
    ws.send(`PASS oauth:${config.twitch.token}`);
    ws.send(`NICK ${config.twitch.username}`);
    ws.send(`JOIN #${config.twitch.channel}`);
  });

  ws.on('message', (data) => {
    if (data.includes('PRIVMSG')) {
      const message = data.split(':')[2];
      console.log(`New message in Twitch chat: ${message}`);
    }
  });
*/