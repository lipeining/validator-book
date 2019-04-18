// 最后一个例子是经典的快速排序，读者可能会觉得这个例子算不上简单，但是我们会看到，使用递归的方式，再加上 Scala 简洁的语言特性，
// 我们只需要短短几行程序，就可以实现快速排序算法。快速排序算法的核心思想是：
// 在一个无序列表中选择一个值，根据该值将列表分为两部分，比该值小的那一部分排在前面，比该值大的部分排在后面。
// 对于这两部分各自使用同样的方式进行排序，直到他们为空， 显然，我们认为一个空的列表即为一个排好序的列表，这就是这个算法中的边界条件。
// 为了方便起见，我们选择第一个元素作为将列表分为两部分的值。 程序实现如下： def quickSort(xs: List[Int]): List[Int]
// = {    if (xs.isEmpty) xs    else
// quickSort(xs.filter(x=>x<xs.head)):::xs.head::quickSort(xs.filter(x=>x>xs.head
// )) }

function quickSort(arr) {
    if (arr.length === 0) {
        return arr;
    } else {
        return [
            ...quickSort(arr.filter(x => x < arr[0])),
            arr[0],
            ...quickSort(arr.filter(x => x > arr[0]))
        ];
    }
}

console.log(quickSort([    2,    5,    1,    5,    3,    6,    10,    -1,    -10,    100,    43]));

// 该问题的递归解法思路很简单：首先确定边界条件，如果要兑换的钱数为 0，那么返回 1，即只有一种兑换方法：没法兑换。
// 这里要注意的是该问题计算所有的兑换方法，无法兑换也算一种方法。 如果零钱种类为 0 或钱数小于 0，没有任何方式进行兑换，返回 0。
// 我们可以把找零的方法分为两类： 使用不包含第一枚硬币（零钱）所有的零钱进行找零， 使用包含第一枚硬币（零钱）的所有零钱进行找零，
// 两者之和即为所有的找零方式。 第一种找零方式总共有 countChange(money, coins.tail)种， 第二种找零方式等价为对于 money
// – conins.head进行同样的兑换， 则这种兑换方式有 countChange(money - coins.head, coins)种，
// 两者之和即为所有的零钱兑换方式。 清单 7. 零钱兑换问题的递归解法 
// def countChange(money: Int, coins: List[Int]): Int = {   
// if (money == 0)     1  
//  else if (coins.size == 0 ||  money < 0)    
//  0   
// else     countChange(money, coins.tail) + countChange(money - coins.head, coins) }

function countCharge(money, coins) {
    if (money === 0) {
        return 1;
    } else if (coins.length === 0 || money < 0) {
        return 0;
    } else {
        const [head, ...tail] = coins;
        return countCharge(money, tail) + countCharge(money - head, coins);
    }
}

console.log(countCharge(100, [50, 20, 10]));

console.log('sum----start----');
function sum(n) {
    const sumL = (left, acc) =>{
        if(left===0) {
            return acc;
        }
        return sumL(left-1, acc+left);
    }
    return sumL(n, 0);
}
console.log(sum(1));
console.log(sum(2));
console.log(sum(3));
console.log(sum(200));

console.log('sum----end----');

console.log('fib----start----');
// 
function fib(n) {
    const fibL = ({left, prev=1, next=1})=>{
        if(left===0) {
            return prev;
        } 
        return fibL({left: left-1, prev: next, next: prev+next});
    }
    return fibL({left: n});
}
console.log(fib(1));
console.log(fib(2));
console.log(fib(3));
console.log(fib(4));
console.log(fib(200));
console.log('fib----end----');

console.log('.*');
console.log(/.*/.test(''));
console.log(/.*/.test('b'));
console.log(/.*/.test('a'));
console.log(/.*/.test('abc'));
console.log('.+');
console.log(/.+/.test(''));
console.log(/.+/.test('b'));
console.log(/.+/.test('a'));
console.log(/.+/.test('abc'));
console.log('.*?');
console.log(/.*?/.test(''));
console.log(/.*?/.test('b'));
console.log(/.*?/.test('a'));
console.log(/.*?/.test('abc'));
console.log('(.?)*');
console.log(/(.?)*/.test(''));
console.log(/(.?)*/.test('b'));
console.log(/(.?)*/.test('a'));
console.log(/(.?)*/.test('abc'));