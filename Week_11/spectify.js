// 请写出下面选择器的优先级： div#a.b .c[id=x] 0 1 2 1 #a:not(#b) 0 2 0 0 *.a 0 0 1 0 div.a 0 0 1 1
let N = 65536
specifyValue = N^3 * p1 + N^2 * p2 + N^1 * p3 + N^0 * p4

// div#a.b .c[id=x] 0 1 2 1 S1 = 4295098369
// #a:not(#b) 0 2 0 0 S2=8589934592
// *.a 0 0 1 0 S3=65536
// div.a 0 0 1 1 S4=65537
// S2 > S1 > S4 > S3
