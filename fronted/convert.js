const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'fonts', 'Inter-Regular.ttf');
const fontBuffer = fs.readFileSync(fontPath);
const base64Font = fontBuffer.toString('base64');

fs.writeFileSync('font-base64.txt', base64Font);
console.log('Base64 сохранен в font-base64.txt');