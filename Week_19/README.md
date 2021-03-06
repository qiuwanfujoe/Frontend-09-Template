学习笔记
###  1. 实现一个线上 Web 服务 | 初始化Server

* Oracle VM VirtualBox 下载地址： https://www.virtualbox.org/
* 下载 Ubuntu 20.04.1 LTS (Focal Fossa) 下载地址：
官网： https://releases.ubuntu.com/20.04/
* 虚拟机登录密码:gideon/111111

* 安装nodejs

``` sudo apt install   nodejs ```

``` 刚开始设置镜像的时候设置成了http://mirros.aliyun.ubuntu.com/ubuntu 导致后面我安装nodejs出错 ```

解决方案:

```修改源文件 位置：/etc/apt/sources.list```

* 安装npm
``` sudo apt install npm```

* 安装nodejs管理工具 n

``` sudo npm install -g n```

* 更新nodejs版本

``` sudo n latest```

* 设置PATH

``` PATH=$PATH```


### 2. 实现一个线上Web服务 | 利用Express，编写服务器（一）
* 本机 ```mkdir server & cd server```
* 安装express 模版 ``` npx express-generator ```
* 默认使用的是jade模版
* ```npm install```
* ```npm start,``` 默认端口3000

### 3. 实现一个线上Web服务 | 利用Express，编写服务器（二）
* 在虚拟机ubuntu 上安装SSH服务
``` sudo apt-get install openssh-server ```
* 在虚拟机上 启动SSH服务 ``` service ssh start ```
* 在虚拟机上设置端口转发, 虚拟机-> settings->network->port forwarding
![设计方式](./1.png)
* 拷贝文件到虚拟机服务器
``` scp -P 8022 -r ./* gideon@127.0.0.1:/home/gideon/server ```

* 在虚拟server目录下 执行 ``` npm start ```
![设计方式](./2.png)
    虚拟机上启动之后端口是3000, 需要设置本地8080转发到3000




###  4. 实现一个发布系统 | 用Node.js启动一个简单的Server

* 实现 ```mkdir publish-server,```
* ```cd publish-server & npm init```
* 启动```server node server.js```

### 5. 实现一个发布系统 | 编写简单的发送请求功能
* 发布```publish tool```
* ```cd publish-tool & npm init ```
* 启动 ```node publish.js```

###  6. 实现一个发布系统 | 简单了解Node.js的流

* 流式传输 ```stream_class_stream_readable  'Content-Type':'application/actet-stream',//流式传输```

* Event:close data事件

###  7. 实现一个发布系统 | 改造Server
*  在虚拟机上启动
    ```server npm start &```
*  不阻滞console,可以加 ```npm start &```
*  在虚拟机上新建publish-server目录
*  在本机publish-server 上执行```npm run publish```
*  在在虚拟机上新建publish-server 上启动```npm start&```
*  修改publish-tool 发送的端口号为 8882
*  在虚拟机上配置端口转发:
![设计方式](./3.png)

问题:

``` publish-server 和 server 是怎么建立链接的? ```  
答: publish-server收到请求之后,文件是写在server项目里面的

### 8. 实现一个发布系统 | 实现多文件发布
1.  获取文件大小
``` fs.stat("./sample.html", (err,stats) => {}) ```
2. pipe方式读取流:

        let file = fs.createReadStream("./sample.html")
        file.pipe(request);
        file.on('end', () => {
            request.end()
        });
    
3. 压缩文件:

        archive.directory("./sample/",false);
        archive.pipe(request)
        archive.finalize() 

4. 服务收到文件请求之后进行解压缩:

        request.pipe(unzipper.Extract({path:'../server/public/'}));


### 9. 实现一个发布系统 | 用GitHub OAuth做一个登录实例

1. 在github.com创建app https://github.com/settings/apps/gideon-toy-publish-app
    a. https://github.com/settings/profile 找到Developer settings
    b. new github app:
        ``` App ID: 124058
            Client ID: Iv1.28ff20d26f7fdad3
            78e84f2adeac13b68ee1671096577ec1b7a6b3de
        ```
    c. https://github.com/login/oauth/authorize?client_id=Iv1.28ff20d26f7fdad3
    
2. publish-tool &publish-server:
``` 1. publish-tool 打开 https://github.com/login/oauth/authorizeclient_id={xxxx}```
``` 2. publish-server :auth路由:接受code 用code+clientID+client——secret换取token```
``` 3. publish-tool 创建server,接受token,后点击发布```
```4. publish-server:publish路由:用token获取用户信息,检查权限,接受发布```







