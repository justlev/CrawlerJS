var expect = require('chai').expect;
var assert = require('chai').assert;
var cheerio = require('cheerio');
var request = require('request');
var utils = require('../src/utilities');
var sinon = require('sinon');
var url = require('url');
var htmlTools = require('../src/htmlTools');

describe('HtmlTools', function(){
    it('should return the correct amount of relative links', function(){
        //Prepare        
        var rootUrl = "http://test.com/";
        var tools = new htmlTools(request, 500, rootUrl);
        var html = '<html><head></head><body> <a href="http://test.com/page1" /> <script src="script.js" ></script> <img src="image.jpg" /> <a href="/page2" /> <a href="/page3" /> </body></html>'
        
         var $ = cheerio.load(html);
         var expectedResult=['http://test.com/page1','http://test.com/page2','http://test.com/page3'];

        //act
        var result = Object.keys(tools.collectLinksOnPage($,rootUrl));
        
        //assert
        assert.deepEqual(result,expectedResult)
    });

      it('should look for assets on page', function(){
        //Prepare        
        var rootUrl = "http://test.com/";
        var tools = new htmlTools(request, 500, rootUrl);
        var html = '<html><head><link href="asdasd.css" /> <script src="headscript.js" ></script></head><body> <a href="http://test.com/page1" /> <img src="image.jpg" />  <script src="script.js" ></script> </body></html>'
        
         var $ = cheerio.load(html);
         var expectedResult={"http://test.com/page1":{"assets":["http://test.com/image.jpg","http://test.com/headscript.js","http://test.com/script.js","http://test.com/asdasd.css"]}}

        //act
        var result = tools.collectLinksOnPage($,rootUrl);
        console.log(JSON.stringify(result));
        //assert
        assert.deepEqual(result,expectedResult)
    });
  
  
      it("already visited table logics should return true if visited the page.", function(){
        //Prepare                         
         var tools = new htmlTools(request,500,'http://google.com');     
         var element = {"google.com":"google.com"};   
         var expectedResult = true;        

        //act
        const result = tools.visitedElement(element, "google.com");
        
        //assert
        assert.deepEqual(result,expectedResult,'errorMsg')
    });

     it("already visited table logics should return false if didn't visit the page.", function(){
        //Prepare                         
         var tools = new htmlTools(request,500,'http://google.com');     
         var element = {"google.com":"google.com"};   
         var expectedResult = false;        

        //act
        const result = tools.visitedElement(element, "yahoo.com");
        
        //assert
        assert.deepEqual(result,expectedResult);
    });

});

