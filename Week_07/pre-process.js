var a = 2;
void function(){
    a = 1;
    return;
    //预处理,a是局部变量
    var a;
}();
console.log(a);//2



var b = 2;
void function(){
    b = 1;
    //预处理,b是局部变量
    return;
    const b;
}();
console.log(b);//2


//case 3
var c = 2;
void function(){
    c = 1;
    {
        var c;
    }
}();
console.log(c);//2

//case 4
var d = 2;
void function(){
    d = 1;
    {
        const d;
    }
}();
console.log(d);//报错