## [proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy):

        Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

        const p = new Proxy(target, handler)
        target
            要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
        handler
        一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。


## reactive:

        通过proxy实现对属性的监听

        通过在effect函数中调用callback来确定哪些变量属于proxy变量

        通过map来缓存需要监听的对象,达到优化的效果


## dragable:

        1. mousedown: 鼠标按下事件,加在拖动元素上面来表示开启
        2. mousemove: 鼠标移动事件,加在文档流来表示可拖动的区域为文档流
        3. mouseup:鼠标松开事件,在松开的时候移除监听
        4. 通过在move过程中不断改变元素的x,y位置来实现拖动,拖动的时候需要计算鼠标实际的位移, 还需要记住上次元素停留的位置

## [range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range/Range)

        1. 通过document.createRange来创建一个range
        2. 通过遍历拖动元素的childNode来获取所有的range
        3. 通过setStart和setEnd来设置range的起始和结束位置
        4. 计算拖动元素和range的距离,就是两点之间的距离,range的下x,y可以通过getBoundingClientRect来获取


[markdown语法](https://www.appinn.com/markdown/)