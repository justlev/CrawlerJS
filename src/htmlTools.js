var cheerio = require('cheerio');
var request = require('request');
var URL = require('url-parse');

function HtmlTools(maxPages){
    this.maxPages = maxPages;
    this.visitedList = [];
    this.collectLinksOnPage = function($){
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

    this.recursiveTraversion = function(url){
        if (url.endsWith('/')){
        url = url.substring(0,url.length-1);
        }
        request(url, (error,response,html)=>{        
        if (!error){        
            var $ = cheerio.load(html);
            var allRelative = this.collectLinksOnPage($);
            var currentElement;
            for (var i=0;i<allRelative.length;i++){
                currentElement = url+allRelative[i];                  
                if (this.visitedList.indexOf(currentElement) == -1){
                    if (this.visitedList.length == this.maxPages)      {                    
                        process.exit(0);
                    }
                    this.visitedList.push(currentElement);   
                    console.log(currentElement);
                    this.recursiveTraversion(currentElement);                                
                }            
            }
        
        }
        else{
            console.log('error happened: '+error);
        }
    });
    }
}

module.exports=HtmlTools;