"use strict";
var eventText = "\u2013 Arab\u2013Byzantine wars: The Battle of Yarmouk between Byzantine Empire and Rashidun Caliphate begins." 
var r = /\\u([\d\w]{4})/gi;
eventText = eventText.replace(r, function (match, grp) {
			return String.fromCharCode(parseInt(grp, 16)); } );
eventText = unescape(eventText);
console.log(eventText);


