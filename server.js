const static = require('node-static');
const http = require('http');

const port = 8080;
const file = new static.Server('./app', {
  cache: 3600,
  gzip: true
});

http
  .createServer((req, res) => {
    req
      .addListener('end', () => {
        file.serve(req, res);
      })
      .resume();
  })
  .listen(port);
