const input = require('./find_html_attributes_input').input;
function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const N = Number(lines[0]);
    const sentences = lines.slice(1);
    const res = {};
    for (const sentence of sentences) {
        const all_reg = /<\s*([^>\/\s]+)\s*([^>]*?)>/g;
        let allArray;
        while ((allArray = all_reg.exec(sentence)) !== null) {
            const tag = allArray[1];
            const attrStr = allArray[2];
            if (!res[tag]) {
                res[tag] = {};
            }
            const attr_reg = /([^="']+)=("|')[^\2]*?\2\s*/g;
            // 这里存在 "'区分问题 href="dfsa" class= "" 导致class属性的丢失
            // 需要加上?
            // const attr_reg = /([^="']+)=["'][^"']*["']\s*/g;
            let attrArray;
            while ((attrArray = attr_reg.exec(attrStr)) !== null) {
                console.log(attrArray);
                const attr = attrArray[1];
                res[tag][attr] = true;
            }
        }
    }
    // console.log(res);
    const result = [];
    for (const tag in res) {
        result.push(`${tag}:${Object.keys(res[tag]).sort().join(',')}`);
    }
    // console.log(result);
    result.sort();
    for (const r of result) {
        console.log(r);
    }
} 

processData(input);


