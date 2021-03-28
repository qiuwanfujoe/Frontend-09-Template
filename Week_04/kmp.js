function kmp(source, pattern) {
    let table = new Array(pattern.length).fill(0);
    //构建table
    {
        let i = 1, j = 0;
        while(i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                ++i,++j;
                table[i] = j;
            } else {
                if (j === 0) {
                    ++i;
                } else {
                    j = table[j];
                }
            }
        }
    }

    // abcdabce
    // i=1, j=0, b!==a 0 0
    // i=2, j=0, c!==a 0 0 0
    // i=3, j=0, d!==a,0 0 0 0
    // i=4, j=0, a===a,0 0 0 0 1
    // i=5, j=1, b===b,0 0 0 0 1 2
    // i=6, j=2, c===c,0 0 0 0 1 2 3
    // i=7, j=3, e!==d,0 0 0 0 1 2 3 0

    {
        let i = 0; j = 0;
        while(i < source.length) {


            if (pattern[i] === pattern[j]) {
                ++i, ++j;
            } else {
                if (j > 0) {
                    j = table[j]
                } else {
                    ++i;
                }
            }

            if (j === pattern.length) {
                return true;
            }
        }

        return false
    }

}

kmp('','abcdabce');

console.log(kmp('hello', 'll'))
