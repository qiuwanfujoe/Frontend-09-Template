let http = require('http')
let https = require('https')
let fs = require('fs')
let querystring = require('querystring')
let unzipper = require('unzipper')
const { callbackify } = require('util')

// 2.auth路由:接受code 用code+clientID+client——secret换取token
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    console.log('code:',query.code)
    getToken(query.code,function(info){
        // response.write(JSON.stringify(info))
        console.log('getToken success')

        console.log(info)
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
        response.end()
    });
}

function getToken(code,callback){
    let client_id = 'Iv1.28ff20d26f7fdad3';
    let app_secret = '5af88ace46d610db2a3aea28228cafc45db1f9ae';
    let request = https.request({
        hostname:"github.com",
        path:`/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${app_secret}`,
        port:443,
        method:'POST'
    }, function(response){
        let body="";
        response.on('data', chunk => {
            body+= chunk.toString();
        })
        response.on('end', chunk => {
            let o = querystring.parse(body);
            callback(o)
        })
    })
    request.end();
}

//4. publish路由:用token获取用户信息,检查权限,接受发布
function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    getUser(query.token,  info => {
        console.log('getUser success');
        console.log(info)
        if (info.login === 'qiuwanfujoe') {
            request.pipe(unzipper.Extract({path:'../server/public/'}));
            request.on('end',function(){
                response.end('success')
            })
        }
    });
}

function getUser(token, callback ) {
    let request = https.request({
        hostname:"api.github.com",
        path:`/user`,
        port:443,
        method:'GET',
        headers:{
            Authorization:`token ${token}`,
            "User-Agent":'gideon-toy-publish-app'
        }
    }, function(response){
        let body="";
        response.on('data', chunk => {
            body+= chunk.toString();
        })
        response.on('end', chunk => {
            callback(JSON.parse(body))
        })
    })
    request.end();
}

http.createServer(function(request,response) {
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response)
    }
    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response)

    }
    // console.log('request');
    // request.pipe(unzipper.Extract({path:'../server/public/'}));

    // let outFile = fs.createWriteStream("../server/public/tmp.zip");
    // request.pipe(outFile);

    // let outFile = fs.createWriteStream("../server/public/index.html");
    // request.pipe(outFile)

    // request.on('data', chunk => {
    //     console.log(chunk.toString())
    //     outFile.write(chunk)
    // });
    // request.on('end', chunk => {
    //     res.end('Success')
    // });
}).listen(8082);