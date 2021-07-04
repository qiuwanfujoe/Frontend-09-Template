#### 1. 持续集成 | 发布前检查的相关知识
* daily build
* 白屏黑屏
* bvt

#### 2. 持续集成 | Git Hooks基本用法
* git hooks 存在与.git/hooks文件夹 ``` https://git-scm.com/book/zh-tw/v2/Customizing-Git-Git-Hooks ```
* 客户端主要是涉及pre-commit pre-push, 服务端主要是涉及pre-receive
* lint 主要放在pre-commit钩子里
* 增加pre-commit 
```JavaScript
    let process = require("process")
    console.log('hello hooks')
    process.exit(1)
```

#### 3. 持续集成 | ESLint基本用法
* 安装eslint ``` npm install --save-dev eslint ```
* 初始化eslint ``` npx eslint --init``` 会生成.eslintrc.js文件

#### 4. 持续集成 | ESLint API及其高级用法

* 用法:```https://eslint.org/docs/developer-guide/nodejs-api ```

```JavaScript
    #!/usr/bin/env node

const { ESLint } = require("eslint");
let child_process = require('child_process');

function exec(name) {
  return new Promise((resolve) => {
    child_process.exec(name, resolve)
  })
}

(async function main() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: false });

  // 2. Lint files. This doesn't modify target files.
  await exec("git stash push -k")
  const results = await eslint.lintFiles(["index.js"]);
  await exec("git stash pop")

  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);

  // 4. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 5. Output it.
  console.log(resultText);

  for(let result of results) {
      if (result.errorCount) {
        process.exitCode = 1
      }
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

#### 5. 持续集成 | 使用无头浏览器检查DOM

* chrom headless模式
* 添加chrom命令  
 ```
    alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
``` 
* 开发文档:https://developers.google.com/web/updates/2017/04/headless-chrome

* puppeteer使用 https://www.npmjs.com/package/puppeteer

*  安装``` npm i puppeteer ```

* 使用:
```Javascript

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.imooc.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
```