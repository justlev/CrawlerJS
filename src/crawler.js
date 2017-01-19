var cheerio = require('cheerio');
var request = require('request');
var URL = require('url-parse');

function validateInput(args){
         if (args.length<=2){
            console.log('Usage: '+__filename+" [URL] [MaxNumOfPages | optional, default=200].\r\nExample: "+__filename+" http://google.com 500");
            process.exit(-1);
    }
}

function collectLinksOnPage($){
    var toReturn = [];    
      var currentRelative = '';
      var allUrls = $("a[href^='/']");
        allUrls.each(function() {
        currentRelative = $(this).attr('href');
        if (toReturn.indexOf(currentRelative) == -1){ //Add it only if it isn't there already...
            toReturn.push(currentRelative);
        }
    });

    return toReturn;
};

var result = [];

function recursiveTraversion(rootUrl,url){
    if (url.endsWith('/')){
       url = url.substring(0,url.length-1);
    }
    request(url, (error,response,html)=>{        
    if (!error){        
        var $ = cheerio.load(html);
        var allRelative = collectLinksOnPage($);
        var currentElement;
        for (var i=0;i<allRelative.length;i++){
            currentElement = url+allRelative[i];                  
            if (result.indexOf(currentElement) == -1){
                if (result.length == maxPages)      {
                    process.exit(0);
                }
                result.push(currentElement);   
                console.log(currentElement);
                recursiveTraversion(rootUrl,currentElement);                                
            }            
        }
      
    }
    else{
        console.log('error happened: '+error);
    }
});
}

// function recursiveTraversion(rootUrl,url){
//     var body = '';
//     request.get(url)
//     .on('data', data=>{body+=data;})
//     .on('end', function(response){
//        if (true) {         
//             debugger;
//             var $ = cheerio.load(body);
//             var allRelative = collectLinksOnPage($);
//             var currentElement;
//             for (var i=0;i<allRelative.length;i++){
//                 currentElement = url+allRelative[i];
//                 if (result.indexOf(currentElement) == -1){
//                     result.push(currentElement);                
//                     recursiveTraversion(rootUrl,currentElement);                
//                 }            
//             }
//             if (url == rootUrl)     {
//                 console.log(result);
//                 process.exit(0);
//             }
            
//         }
//         else{
//             console.log('error happened: '+error);
//         }
             
//        });

// }


validateInput(process.argv);

const url = process.argv[2];
const maxPages = process.argv[3] ? process.argv[3] : 100;


recursiveTraversion(url,url);
