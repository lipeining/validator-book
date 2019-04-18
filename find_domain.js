function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.slice(1);
    // [\\w\\.-] -是必须的 \\.是保证多个.分割的domain
    // \\.[a-z]+ 保证是.xxx之类的格式
    const domain_reg = new RegExp(`https?:\\/\\/(www.|ww2.)?([\\w\\.-]+\\.[a-z]+)\\/?`, 'ig');
    // console.log(N);
    // console.log(sentences.length);
    // let sum = 0;
    const res = [];
    for (const sentence of sentences) {
        let matchs;
        while ((matchs = domain_reg.exec(sentence)) !== null) {
            // console.log(matchs);
            // sum++;
            res.push(matchs[2]);
        }
    }
    // console.log(sum);
    console.log(Array.from(new Set(res)).sort().join(';'));
} 
const input = require('./find_domain_input').input;
processData(input);