# 浏览器工作原理:

## 浏览器总论

URL->http->html->parse->dom->css computing->dom with css-->Bitmap

![浏览器](./1.png)

## 状态机

1. 有限状态机

![浏览器](./2.png)
![浏览器](./3.png)

2. 不使用状态机处理字符串 [findA.js] [findAB.js] [findABCDEF.js]

3. 使用状态机处理字符串,[match.js] [findABCABX.js] [findABABABX.js]

4. HTTP请求 | HTTP的协议解析
![浏览器](./4.png)

TCP与IP的一些基础知识:
![浏览器](./5.png)

5. 服务端:[server.js]
6. 客户端:[client.js]
7. reponse格式:
![浏览器](./6.png)


# | 不适用状态机处理字符串

## ||  使用有限状态机处理字符串
### ||| 在一个字符串中，找到字符 a

```javascript
function match(str) {
    for (let c of str) {
        if (c === 'a') return true;
    }
    return false;
}
```
时间复杂度O(n)

### ||| 在一个字符串中，找到连续的字符 ab
```javascript
function match(str) {
    let foundA = false;
    for (let char of str) {
        if (char === 'a')
            foundA = true;
        else if (char === 'b' && foundA)
            return true;
        else
            foundA = false;
    }
    return false;
}
```
### ||| 在一个字符串中，找到字符 'abcdef'
```javascript
function match(str) {
    let foundA = 0;
    let foundB = 0;
    let foundC = 0;
    let foundD = 0;
    let foundE = 0;
    for (let char of str) {
        if (char === 'a')
            foundA++;
        else if (foundA === 1 && char ==='b')
            foundB++;
        else if (foundB === 1 && char === 'c')
            foundC++;
        else if (foundC === 1 && char === 'd')
            foundD++;
        else if (foundD === 1 && char === 'e')
            foundE++;
        else if (foundE === 1 && char === 'f')
            return true;
        else {
            foundA = 0;
            foundB = 0;
            foundC = 0;
            foundD = 0;
            foundE = 0;
        }
            
    }
    return false;
}
```

## || 使用状态机处理字符串
```javascript

function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    return state === end;
}
function start(c) {
    if (c === 'a')
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if (c === 'b')
        return foundB;
    else
        return start(c);
}

function foundB(c) {
    if (c === 'c')
        return foundC;
    else
        return start(c);
}

function foundC(c) {
    if (c === 'd')
        return foundD;
    else
        return start(c);
}

function foundD(c) {
    if (c === 'e')
        return foundE;
    else
        return start(c);
}

function foundE(c) {
    if (c === 'f')
        return end;
    else
        return start(c);
}
```
* 陷阱，一直在 end
* reconsume，start 再传入 c

### ||| 用状态机处理 "abcabx" 这样的字符串
```javascript
function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    return state === end;
}
function start(c) {
    if (c === 'a')
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if (c === 'b')
        return foundB;
    else
        return start(c);
}

function foundB(c) {
    if (c === 'c')
        return foundC;
    else
        return start(c);
}

function foundC(c) {
    if (c === 'a')
        return foundA2;
    else
        return start(c);
}

function foundA2(c) {
    if (c === 'b')
        return foundB2;
    else
        return start(c);
}

function foundB2(c) {
    if (c === 'x') {
        return end;
    } else {
        return foundB(c);
    }
}

console.log(match('abcabcabx'));
```

abcabcabx，第二个abc 的时候，将 'c' 传给了 foundB 状态

### ||| 使用状态机处理 'abababx'

```javascript
function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    return state === end;
}

function start(c) {
    if (c === 'a')
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if (c === 'b')
        return foundB;
    else
        return start(c);
}

function foundB(c) {
    if (c === 'a')
        return foundA2;
    else
        return start(c);
}

function foundA2(c) {
    if (c === 'b')
        return foundB2;
    else
        return start(c);
}

function foundB2(c) {
    if (c === 'a')
        return foundA3;
    else
        return foundB(c);
}

function foundA3(c) {
    if (c === 'b')
        return foundB2;
    else
        return start(c);
}

function foundB3(c) {
    if (c === 'x')
        return end;
    else
        return foundB2(c);
}

console.log(match('abababx'));
```


# 实现 HTTP 请求
## ||  ISO-OSI 七层网络模型
* 应用
* 表示
* 会话
* 传输
    * 包含 TCP、UDP
* 网络
    * 包含 IP 协议，internet protocol
* 数据链路
* 物理层


数据层和物理层解决点对点传输的问题

在 Node.js 中：
* TCP => require('net')
* 会话、表示、应用 => HTTP => require('http')

## ||  TCP 与 IP 的一些基础知识
* 流
* 端口，哪一个数据分配给那个软件，用端口来确定
* require('net')
* 包，TCP 传输的数据是一个一个的包
* IP 地址，包需要从哪儿到哪儿
    * 小区节点 => 电信主干网 => 国际主干线
* libnet/libpcap
    * libnet 构造 ip 包并且发送
    * libpcap，从网卡，抓去流经网卡的所有包，可以通过某些抓到不是发给自己的包

## || HTTP
* TCP 全双工
* HTTP 必须先由客户端发送 request，再由服务端相应 response，每个 request 对应一个 response
* HTTP 协议是文本型协议，不是二进制协议，不是传二进制编码，而是传 unicode 编码
* 所有 HTTP 的换行都是 \r \n 两个字符构成

HTTP 的例子
```
POST / HTTP/1.1
Host: 127.0.0.1
Content_Type: application/x-www-form-urlencoded

field=aaa&code=x%3D1
```

* 第一行，Request line
    * 方法
    * 路径，path，默认 `/`
    * 协议
* 第二行，第三行， headers，kv
* 第五行，body 部分，根据 Content-Type 来决定格式

## || 实现 HTTP 请求
### ||| 第一步：构造 Http 请求
* 谁将一个 HTTP 请求的类
* Content-Type 是一个必要字段，设置默认值
* body 是 KV 格式
* 不同的 Content-Type 影响 body 的格式

### ||| 第二步 send 函数的总结
* 在 Request 的构造器中收集必要的信息
* 设计一个 send 函数，将请求真是发送到服务器
* send 函数应该是异步的，返回 Promise

response格式  

```
HTTP/1.1 200 /* status line*/
Content-Type:text/html /* headers */
Date:Mon,23 Dec 2019 06:46:19 GMT /* headers */
Connection: keep-alive /* headers */
Transfer-Encoding: chunked /* headers */

26 /* chunked body, 16 进制数字 */
<html><body>Hello world</body></html> /* chunked body */
0 /* chunked body, 16 进制数字 */
```

### ||| 第三步 发送请求
* 支持已有的 connection，否则新建 connection
* 收到数据传给 parser 解析
* 根据 parser 的状态去设定 Promise 的状态

### ||| 第四步 ResponseParser 总结
* Response 必须分段构造，所以用了一个 ResponseParser 来装配
* ResponseParser 分段处理 ResponseText，使用状态机来分析文本结构

### ||| 第五步 BodyParser 总结
* Response 的 body 可能根据 Content-Type 有不同的结构，因此会采用不同的子 Parser 来解决问题
* 文中以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式
* \r表示回车 \n表示换行(新起一行)





