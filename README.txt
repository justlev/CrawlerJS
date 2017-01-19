Installation:
npm install

Usage (run the following command from the current directory):
node ./src/crawler.js [ROOT_URL] [MAXIMUM_PAGES_TO_TRAVERSE]


Directory structure:
src  - source code
|
|
----- crawler.js - main file
----- htmlTools.js - the HTML traversing / filtering logics
----- utilities.js - General utilities

test - Tests
|
|
----- crawlerSpec.js - main cralwer logics tests
----- utilitiesSpec.js - tests for the command line utilities
----- recursionSpec.js - whole flow test.

Dependencies:
 "request": "^2.79.0"  - The http wrapping library for simplicity
 "cheerio": "^0.22.0"  - For accessing the dom comfortably from the code. 

 Dev-Dependencies (Only for testing purposes):
"chai": "^3.5.0",  -  for assertions / expectations
"mocha": "^3.2.0"  -  Tests framework



