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

学习笔记
1. Vue3 的reactive的实现原理
 + reactive函数使用Proxy创建对象的代理对象，设置get和set，当代理对象的get和set触发时，可以进行相关存取操作
 + 使用usedReactivities数组存储effect函数的参数回调函数中使用过的响应式对象以及对应的属性
 + 用户使用effect函数传入回调时，effect函数内部清空usedReactivities（因为effect可能会调用多次），然后调用一次用户传入的回调函数，如果回调中有reactive处理过的对象，就会触发get，在get中使用usedReactivities存储对应的对象和属性
 + 然后，effect函数中会接着遍历usedReactivities数组，使用map存储对应的callback（有两级结构：第一级是对象作为key，对应到对应的属性的map，第二级map是属性作为key，对应到回调函数）
 + 最后当用户修改回调中使用过的响应式对象的属性时，会触发对应对象的set，在set中可以通过两级map找到对应对象的对应属性的callback，执再将其行
 + 最后为了将深层次的对象也变为响应式对象，我们在get函数触发时需要判断获取的属性是不是对象，是对象，再用reactive函数处理一遍，返回处理后的Proxy对象
 + 这又会造成一个性能浪费，因为reactive函数每次默认创建一个新的Proxy对象返回，那么每次我们访问的成员为对象时都会创建一个新的Proxy对象，所以我们可以使用一个map去存储已经创建过的对象，使用对象作为key，调用reactive函数时判断是否已创建过该对象的Proxy对象，如果已创建过则直接返回创建过的Proxy对象即可

使用响应式，可以让我们避免频繁操作DOM，只需要关注数据的变化

 2. 拖拽
    + mousedown事件绑定到拖拽元素上，并且在mousedown事件发生后再无绑定mousemove和mouseup事件，比较合理
    + mousemove和mouseup事件绑定到document上，防止鼠标事件丢失
    + 使用transform移动元素
    + 鼠标按下时（mousedown）,记录鼠标的起始横纵坐标:startX = e.clientX，startY = e.clientY
    + 鼠标移动时，move事件中使用transform来同步修改元素位置（从起始坐标移动到鼠标移动到的位置），translate:transform(e.clientX-startX,e.clientY-startY)
    + 移动完一次之后，元素的位置已经变到对应位置了，第二次mousedown，并移动时，我们应该基于上一次的移动过的距离，去transform操作，所以在mouseup时我们应该记录元素本次拖拽移动过的距离：baseX = baseX + e.clientX - startX,baseY = baseY + e.clientY - startY;
    + 每次移动时要加上baseX和baseY去计算tranfrom需要移动的距离：translate:transform(baseX + e.clientX-startX, baseY + e.clientY - startY)

3. 在文本流中拖拽
    + 利用document.createRange()为文本节点的每个字符创建一个range对象
    + range.setStart(文本结点,i) 设置每个字符的range的起始位置为从文本结点开头算起第i个字符的偏移量
    + range.setEnd(文本结点,i) 设置每个字符的range的结束位置为从文本结点开头算起第i个字符的偏移量
    + range.getBoundingClientRect() 获取range的位置（这里主要用到x和y坐标）
    + 全部range存储到一个ranges数组中
    + 当鼠标移动时，通过遍历ranges数组，比较出离当前鼠标位置坐标和每一个range的坐标相比较，找到最近的range，并调用range.insertNode([node])插入我们的拖拽元素