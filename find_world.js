const input = require('./find_world_input').input;
function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.slice(1, N + 1);
    const T = Number(lines[N + 1]);
    const tags = lines.slice(N + 2);
    // console.log(N);
    // console.log(sentences);
    // console.log(T);
    // console.log(tags);
    const res = [];
    for (const tag of tags) {
        const tag_reg = new RegExp(`\\b${tag}\\b`, 'g');
        let sum = 0;
        for (const sentence of sentences) {
            let matchs;
            // console.log(tag_reg);
            // console.log(sentence);
            while ((matchs = tag_reg.exec(sentence)) !== null) {
                // console.log(matchs);
                sum++;
            }            
        }
        res.push(sum);
    }
    // console.log(res);
    for (const r of res) {
        console.log(r);
    }
} 
processData(input);
