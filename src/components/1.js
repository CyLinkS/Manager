let arr = [1, 2, 3, 4]
let res = arr.reduce((pre, cur) => {
    return pre += cur
}, 0)
console.log(res)