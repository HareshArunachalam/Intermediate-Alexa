'use strict';
var Alexa = require('alexa-sdk');
var data = {};

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var Welcome_Message = 'Welcome to Simple IoT skill, open the webapp on your browser and tell, greet my web app thing';
        this.emit(':ask', Welcome_Message, Welcome_Message);
    },
    'HelloIntent': function () {
        data.hello = "Hello";
        var self = this;
        updateShadow(data, function() {
            self.emit(':tell',"Hello to your web app thing ");
        });
    },
    'AMAZON.HelpIntent': function () {
        var Help_Message = 'This is a simple IoT skill, open the webapp on your browser and tell, greet web app thing';
        this.emit(':ask', Help_Message, Help_Message);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Thank you');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell','Thank you');
    }
};

function updateShadow(UserData, EmitEvent) {
    var AWS = require('aws-sdk');
    AWS.config.region = "us-east-1"; //Enter your AWS Region
    var ParamsUpdate = {
        "thingName" : " ", //Enter your thing's Name
        "payload" : JSON.stringify(
            { "state":
                { "desired": UserData            
                }
            }
        )
    };
    var iotData = new AWS.IotData({endpoint: " "}); //Enter your AWS IoT REST API Endpoint here
    iotData.updateThingShadow(ParamsUpdate, function(err, data)  {
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

 
