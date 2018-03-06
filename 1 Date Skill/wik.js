"use strict";
var https = require('https')
var urlPrefix = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles="
var url = urlPrefix + "15_August";
https.get(url, function(response) {
        var body = '';

        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
			console.log(body);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });


