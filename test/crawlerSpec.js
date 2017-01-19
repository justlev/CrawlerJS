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
    before(function(done){
        var s = sinon.stub(utils,'requestWrapper');
        
            s.withArgs('http://test.com',sinon.match.any)
            .returns(null,null,'<html><head></head><body><a href="http://test.com/page1" /></body></html>');

            s.withArgs('http://test.com/page1',sinon.match.any)
            .returns(null,null,'<html><head></head><body><a href="/page2" /> </body></html>');
            
            s.withArgs('http://test.com/page2',sinon.match.any)
            .returns(null,null,'<html><head></head><body></body></html>')
            done();
    });
    
      it('should work recursevly from root url', function(){
        //Prepare        
         var expectedResult=['http://test.com/page1','/page2'];
         var rootUrl = 'http://test.com';
         var request = function(url,callback){
              if (url==='http://test.com'){
                 callback(null,null,'<html><head></head><body><a href="http://test.com/page1" /></body></html>');
             }

             if (url==='http://test.com/page1'){
                 callback(null,null,'<html><head></head><body><a href="/page2" /> </body></html>');
             }

              if (url==='http://test.com/page2'){
                 callback(null,null,'<html><head></head><body></body></html>');
             }

         }
         var tools = new htmlTools(request,500);                

        //act
        tools.recursiveTraversion(rootUrl);
        
        //assert
    //    assert.deepEqual(result,expectedResult,'errorMsg')
    });
        
})