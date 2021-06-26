var assert = require('assert');
import {add, mul} from '../add';
it('1+2 shoud equal 3', function() {
    assert.equal(add(1,2),3);
});

it('3+2 shoud equal 5', function() {
    assert.equal(add(3,2),5);
});


it('3*2 shoud equal 6', function() {
    assert.equal(mul(3,2),6);
});