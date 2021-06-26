
const css = require('css');
const EOF = Symbol('EOF');
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack;

let rules = [];
function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, '            '));

    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  
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
    var elements = stack.slice().reverse();

    if (!element.computedStyle) {
        element.computedStyle = {};
    }


    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(' ').reverse();

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;

        var j = 1;  // 表示当前选择器的位置

        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }

        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
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
            if (top.tagName === 'style') {
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

function tagOpen(c) {
    if (c === '/') { 
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        };

        return tagName(c);
    } else {
        currentToken = {
            type: 'text',
            tagName: ''
        };      
        emit(currentToken)  
        return data;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        };

        return tagName(c);
    } else if (c === '>') {
        // throw new Error('unexpect characters')
        
    } else if (c === EOF) {
        // throw new Error('unexpect characters')

    } else {
        // throw new Error('unexpect characters')
    }
}

function tagName(c) {
    if (c.match(/^[\n\f\t ]$/)) { 
        return beforeAttributeName;
    } else if (c.match(/^[a-zA-Z]$/)) {
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
    if (c.match(/^[\n\f\t ]$/)) {
        return beforeAttributeName;
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return data;
    } else if (c === EOF) {
    } else {
    }
}


function attributeName(c) {
    if (c.match(/^[\n\f\t ]$/) || c === '/' || c === '>' || c === EOF) {
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

function afterAttributeName(c) {
    if (c.match(/^[\n\f\t ]$/)) {
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
        return data;
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
    if (c.match(/^[\n\f\t ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue;
    } else if (c === '\"') {
        return doubleQuotedAttributeValue;
    } else if (c === '\'') {
        return singleQuotedAttributeValue;
    } else if (c === '>') {
        // return endTagOpen;
        console.log('beforeAttributeValue:====');
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
        // throw new Error('unexpected character')
    }
}


function unquotedAttributeValue(c) {
    if (c.match(/^[\n\f\t ]$/)) {
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


export function parseHTML(html){
    stack = [{ type: 'element', children: [] }];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
   let state = data;
   for(let c of html){
       state = state(c);
   }
   state = state(EOF);
   return stack[0]
}