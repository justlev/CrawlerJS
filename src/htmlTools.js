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
    this.getLinksFilter = function(rootUrl){ //returns the filter of the href elements in the DOM
        return "a[href^='/'],a[href^='www."+rootUrl+"'],a[href^='http://"+rootUrl+"'],a[href^='http://www."+rootUrl+"'],a[href^='https://www."+rootUrl+"'],a[href^='https://"+rootUrl+"'],a[href^='"+rootUrl+"']"
    };
    this.getAssetsFilter = function(){ //returns the filter of the href elements in the DOM
        return "img,script,link";
    };

    this.visitedElement = function(allElements, element){
        return typeof(allElements[element]) !== 'undefined';
    }

    this.getAssetDetails = function(){
        return {
           'img':'src',
           'script':'src',
           'link':'href' 
        };
    }
    this.getAssets = function($, rootUrl){
        var allAssetOptions = this.getAssetDetails();
        var assetTypes = Object.keys(allAssetOptions); //[img,script,style]
        var assetsToReturn = [];
        for (var i=0;i<assetTypes.length;i++){
            var currentAssetType = assetTypes[i];// for exampe: [img]
            var currentInstances = $(currentAssetType); //all images on current page
            var currentAttribue = allAssetOptions[currentAssetType]; // = src           
            for (var j=0;j<currentInstances.length;j++){
                var assetSrc = $(currentInstances[j]).attr(currentAttribue);// = $(imageItem).attr('src')
                assetSrc && assetsToReturn.push(url.resolve(rootUrl,assetSrc));
            }
            
        }
        return assetsToReturn;
    }

    this.collectLinksOnPage = function($, rootUrl){
        var hashtable = {}; //Hashtable that will contain all relative paths that we have on the current page
        var currentRelPath = ''; //temp var
        var newDomain = ''; //what's the domain of the new relative path?
        var allUrls = $(this.getLinksFilter(rootUrl));       //All rel urls on current page.        
            for (var i=0;i<allUrls.length;i++){
            currentRelPath = url.resolve(rootUrl,$(allUrls[i]).attr('href')); //Resolve the value of the href attribute of the <a> tag on this page.
            newDomain = url.parse(currentRelPath).host;        //new domain of the new url found
            var assets = [];
            if (!this.visitedElement(hashtable, currentRelPath) //Have we visited the page already?            
                && currentRelPath!='' //not an empty string
                && newDomain === this.originalHost //We are in the same domain
                ){ 
                    hashtable[currentRelPath]={
                        assets:this.getAssets($,rootUrl)  //Add to hashtable.     
                    };       
                    
                   
            }        
        };
        return hashtable; //Return all keys of hashtable. (distincted URLS of this page.)
    };  

    this.recursiveTraversion = function(url){ //Recursively traverse the current URL.
        httpManager(url, (error,response,html)=>{                 
            if (error){
                console.log('error happened: '+error); //If there was an error, log and return.
                return;
            }         

            var $ = cheerio.load(html); //Load the HTML file 
            var allRelative = this.collectLinksOnPage($, url); //Get all links on current page
            var currentElement, currentKey; //temp element
            var urlsOnly = Object.keys(allRelative);
            for (var i=0;i<urlsOnly.length;i++){

                currentKey = urlsOnly[i];
                currentElement = allRelative[currentKey];
                if (!this.visitedElement(this.visitedList, currentKey)){
                    if (this.visitedCounter == this.maxPages)  { //If we've reached the maximum amount of pages, exit.                    
                        process.exit(0);
                    }
                    this.visitedList[currentKey] = currentElement;  //Set the hashtable object
                    this.visitedCounter++; //Add to total counter.
                    console.log(JSON.stringify(currentElement)); //Log the URL.
                    this.recursiveTraversion(currentKey);   //Recursively countinue looking                              
                }            
            }
        
        }
      );
    }
}

module.exports=HtmlTools;