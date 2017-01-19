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
        var html = '<html><head></head><body> <a href="http://test.com/page1" /> <a href="/page2" /> <a href="/page3" /> </body></html>'
        
         var $ = cheerio.load(html);
         var expectedResult=['http://test.com/page1','http://test.com/page2','http://test.com/page3'];

        //act
        var result = tools.collectLinksOnPage($,rootUrl);
        
        //assert
        assert.deepEqual(result,expectedResult,'errorMsg')
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
        assert.deepEqual(result,expectedResult,'errorMsg')
    });

});

describe('Recursion logics', function(){
    //General initialization
    var mockedHttpProvider = (url, callback)=>{
        switch (url){
            case 'http://test.com':
                    callback(null,null,'<html><head></head><body><a href="http://test.com/page1" /></body></html>');
                    break;
                case 'http://test.com/page1':
                    callback(null,null,'<html><head></head><body><a href="/page2" /> </body></html>');
                    break;
                case 'http://test.com/page2':
                    callback(null,null,'<html><head></head><body></body></html>');
                    break;
        }
        
    };
    var mockedUrl = 'http://test.com';
    var tools = new htmlTools(mockedHttpProvider,500,mockedUrl);

    //Async action - recursion logics
      before(function(done){          
        tools.recursiveTraversion(mockedUrl);
        done();            
    });
    
    it('should work recursively', function(){
        //Object was filled in the 'before' method, let's check if it was filled correctly.
        
        //Prepare                                  
         var expectedResult = {'http://test.com/page1':'http://test.com/page1',
                                'http://test.com/page2':'http://test.com/page2'
        };

        //act
        const result = tools.visitedList;
        
        //assert
        assert.deepEqual(result,expectedResult,'errorMsg')
    })
});