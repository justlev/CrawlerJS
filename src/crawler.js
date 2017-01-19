
var HtmlTools = require('./htmlTools');
var utils = require('./utilities');
var request = require('request');

const DEFAULT_MAX_PAGES = 100;

if(!utils.validateInput(process.argv)){ //Validate correctness of the input, and exit if something's wrong.
    process.exit(-1);
}

const url = process.argv[2]; //Get the URL from input parameters
const maxPages = process.argv[3] ? process.argv[3] : DEFAULT_MAX_PAGES; //Maximum pages.

var htmlTools = new HtmlTools(request,maxPages,url); //Get the HtmlTools class.

htmlTools.recursiveTraversion(url); //Traversively go through the elements on tree.
