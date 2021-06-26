var assert = require('assert');
import {parseHTML} from '../parser';
it('<a></a>', function() {
    let tree = parseHTML('<a></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);

});

it('<a href="//time.geekbang.org"></a>', function() {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href></a>', function() {
    let tree = parseHTML('<a href ></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});
it('<a href id ></a>', function() {
    let tree = parseHTML('<a href id></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});
it('<a href=\"abc\" id ></a>', function() {
    let tree = parseHTML('<a href=\"abc\" id ></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href=\'abc\' id ></a>', function() {
    let tree = parseHTML('<a href=\'abc\' id ></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href=abc ></a>', function() {
    let tree = parseHTML('<a href=abc ></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href=abc />', function() {
    let tree = parseHTML('<a href=abc />')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a />', function() {
    let tree = parseHTML('<a />')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<A />', function() {
    let tree = parseHTML('<A />')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'A');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<>', function() {
    let tree = parseHTML('<>')
    assert.strictEqual(tree.children[0].type,"text");
});

it('<a id=abc/>', function() {
    let tree = parseHTML('<a id=abc/>')
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href=abc></a>', function() {
    let tree = parseHTML('<a href=abc></a>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
});

it('<a href=\'abc\'/>', function() {
    let tree = parseHTML('<a href=\'abc\'/>')
    // console.log(tree)
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
    // assert.strictEqual(tree.children[0].children.length,0);
});
