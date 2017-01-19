
var HtmlTools = require('./htmlTools');
var utils = require('./utilities');

if(!utils.validateInput(process.argv)){
    process.exit(-1);
}

const url = process.argv[2];
const maxPages = process.argv[3] ? process.argv[3] : 100;

var htmlTools = new HtmlTools(maxPages);

htmlTools.recursiveTraversion(url);
