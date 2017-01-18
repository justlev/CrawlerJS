var cheerio = require('cheerio');
var request = require('request');
var URL = require('url-parse');

function validateInput(args){
         if (args.length<=2){
            console.log('Usage: '+__filename+" URL.    Example: "+__filename+" http://google.com");
            process.exit(-1);
    }
}

function collectLinksOnPage($){
    var toReturn = [];
    console.log('visiting page: '+$('title').text());
      var currentRelative = '';
    $("a[href^='/']").each(function() {
        currentRelative = $(this).attr('href');
        if (toReturn.indexOf(currentRelative) == -1){ //Add it only if it isn't there already...
            toReturn.push(currentRelative);
        }
    });

    return toReturn;
}


validateInput(process.argv)

const url = process.argv[2];

request(url, (error,response,html)=>{
    if (!error){
        debugger;
        const $ = cheerio.load(html);
        var allRelative = collectLinksOnPage($);
        for (var i=0;i<allRelative.length;i++){
            console.log(allRelative[i]);
        }
        process.exit(0);
    }
    else{
        console.log('error happened: '+error);
    }
});