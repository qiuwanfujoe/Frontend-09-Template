学习笔记
#### Mocha 测试工具

* 安装 
``` npm install -g mocha ```
* mkdir test

* mocha 默认不支持ES6,不支持export, import语法

* 增加babel 支持
    ``` npm install --save-dev @babel/core @babel/register```

    ``` mocha --require @babel/register```

    ✖ ERROR: Error: Cannot find module '@babel/register' Require stack:
    因为调用的是global的,需要调用本地的 ()
    ``` npm install mocha ```
    ``` ./node_modules/.bin/mocha --require @babel/register ```

    增加.babelrc 来编译
    ```  npm install --save-dev @babel/preset-env ``` 

    运行

    ``` npm run test ```

#### Code coverage
 
* 安装nyc工具

``` npm install --save-dev nyc ```

* 运训nyc

    ``` npm run code-coverage ```

* 安装nyc babel插件

``` npm install --save-dev @istanbuljs/nyc-config-babel ```
``` npm install --save-dev babel-plugin-istanbul ```

    1. 增加.nycrc 和 .babelrc,plugins

    2. 运行npm run code-coverage


#### 单元测试工具 | 所有工具与generator的集成
* 代码在tools文件夹,项目名称叫 ‘generators-toytool’
* 在tools目录下运行npm link
* 在其他的地方新建文件夹,运行
    ``` yo toytool ```
    ``` webpack ``` 
    ``` npm run test ``` 
    ``` npm run  coverage``` 










