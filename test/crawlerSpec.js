var expect = require('chai').expect;
var assert = require('chai').assert;
var cheerio = require('cheerio');
var URL = require('url-parse');
var htmlTools = require('../src/htmlTools');

describe('HtmlTools', function(){
    it('should return the correct amount of relative links', function(){
        //Prepare
        var tools = new htmlTools(500);
        var html = '<html><head></head><body> <a href="http://test/page1" /> <a href="/page2" /> <a href="page3" /> </body></html>'
         var $ = cheerio.load(html);
         var expectedResult=['http://test/page1','http://test/page2','http://test/page3'];

        //act
        var result = tools.collectLinksOnPage($);
        
        //assert
        assert.equal(result,expectedResult,'errorMsg')
    });
        
})