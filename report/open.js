const path = require('path');
const open = require('open');

const filePath = path.resolve(__dirname, 'report.html');

if (process.argv[2]) {
  open('file://'+filePath, process.argv[2]);
} else {
  open('file://'+filePath);
}
