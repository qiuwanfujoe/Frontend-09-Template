function match(string) {
    let state = start;
    for(let c of string) {
        state = state(c)
    }

    return state === end;
}

function start(c) {
    if (c === 'a') {
        return foundA;
    }
    return start;
}

function foundA(c) {
    if (c === 'b') {
        return foundB;
    }
    return start(c);
}

function foundB(c) {
    if (c === 'c') {
        return foundC;
    }
    return start(c);
}

function foundC(c) {
    if (c === 'a') {
        return foundA2;
    }
    return start(c);
}

function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    }
    return start(c);
}

function foundB2(c) {
    if (c === 'x') {
        return end;
    }
    return foundB(c);
}

function end(c) {
    return end;
}


console.log(match('abcabcabx'));