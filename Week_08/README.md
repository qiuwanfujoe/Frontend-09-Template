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





