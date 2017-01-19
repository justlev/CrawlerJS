var htmlTools = require('../src/htmlTools');
var expect = require('chai').expect;
var assert = require('chai').assert;

describe('Recursion logics', function(){
    //General initialization of the mock http library
    var mockedHttpProvider = (url, callback)=>{
        switch (url){
            case 'http://test.com':
                    callback(null,null,'<html><head></head><body><a href="http://test.com/page1" /></body></html>');
                    break;
                case 'http://test.com/page1':
                    callback(null,null,'<html><head></head><body><a href="/page2" /> <a href="yahoo.com" /> </body></html>');
                    break;
                case 'http://test.com/page2':
                    callback(null,null,'<html><head></head><body><a href="/page1" /></body></html>');
                    break;
        }
        
    };
    var mockedUrl = 'http://test.com';
    
    //HttpUtils general initialization
    var tools = new htmlTools(mockedHttpProvider,500,mockedUrl);

    //Async action - recursion logics
      before(function(done){          
        tools.recursiveTraversion(mockedUrl);
        done(); //finished initialization
    });
    
    it('should work recursively', function(){
        //Object was filled in the 'before' method, let's check if it was filled correctly.
        
        //Prepare                                  
         var expectedResult = {'http://test.com/page1':{assets:[]},
                                'http://test.com/page2':{assets:[]}
        };

        //act
        const result = tools.visitedList;
        
        //assert
        assert.deepEqual(result,expectedResult,'recursion test failed')
    })
});