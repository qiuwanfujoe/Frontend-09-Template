const HTTP = require('http');

HTTP.createServer((request, response) => {
    let body = [];

    request.on('error', err => {
        console.error(err);
    }).on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // 必须写 Content-Type
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`
        <html maaa=a>
        <head>
          <style>
            body div #myid{
              width:100px;
              background-color: #ff5000;
            }
            body div img{
              width: 30px;
              background-color:#ff1111;
            }
          </style>
        </head>
        <body>
            
        </body>
            </html>
        `);
    })
}).listen(8008);

console.log('server started');