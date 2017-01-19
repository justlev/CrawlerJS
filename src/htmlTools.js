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

    this.visitedElement = function(allElements, element){
        return typeof(allElements[element]) !== 'undefined';
    }

    this.collectLinksOnPage = function($, rootUrl){
        var hashtable = {}; //Hashtable that will contain all relative paths that we have on the current page
        var currentRelPath = ''; //temp var
        var newDomain = ''; //what's the domain of the new relative path?
        var allUrls = $(this.getFilter(rootUrl));       //All rel urls on current page.        
            for (var i=0;i<allUrls.length;i++){
            currentRelPath = url.resolve(rootUrl,$(allUrls[i]).attr('href')); //Resolve the value of the href attribute of the <a> tag on this page.
            newDomain = url.parse(currentRelPath).host;        //new domain of the new url found
            if (!this.visitedElement(hashtable, currentRelPath) //Have we visited the page already?            
                && currentRelPath!='' //not an empty string
                && newDomain === this.originalHost //We are in the same domain
                ){ 
                hashtable[currentRelPath]=currentRelPath; //Add to hashtable.            
            }        
        };
        return Object.keys(hashtable); //Return all keys of hashtable. (distincted URLS of this page.)
    };  

    this.recursiveTraversion = function(url){ //Recursively traverse the current URL.
        httpManager(url, (error,response,html)=>{                 
            if (error){
                console.log('error happened: '+error); //If there was an error, log and return.
                return;
            }         

            var $ = cheerio.load(html); //Load the HTML file 
            var allRelative = this.collectLinksOnPage($, url); //Get all links on current page
            var currentElement; //temp element
            for (var i=0;i<allRelative.length;i++){

                currentElement = allRelative[i];
                if (!this.visitedElement(this.visitedList, currentElement)){
                    if (this.visitedCounter == this.maxPages)  { //If we've reached the maximum amount of pages, exit.                    
                        process.exit(0);
                    }
                    this.visitedList[currentElement] = currentElement;  //Set the hashtable object
                    this.visitedCounter++; //Add to total counter.
                    console.log(currentElement); //Log the URL.
                    this.recursiveTraversion(currentElement);   //Recursively countinue looking                              
                }            
            }
        
        }
      );
    }
}

module.exports=HtmlTools;