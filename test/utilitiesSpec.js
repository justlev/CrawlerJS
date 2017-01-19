var expect = require('chai').expect;
var utils = require('../src/utilities');

describe('utilities', function(){
    it('should success when at leaset 2 variables are passed', function(){
        //Prepare
        var args = ['node','crawler.js','http://example.com'];

        //act
        var result = utils.validateInput(args);

        //assert
        expect(result).to.be.ok;
    });

        it('should fail when less than 2 variables are passed', function(){
        //Prepare
        var args = ['crawler.js'];

        //act
        var result = utils.validateInput(args);

        //assert
        expect(result).to.not.be.ok;
    });
})