var request = require('request');

module.exports={
    validateInput:function(args){
        if (args.length<=2){
                    console.log('Usage: '+__filename+" [URL] [MaxNumOfPages | optional, default=200].\r\nExample: "+__filename+" http://google.com 500");
                    return false;
            }
            return true;
    },

    requestWrapper:function(url, callback){
       request(url, callback);
    }
}