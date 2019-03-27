const standardValidCharacters = /^[\d|/|*|\-|,]+$/;
const dayValidCharacters = /^[\d|/|*|\-|,|\?]+$/;

console.log(standardValidCharacters.test('*'));
console.log(standardValidCharacters.test('/'));
console.log(standardValidCharacters.test(','));
console.log(standardValidCharacters.test('1/3'));
console.log(standardValidCharacters.test('3*'));
console.log(standardValidCharacters.test('1,2'));
console.log(standardValidCharacters.test('1-3'));

console.log(dayValidCharacters.test('*'));
console.log(dayValidCharacters.test('/'));
console.log(dayValidCharacters.test(','));
console.log(dayValidCharacters.test('1/3'));
console.log(dayValidCharacters.test('3*'));
console.log(dayValidCharacters.test('1,2'));
console.log(dayValidCharacters.test('1-3'));



