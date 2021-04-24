# 目标

前面已经实现了，拿到一个 url 发送 `request` 请求，并拿到 `response` 结果。这部分的目的是：

- 对 `response.body` 进行 `parse` 处理，得到 `DOM` 树。
- `CSS` 计算

## 步骤

### 第一步总结

- 为了方便文件管理，我们把 `parser` 单独拆到文件中
- `parser` 接收 `HTML` 文本作为参数，返回一颗 `DOM` 树

### 第二步总结

- 我们用 FSM(有限状态机)来实现 HTML 的分析
- 在 HTML 标准汇总，已经规定了 HTML 的状态
- Toy-Browser 只挑选其中一部分状态，完成一个最简版本

> HTML 最后需要有一个文件终结，在文件终结的位置 ，有一些节点（例如文本节点）存在没有结束的状态，所以我们必须要额外给它一个字符，而这个字符不能是任何一个有效的字符。利用 Symbol 的唯一性，添加一个截止标志 `EOF`，把它作为状态机的最后一个输入作为截止的标志。

### 第三步总结

HTML 中的标签分类：

- 开始标签
- 结束标签
- 自封闭标签

利用状态机区分这三种标签。

总结：

- 主要的标签分类
- 这一步暂时忽略属性

### 第四步总结

- 在状态机中，除了状态迁移，我们还要加入业务逻辑
    1. 创建 token
    2. 把字符加到 token 上
    3. emit token
- 在标签结束状态提交标签token
    1. 开始标签和结束标签是两个不同的 token

#### 分析 `tokenize` 时

首先从 `data` 状态开始，`EOF` 结束、文本分别是两个 `token`。而 `<` 这个状态我们不知道它到底是什么样的标签，因此需要在 `tagOpen` 状态处理：

```JavaScript
// 初始状态
function data(c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        });
        return;
    } else {
        emit({
            type: 'text',
            content: c
        });
        return data;
    }
}
```

接下来分析 `tagOpen` 状态，包含 `</`、`<a` 等，`<a` 表示是一个开始标签或者自封闭标签，因此需要新建一个 `token`，是否是自封闭标签用变量来判断。

```JavaScript
function tagOpen(c) {
    // 判断是三种标签中的哪一种
    if (c === '/') { // 是不是结束标签
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) { // 开始标签或者自结束标签
        currentToken = {
            type: 'startTag',
            tagName: c
        };

        return tagName(c);
    } else {
        return;
    }
}
```

`endTagOpen` 状态时，需要新建一个 `token`。

```JavaScript
function endTagOpen(c) {
    // 结束标签
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        };

        return tagName(c);
    } ...
}
```

`tagName` 状态时，因为标签名是一个字符一个字符的传进来的，因此需要将字符追加到 `currentToken.tagName` 上面。如果是自封闭标签，需要添加标志变量。

```JavaScript
function tagName(c) {
    if (c.match(/^[\n\f\t ]$/)) {
        return beforeAttributeName;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') { // 表示该 token 标签结束（包括开始标签、结束标签、自封闭标签）
        emit(currentToken)
        return data;
    } else {
        return tagName;
    }
}

// 自封闭标签
function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        return data;
    }...
}
```

### 第五步总结

- 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签 Token 上

### 第六步总结

- 从标签构建 DOM 树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立刻出栈
- 任何元素的父元素是它入栈前的栈顶

`emit` 方法流程：

- 每一次一个新的 token 来，先把栈顶取出来
- 如果是 `startTag` 类型
    1. 将 token 表示的元素入栈（element 是 tag 的抽象）
    2. 将所有的属性 push 进 element.attributes(除 tagName、type 外)
    3. 绑定父子关系
- 如果是 `endTag` 类型
    1. 判断 `token.tagName` 与 `top.tagName` 是否匹配
        a. 是：出栈
            a. 如果是 `style` 元素，则需要计算 CSS 规则
        b. 否：抛出错误信息
- 如果是 `text` 类型
    1. 由于文本节点是一个字符一个字符的传递进来，因此需要创建一个全局的变量 `currentTextNode` 存储文本节点，并将该节点挂到栈顶标签的 `children` 上
    2. `startTag` `endTag` 情况下，需要将 `currentTextNode` 置空

## CSS Computing

`CSS Computing` 即对 CSS 进行词法和语法分析。如果完全手工来做，需要很多编译原理的知识，因此可以使用现成的 CSS 包，这个包会将 CSS 变为抽象语法树。**我们需要根据这棵抽象语法树来抽出各种 CSS 规则，并且应用到 HTML 中**。

### 第一步 收集 CSS 规则

- 遇到 style 标签时，我们把 CSS 规则保存起来
- 这里我们调用 CSS Parser 来分析 CSS 规则
- 这里我们必须要仔细研究此库分析 CSS 规则的格式

### 第二步 添加调用

- 当我们创建一个元素后，立即计算 css
- 理论上，当我们分析一个元素时，所有 CSS 规则已经收集完毕(因此，`<head>`中的 css 是没有办法计算的)
- 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里我们忽略

> 关于 CSS 的隐藏规则：CSS 设计会尽量的保证所有的选择器都能够在 startTag 进入的时候，就能够被判断（后面加了高级的选择器后，有一些松动）。

### 第三步 获取父元素序列

- 在 `computerCSS` 函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
- 我们从上一步骤的 stack，可以获取本元素所有的父元素
- 因为我们首先获取的是 *当前元素*，所以我们获得和计算父元素匹配的顺序是从内向外

### 第四步 选择器与元素的匹配

