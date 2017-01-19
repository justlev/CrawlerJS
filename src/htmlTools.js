var cheerio = require('cheerio');
var utils = require('./utilities');
var url = require('url');

function HtmlTools(httpManager, maxPages, originalUrl){
    this.maxPages = maxPages;
    this.visitedList = [];
    this.visitedCounter = 0;
    this.httpManager = httpManager;
    this.originalUrl = originalUrl;
    this.originalHostname = url.parse(originalUrl).hostname;
    this.collectLinksOnPage = function($, rootUrl){
        var hashtable = {};    
        var toReturn = [];
      var currentRelative = '';
      var newDomain = '';
      //var allUrls = $("a[href^='/'],a[href^='www."+absoluteRoot+"'],a[href^='http://"+absoluteRoot+"'],a[href^='http://www."+absoluteRoot+"'],a[href^='https://www."+absoluteRoot+"'],a[href^='https://"+absoluteRoot+"'],a[href^='"+absoluteRoot+"']");
      var allUrls = $("a[href^='/'],a[href^='www."+rootUrl+"'],a[href^='http://"+rootUrl+"'],a[href^='http://www."+rootUrl+"'],a[href^='https://www."+rootUrl+"'],a[href^='https://"+rootUrl+"'],a[href^='"+rootUrl+"']");
      //var allUrls = $("a[href^='/']");
      var originalHostname = this.originalHostname;
        allUrls.each(function() {
        currentRelative = url.resolve(rootUrl,$(this).attr('href'));
        newDomain = url.parse(rootUrl).hostname;        
        if (typeof(toReturn.currentRelative) === 'undefined'
            && currentRelative!='/'
            && currentRelative!=''
            && newDomain === originalHostname){ //Add it only if it isn't there already...

            hashtable[currentRelative]=currentRelative;
            toReturn.push(currentRelative);
        }        
    });
    return toReturn;
    };

    this.recursiveTraversion = function(url){        
       
        httpManager(url, (error,response,html)=>{                 
        if (!error){            
            //html = '<html><head></head><body> <a href="http://test/page1" /> <a href="/page2" /> <a href="page3" /> </body></html>'
            var $ = cheerio.load(html);
            var allRelative = this.collectLinksOnPage($, url);
            var currentElement;
            for (var i=0;i<allRelative.length;i++){
                currentElement = allRelative[i];                  
                // if (!currentElement.startsWith(url)){
                //     currentElement = url+currentElement;
                // }
                if (typeof(this.visitedList[currentElement]) === 'undefined'){
                    if (this.visitedCounter == this.maxPages)      {                    
                        process.exit(0);
                    }
                    this.visitedList[currentElement] = currentElement; 
                    this.visitedCounter++;
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