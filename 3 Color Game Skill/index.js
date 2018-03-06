'use strict';
var Alexa = require('alexa-sdk');
var data = {};

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        var Welcome_Message = 'Welcome to color game, open the webapp on your browser and then say, start the game to start';
        this.emit(':ask', Welcome_Message, Welcome_Message);
    },
    'StartIntent': function(){
        var Start_Message = 'The game has started, try guessing the colors of the text';
        data.Status = "start";
        data.Color = " ";
        updateShadow(data, status => {
            this.emit(':ask',Start_Message,Start_Message);
        });
    },
    'ColorIntent': function () {
        var color = this.event.request.intent.slots.color.value;
        if (color === null) { 
            var speech = "Please guess a color";
        } else {
            speech =  ' You said ' + color;
        }
        data.Color = color;
        updateShadow(data, status => {
            this.emit(':ask',speech,speech);
        });
    },
    'AMAZON.HelpIntent': function () {
        var Help_Message = 'Open the color game web app on the browser and then say, start the game to start and start guessing the color of the text';
        this.emit(':ask', Help_Message, Help_Message);
    },
    'AMAZON.CancelIntent': function () {
        data.Status = "stop";
        updateShadow(data, status => {
            this.emit(':tell','Thank you');
        });
    },
    'AMAZON.StopIntent': function () {
        data.Status = "stop";
        updateShadow(data, status => {
            this.emit(':tell','Thank you');
        });
    }
};

function updateShadow(UserData, EmitEvent) {
    var AWS = require('aws-sdk');
    AWS.config.region = "us-east-1";//Enter your AWS region here
    var Update_Parameters = {
        "thingName" : "YourThingName",//Enter your Thing's Name
        "payload" : JSON.stringify(
            { "state":
                { "desired": UserData            
                }
            }
        )
    };
    var iotData = new AWS.IotData({endpoint: " "});//Enter your AWS IoT REST API Endpoint here
    iotData.updateThingShadow(Update_Parameters, function(err, data)  {
        if (err){
            console.log(err);
            EmitEvent();
        }
        else {
            console.log("Updated thing shadow");
            EmitEvent();
        }
    });
}

