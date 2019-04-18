function processData(input) {
    //Enter your code here
    const link_reg = /<\s*a.*href="\/questions\/(\d+)\/[^"]+".*>(.*)<\s*\/a\s*>/g;
    const time_reg = /<\s*span.*class="relativetime".*>(.*)<\s*\/span\s*>/g;
    const lines = input.split('\n');
    const questions = [];
    const times = [];
    for(const line of lines) {
        let arr;
        if ((arr = link_reg.exec(line)) !== null) {
            // console.log(`${arr[1]};${arr[2]}`);
            questions.push(`${arr[1]};${arr[2]}`);
        } else if((arr= time_reg.exec(line))!==null) {
            times.push(`${arr[1]}`);
        }
    }
    for(const [i,question] of questions.entries()) {
        console.log(`${question};${times[i]}`);
    }
} 
const input = require('./find_question_input').input;
processData(input);

console.log(/\{-truncated-\}$/.test('cvdfdsfds{-truncated-}'));


const PInput = `6
RuuGX6239Y
FTThb1283H
AECNF2139Z
MKRKR3835R
s19nqg88yG
TQJBP4717M`;
function processDataP(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.splice(1);
    const reg = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    for (const sentence of sentences) {
        console.log(sentence);
        if (reg.test(sentence.trim())) {
            console.log('YES');
        } else {
            console.log("NO");
        }
    }
} 
processDataP(PInput);