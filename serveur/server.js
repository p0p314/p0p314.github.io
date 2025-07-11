const http = require('http');
const app = require('./app.js');

const port = 3000;

const server = http.createServer(app);

server.on('listening',() => {
    console.log("server en route sur le port : " + port);
});

server.listen(port);