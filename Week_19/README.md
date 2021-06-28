学习笔记
###  1. 实现一个线上 Web 服务 | 初始化Server

* Oracle VM VirtualBox 下载地址： https://www.virtualbox.org/
* 下载 Ubuntu 20.04.1 LTS (Focal Fossa) 下载地址：
官网： https://releases.ubuntu.com/20.04/
* 虚拟机登录密码:gideon/111111

* 安装nodejs

``` sudo apt install nodejs ```

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
* 本机 mkdir server & cd server
* 安装express 模版 ``` npx express-generator ```
* 默认使用的是jade模版
* npm install
* npm start, 默认端口3000

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

* 实现 mkdir publish-server,
* cd publish-server & npm init
* 启动server node server.js

### 5. 实现一个发布系统 | 编写简单的发送请求功能
* 发布publish tool
* cd publish-tool & npm init 
* 启动 node publish.js

###  6. 实现一个发布系统 | 简单了解Node.js的流

* 流式传输 stream_class_stream_readable  'Content-Type':'application/actet-stream',//流式传输

* Event:close data事件

###  7. 实现一个发布系统 | 改造Server
*  在虚拟机上启动server npm start &
*  不阻滞console,可以加 npm start &
*  在虚拟机上新建publish-server目录
*  在本机publish-server 上执行npm run publish
*  在在虚拟机上新建publish-server 上启动npm start&
*  修改publish-tool 发送的端口号为 8882
*  在虚拟机上配置端口转发:
![设计方式](./3.png)

问题:

``` publish-server 和 server 是怎么建立链接的? ```







