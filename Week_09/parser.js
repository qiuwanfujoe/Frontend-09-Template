
const css = require('css');
const EOF = Symbol('EOF');
let currentToken = null;
let currentAttribute = null;
let spaceReg = /^[\n\f\t ]$/;
let letterReg = /^[a-zA-Z]$/;
let currentTextNode = null;

let stack = [{ type: 'element', children: [] }];

// 加入一个新的函数，addCSSRules 这里我们把 css 规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, '            '));

    rules.push(...ast.stylesheet.rules);
}

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

function computerCSS(element) {
    // 首先获取该元素的所有父元素
    var elements = stack.slice().reverse();

    // 保存由 CSS 来设置的属性
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    // 遍历所有的规则，是否符合该元素（针对简单选择器 不包含 ',' 等）
    for (let rule of rules) {
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
    }

}

function emit(token) {
    // 1. 每一次一个新的 token 来，先把栈顶取出来
    // 2. 将 token 表示的元素入栈（element 是 tag 的抽象）
    // 3. 将所有的属性 push 进 element.attributes(除 tagName、type 外)
    // 4. 绑定父子关系
    // 5. 如果是结束标签：出栈
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: [],
            tagName: token.tagName
        };

        for (let p in token) {
            if (p !== 'tagName' && p !== 'type') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        computerCSS(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode = null;
    } else if (token.type === 'endTag') {
        if (token.tagName !== top.tagName) {
            throw new Error('Tag start end not match!');
        } else {
            // ++++++++++++++++遇到 style 标签时，执行添加 CSS 规则的操作++++++++++++++++
            if (top.tagName === 'style') {
                // 这时候是可以拿到 style 标签的所有文本子节点的
                addCSSRules(top.children[0].content);
            }

            stack.pop();
        }

        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }

            top.children.push(currentTextNode);
        }

        currentTextNode.content += token.content;
    }
}

// 初始状态
function data(c) {
    // 判断是否是 tag
    // 判断是否是结束
    // 否则认为是文本节点
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

function tagOpen(c) {
    // 判断是三种标签中的哪一种
    if (c === '/') { // 是不是结束标签
        return endTagOpen;
    } else if (c.match(letterReg)) { // 开始标签或者自结束标签
        currentToken = {
            type: 'startTag',
            tagName: ''
        };

        return tagName(c);
    } else {
        return;
    }
}

function endTagOpen(c) {
    // 结束标签
    if (c.match(letterReg)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        };

        return tagName(c);
    } else if (c === '>') {
        // 报错
    } else if (c === EOF) {
        // 报错
    } else {

    }
}

function tagName(c) {
    if (c.match(spaceReg)) { // tab 键、换行、空格等
        return beforeAttributeName;
    } else if (c.match(letterReg)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        emit(currentToken)
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(spaceReg)) {
        return beforeAttributeName;
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        // 属性开头不可能是等号  是错误
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}

// 自封闭标签
function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c === EOF) {
        // 报错
    } else {
        // 报错
    }
}


function attributeName(c) {
    if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === '\'' || c === '<') {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

// 一个属性名称结束
function afterAttributeName(c) {
    if (c.match(spaceReg)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        }

        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue;
    } else if (c === '\"') {
        return doubleQuotedAttributeValue;
    } else if (c === '\'') {
        return singleQuotedAttributeValue;
    } else if (c === '>') {

    } else {
        return unquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterAttributeName;
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === '\'') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterAttributeName;
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}


function unquotedAttributeValue(c) {
    if (c.match(spaceReg)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return unquotedAttributeValue;
    }
}


module.exports = {
    parseHTML: function (html) {
        let state = data;
        for (let c of html) {
            state = state(c);
        }

        state = state(EOF);

        return stack[0];
    }
}