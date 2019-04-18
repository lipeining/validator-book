function processData(input) {
    //Enter your code here
    // [^\/] 避免单行注释
    const reg = /(\/\*[^\/]+\*\/|\/\/.+)/g;
    let myArray;
    while ((myArray = reg.exec(input)) !== null) {
        const str = myArray[0];
        console.log(str.split('\n').map(s=>{return s.trim();}).join('\n'));
    }
} 
const input = require('./find_comment_input').input;
processData(input);

console.log('###$$$$'.match(/(.)(?!\1)/g));
/* Iterate through the list till we encounter the last node.*/
/* Allocate memory for the new node and put data in it.*/
//First node is dummy node.
/* Iterate through the entire linked list and search for the key. */
//key is found.
//Search in the next node.
/*Key is not found */
/* Go to the node for which the node next to it has to be deleted */
/* Now pointer points to a node and the node next to it has to be removed */
/*temp points to the node which has to be removed*/
/*We removed the node which is next to the pointer (which is also temp) */
/* Beacuse we deleted the node, we no longer require the memory used for it .
free() will deallocate the memory.
*/
/* start always points to the first node of the linked list.
temp is used to point to the last node of the linked list.*/
/* Here in this code, we take the first node as a dummy node.
The first node does not contain data, but it used because to avoid handling special cases
in insert and delete functions.
*/
