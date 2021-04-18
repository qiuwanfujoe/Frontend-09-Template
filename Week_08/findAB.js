function findAB(string) {
    let foundA = false;
    for(let c of string) {
        if (c == 'a') {
            foundA = true
        } else if (foundA && c == 'b') {
            return true;
        } else {
            foundA = false;
        }
    }

    return false;
}

console.log(findA('I am gideon ab'));