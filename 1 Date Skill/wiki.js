"use strict"
var https = require('https')
var urlPrefix = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&exsectionformat=plain&redirects=&titles="

function DataFromWikipedia(date, eventCallback) {
    var url = urlPrefix + date;

    https.get(url, function(response) {
        var body = '';

        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function parseJson(inputText) {
    var Eventstext = inputText.substring(inputText.indexOf("\\nEvents\\n")+10, inputText.indexOf("\\n\\n\\nBirths")),
		Birthstext = inputText.substring(inputText.indexOf("\\nBirths\\n")+ 10, inputText.indexOf("\\n\\n\\nDeaths")),
		Deathstext = inputText.substring(inputText.indexOf("\\nDeaths\\n")+ 10, inputText.indexOf("\\n\\n\\nHolidays and observances")),
		Deaths = [],
		DeathsEnd,
		DeathsStart = 0,
		Births = [],
		BirthsEnd,
		BirthsStart = 0,
        Events = [],
        EventsEnd,
        EventsStart = 0;
    if (Eventstext.length == 0) {
        return Events;
    }else if(Birthstext.length === 0){
		return Births;
	}else if(Deathstext.length === 0){
		return Deaths;
	}
    while(true) {
        EventsEnd = Eventstext.indexOf("\\n", EventsStart+2);
        var eventText = (EventsEnd == -1 ? Eventstext.substring(EventsStart) : Eventstext.substring(EventsStart, EventsEnd));
		var r = /\\u([\d\w]{4})/gi;
		eventText = eventText.replace(r, function (match, grp) {
			return String.fromCharCode(parseInt(grp, 16)); } );
		eventText = unescape(eventText);
        eventText = 'In the year ' + eventText + " ";
        EventsStart = EventsEnd+2;
        Events.push(eventText);
        if (EventsEnd == -1) {
            break;
        }
    }
	while(true) {
        BirthsEnd = Birthstext.indexOf("\\n", BirthsStart+2);
        var birthText = (BirthsEnd == -1 ? Birthstext.substring(BirthsStart) : Birthstext.substring(BirthsStart, BirthsEnd));
        var r = /\\u([\d\w]{4})/gi;
		birthText = birthText.replace(r, function (match, grp) {
			return String.fromCharCode(parseInt(grp, 16)); } );
		birthText = unescape(birthText);
        birthText = 'In the year ' + birthText + ". ";
        BirthsStart = BirthsEnd+2;
        Births.push(birthText);
        if (BirthsEnd == -1) {
            break;
        }
    }
	while(true) {
        DeathsEnd = Deathstext.indexOf("\\n", DeathsStart+2);
        var deathText = (DeathsEnd == -1 ? Deathstext.substring(DeathsStart) : Deathstext.substring(DeathsStart, DeathsEnd));
        var r = /\\u([\d\w]{4})/gi;
		deathText = deathText.replace(r, function (match, grp) {
			return String.fromCharCode(parseInt(grp, 16)); } );
		deathText = unescape(deathText);
        deathText = 'In the year ' + deathText + ". ";
        DeathsStart = DeathsEnd+2;
        Deaths.push(deathText);
        if (DeathsEnd == -1) {
            break;
        }
    }
    Births.reverse();
    Events.reverse();
	Deaths.reverse();
	var Data = {Data1 : Events, Data2 : Births, Data3 : Deaths};
    return Data;
}
	
module.exports.DataFromWikipedia = DataFromWikipedia;
