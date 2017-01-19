var cheerio = require('cheerio');
var utils = require('./utilities');
var url = require('url');

function HtmlTools(httpManager, maxPages, originalUrl){
    this.maxPages = maxPages; //Maximum pages to traverse
    this.visitedList = {}; //a hashtable that contains all visited sites. Using an object for O(1) complexity.
    this.visitedCounter = 0; //So won't have to count object's keys each time.
    this.httpManager = httpManager; //injected http manager. Not accessing directly for testing and mocking purposes.
    this.originalUrl = originalUrl; //the original URL from which everything began.
    this.originalHost = url.parse(originalUrl).host; //The original host of the URL.
    this.getFilter = function(rootUrl){ //returns the filter of the href elements in the DOM
        return "a[href^='/'],a[href^='www."+rootUrl+"'],a[href^='http://"+rootUrl+"'],a[href^='http://www."+rootUrl+"'],a[href^='https://www."+rootUrl+"'],a[href^='https://"+rootUrl+"'],a[href^='"+rootUrl+"']"
    };

    this.collectLinksOnPage = function($, rootUrl){
      var hashtable = {};          
      var currentRelative = '';
      var newDomain = '';      
      var allUrls = $(this.getFilter(rootUrl));      
      var originalHost = this.originalHost;
        allUrls.each(function() {
        currentRelative = url.resolve(rootUrl,$(this).attr('href'));
        newDomain = url.parse(currentRelative).host;        
        if (typeof(hashtable.currentRelative) === 'undefined'
            && currentRelative!='/'
            && currentRelative!=''
            && newDomain === originalHost){ //Add it only if it isn't there already...

            hashtable[currentRelative]=currentRelative;
            
        }        
    });
    return Object.keys(hashtable);
    };

    this.visitedElement = function(element){
        return typeof(this.visitedList[element]) !== 'undefined';
    }

    this.recursiveTraversion = function(url){        
       
        httpManager(url, (error,response,html)=>{                 
            if (error){
                console.log('error happened: '+error);
                return;
            }         
            
            var $ = cheerio.load(html); //Load the HTML file 
            var allRelative = this.collectLinksOnPage($, url); //Get all links on current page
            var currentElement; //Set a temp element
            for (var i=0;i<allRelative.length;i++){
                currentElement = allRelative[i];                  
                
                if (!this.visitedElement(currentElement)){
                    if (this.visitedCounter == this.maxPages)  {                    
                        process.exit(0);
                    }
                    this.visitedList[currentElement] = currentElement; 
                    this.visitedCounter++;
                    console.log(currentElement);
                    this.recursiveTraversion(currentElement);                                
                }            
            }
        
        }
      );
    }
}

module.exports=HtmlTools;