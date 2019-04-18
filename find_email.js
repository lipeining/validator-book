function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.slice(1);
    const email_reg = new RegExp(`\\b[\\w+\\.]+@(\\w+\\.\\w)+\\w+\\b`, 'g');
    // console.log(N);
    // console.log(sentences.length);
    // let sum = 0;
    const res = [];
    for (const sentence of sentences) {
        let matchs;
        while ((matchs = email_reg.exec(sentence)) !== null) {
            // console.log(matchs);
            // sum++;
            res.push(matchs[0]);
        }
    }
    // console.log(sum);
    console.log(Array.from(new Set(res)).sort().join(';'));
} 
