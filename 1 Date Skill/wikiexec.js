"use strict"
var wiki = require('./wiki.js') 
var Data = {};

wiki.DataFromWikipedia("26_September", function callback(data){
			Data.Events = "The list of events that occured on this date, " + data.Data1[0] + data.Data1[1] + data.Data1[2];
			Data.Births = "The famous personalities born on this date, " + data.Data2[0] + data.Data2[1] + data.Data2[2]+ data.Data2[3]+ data.Data2[4];
			Data.Deaths = "The famous personalities who died on this date, " + data.Data3[0] + data.Data3[1] + data.Data3[2]+ data.Data3[3]+ data.Data3[4];			
});
setTimeout(function (){console.log(Data)}, 2000);

