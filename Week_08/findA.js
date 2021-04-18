function findA(string) {
    for(let c of string) {
        if (c == 'a') {
            return true;
        }
    }

    return false;
}

console.log(findA('I am gideon'));