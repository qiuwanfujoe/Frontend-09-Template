function StringToNumber(str) {
    if (typeof str !== 'string') {
        return '不是字符串'
    }

    if (str.length > 16) {
        if (BigInt(str) > BigInt(9007199254740991)) {
            return '超出限制'
        }
        if (BigInt(str) < BigInt(-9007199254740991)) {
            return '超出限制'
        }
    } 

    return Number(str);
}


//数字转字符串
//radix:2,8,10,16进制
function NumberToString(number, radix) {
    const prefix = {
        2:"0b",
        8:'0o',
        10:'',
        16:'0x',
    }[radix];

    if (number > 0) {
        return prefix+ number.toString(radix);
    } else {
        '-' + prefix + Math.abs(number).toString(radix);
    }
}