"use strict" ;

const http = require('http');
const fs = require('fs');

const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

fs.readFile('./experimente/dvdlogo/index.node.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write(html);
        response.end();  
    }).listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
});
