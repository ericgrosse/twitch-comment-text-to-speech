const http = require('http');
const WebSocket = require('ws');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`HTTP Server running at http://${hostname}:${port}/`);

  const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.on('open', () => {
    ws.send('PASS oauth:your_token');
    ws.send('NICK your_username');
    ws.send('JOIN #your_channel');
  });

  ws.on('message', (data) => {
    if (data.includes('PRIVMSG')) {
      const message = data.split(':')[2];
      console.log(`New message in Twitch chat: ${message}`);
    }
  });
});