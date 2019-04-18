const input = require('./find_us_world_input').input;
function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.slice(1, N + 1);
    const T = Number(lines[1 + N]);
    const worlds = lines.slice(N + 2);
    // console.log(N);
    // console.log(sentences);
    // console.log(T);
    // console.log(worlds);
    const sumObj = {};
    for (const sentence of sentences) {
        for (const world of worlds) {
            const reg = new RegExp(`\\b${world.trim().slice(0,-2)}[sz]e\\b`,'g');
            if(!sumObj[world]) {
                sumObj[world] = 0;
            }
            let myArray;
            while ((myArray = reg.exec(sentence)) !== null) {
                sumObj[world] = sumObj[world]+1;
            }
        }
    }
    for(const world of worlds) {
        console.log(sumObj[world]);
    }
} 
processData(input);