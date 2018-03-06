'use strict';
const Alexa = require('alexa-sdk');
const wiki = require('./wiki.js');
var Data = [];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = "amzn1.ask.skill.af944269-ac4e-4b34-b254-86e4b6a672ee";
    alexa.registerHandlers(handlers);
    initialize(event,function(){
        alexa.execute();
    });
};

function initialize(event,callback){
    if(event.session.attributes.Wiki === undefined){
        event.session.attributes.Wiki={};
    }
    callback();
}
const handlers = {
    'LaunchRequest': function () {
        var Welcome_message = "Welcome to the date skill, I will tell the events, births and deaths that occurred on a date. For example, you can ask me, What are the events that occurred on 15th August ?";
        this.emit(":askWithCard",Welcome_message,Welcome_message,"The Date Skill",Welcome_message);    
    },
    'EventIntent': function () {
        var date = new Date(this.event.request.intent.slots.Date.value);
        var Formatted_date = date.getDate() + "_" + months[(date.getMonth())];
        var self = this;
        wiki.DataFromWikipedia(Formatted_date, function callback(data){
			Data[0] = "The list of events that occurred on this date, <p> " + data.Data1[0] + "</p> <p>" + data.Data1[1] + "</p> <p>" + data.Data1[2] + "</p>";
			Data[1] = "The famous personalities born on this date, <p> " + data.Data2[0] + "</p> <p>" + data.Data2[1] + "</p> <p>" + data.Data2[2] + "</p>";
			Data[2] = "The famous personalities who died on this date, <p> " + data.Data3[0] + "</p> <p>" + data.Data3[1] + "</p> <p>" + data.Data3[2] + "</p>";
        });
        function response(){
            self.attributes.Wiki.index = 0;
            var EventData = Data[0];
            var EventDataCard = EventData.replace(/(<([^>]+)>)/ig, "\n");
            self.emit(':askWithCard',EventData + "Do you wish to know the famous personalities born on this date?",EventData + "Do you wish to know the famous personalities born on this date?","Events on this date",EventDataCard);
        }
        setTimeout(function (){response();}, 2000);
    },

    'AMAZON.YesIntent' : function(){
		this.attributes.Wiki.index = this.attributes.Wiki.index + 1;
		var index = this.attributes.Wiki.index;
		if(index === 1){
			var BirthsData = Data[index];
			var BirthsDataCard = BirthsData.replace(/(<([^>]+)>)/ig, "\n");
			this.emit(':askWithCard',BirthsData + "Do you wish to know the famous personalities who died on this date?", BirthsData + "Do you wish to know the famous personalities who died on this date?","Births on this date",BirthsDataCard);    
		}else if(index === 2){
			var DeathsData = Data[index];
			var DeathsDataCard = DeathsData.replace(/(<([^>]+)>)/ig, "\n");
			this.emit(':tellWithCard',DeathsData + "come again with another date. See you again soon.","Deaths on this date",DeathsDataCard);
		}
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', 'Thank you, See you again soon');
    },
    'AMAZON.HelpIntent': function () {
        const Help_message = "Give me a date, and I will tell the events, births and deaths on the date. Try asking me What are the events that occured on 15th August";
        this.emit(':ask', Help_message, Help_message);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Thank you, See you again soon');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Thank You, See you again soon');
    }
};

 