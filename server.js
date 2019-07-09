const http = require('http');
const App= require('./app');

const port =process.env.PORT || 5001;
const server =http.createServer(App);

server.listen(port,console.log(`server started at port ${port}`));