- 选择器也要从当前元素向外排列
- 复杂选择器（空格相连）拆成针对单个元素的选择器，用循环匹配父元素队列

这一步 `computerCSS` 函数基本可以完成，代码如下：

```JavaScript
function computerCSS(element) {
    // 首先获取该元素的所有父元素
    // .slice() 如果不传参数，会复制原数组返回
    var elements = stack.slice().reverse();

    // 保存由 CSS 来设置的属性
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    // 遍历所有的规则，是否符合该元素（针对简单选择器 不包含 ',' 等）
    for (let rules of rules) {
        // 每个 rule 有一个 selectors 数组（'..., ..., ...' 这种格式的选择器会在 selectors 数组中表现，因为我们不会使用这种选择器，因此直接取0即可）
        // 这里需要 元素的父元素 顺序保持一致，所以也需要 reverse
        var selectorParts = rule.selectors[0].split(' ').reverse();

        // selectorParts[0] 即为当前元素的选择器，需要和当前元素计算是否匹配
        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;

        // 循环选择器与元素的父元素来判断是否它们匹配
        var j = 1;  // 表示当前选择器的位置

        for (var i = 0; i < elements.length; i++) {
            // 如果匹配，则 j 自增
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }

        // 如果所有的选择器都被匹配到，则说明 selectorParts 选择器被匹配成功
        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            // 如果匹配成功，就可以将 CSS 属性应用到元素中了
            console.log('Element', element, 'matched rule', rule);
        }
    }
}
```

### 第五步 计算选择器与元素匹配

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里可以仅实现三种基本选择器（`#`、`.`、`element`），实际的浏览器中要处理复合选择器

`match` 函数实现如下：

```JavaScript

function match(element, selector) {
    // 假设 selector 是简单选择器
    // . # div 等
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];

        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) === '.') {
        // 兼容有多个 class 的情况
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];
        let classes = attr && attr.value.split(' ');
        let result = classes && classes.find(className => className === selector.replace('.', ''));
        return result;

    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    return false;
}
```

### 第六步 生成 Computed 属性

- 一旦选择器匹配上，就将选择器应用到元素上，形成 computedStyle

因此需要修改匹配成功的代码如下：

```JavaScript
if (matched) {
    // 如果匹配成功，就可以将 CSS 属性应用到元素中了
    var computedStyle = element.computedStyle;

    for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}; // 可能会需要除了 value 之外的一些值，因此需要一个对象存储
        }

        computedStyle[declaration.property].value = declaration.value;
    }
    console.log('Element', element, 'matched rule', rule);
}
```

### 第七步 specificity 计算逻辑

specificity 可以认为是优先级，表示专指的程度。

- CSS 规则是根据 specificity 和后来优先规则覆盖
- specificity 是个四元组，越左边权重越高
- 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

```JavaScript
// 计算 specificity
function specificity(selector) {
    var p = [0, 0, 0, 0];

    var selectorParts = selector.split(' ');

    for (let part of selectorParts) {
        if (part.match(/#/)) {
            p[1] += 1;
        } else if (part.match(/\./)) {
            p[1] += 1;
        } else {
            p[3] += 1;
        }
    }

    return p;
}

// 根据优先级判断
function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    }

    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1]
    }

    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2]
    }

    return sp1[3] - sp2[3]
}

// 判断 match 之后的逻辑
if (matched) {
    // 如果匹配成功，就可以将 CSS 属性应用到元素中了
    var computedStyle = element.computedStyle;
    var sp = specificity(rule.selectors[0]);

    for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}; // 可能会需要除了 value 之外的一些值，因此需要一个对象存储
        }

        if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) { // 如果已有的CSS优先级低于新的优先级，则需要覆盖
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
        }
    }
    console.log('Element', element, 'matched rule', rule);
}
```

## 拓展

### 含有标签名的符合选择器匹配

匹配含有标签名的复合选择器，需要修改 `match` 函数。

首先，用正则表达式来匹配 `#`、`.` 选择器。其次，将标签名与选择器分隔开来：

`let selectors = selector.split('#').reverse();`

为了方便没有标签名时的匹配，所以调用了 `reverse()`，这样保证了 `selectors[0]` 永远表示选择器部分。如果选择器匹配成功，再判断是否匹配标签，修改后的 `match` 函数如下：

```JavaScript
function match(element, selector) {
    // 假设 selector 是简单选择器
    // . # div 等
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.match(/#/)) {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        let selectors = selector.split('#').reverse();

        if (attr && attr.value === selectors[0]) {
            if (selectors[1]) {
                if (selectors[1] === element.tagName) {
                    return true;
                } else {
                    false;
                }
            }
            return true;
        }
    } else if (selector.match(/\./)) {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];
        let selectors = selector.split('.').reverse();
        let classes = attr && attr.value.split(' ');
        let result = classes && selectors[0] && classes.find(className => className === selectors[0]);

        if (result) {
            if (selectors[1]) {
                if (selectors[1] === element.tagName) {
                    return true;
                } else {
                    false;
                }
            }
        }
        return result;

    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    return false;
}
```

## 问题

### 报错 `没有调试适配器，无法发送“variables”`

在 DOM 树生成后，想要打印出来看一下具体结果，但是不能展示树的具体值。原因是：当调试进程已结束时，在调试控制台是不能在查看输出的对象内部具体信息的。

### 正则匹配 CSS 类选择器

类名可以判断是否包含 `.` 字符，但这里需要注意的是：

>`.` 匹配除“\n”之外的任何单个字符。要匹配包括“\n”在内的任何字符，请使用像“(.|\n)”的模式。

因此如果想要匹配 `.` 字符，需要使用转义：`/\./`。