let http = require('http')
let fs = require('fs')
let unzipper = require('unzipper')

http.createServer(function(request,res) {
    console.log('request');
    request.pipe(unzipper.Extract({path:'../server/public/'}));

    // let outFile = fs.createWriteStream("../server/public/tmp.zip");
    // request.pipe(outFile);

    // let outFile = fs.createWriteStream("../server/public/index.html");
    // request.pipe(outFile)

    // request.on('data', chunk => {
    //     console.log(chunk.toString())
    //     outFile.write(chunk)
    // });
    request.on('end', chunk => {
        res.end('Success')
    });
}).listen(8082);