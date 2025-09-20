const http = require('http');
const port = process.env.PORT || 3000
const app = require('./src/app');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



