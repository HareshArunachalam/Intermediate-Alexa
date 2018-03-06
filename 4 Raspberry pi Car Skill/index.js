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
        var Welcome_Message = 'Welcome to Raspberry Pi car skill, you can ask car to move forward or backward, turn right or left';
        this.emit(':ask', Welcome_Message, Welcome_Message);
    },
    'DirectionIntent': function () {
        var direction = this.event.request.intent.slots.direction.value;
        if (direction === null) { 
            var speech = "Please tell a direction";
        } else if((direction === "forward") || (direction === "backward")){
            speech =  'Moving ' + direction;
        } else if((direction === "right") || (direction === "left")){
			speech =  'Turning ' + direction;
		}
        data.Direction = direction;
        updateShadow(data, status => {
            this.emit(':ask',speech,speech);
        });
    },
    'AMAZON.HelpIntent': function () {
        var Help_Message = 'You can control the car by saying either, move forward or move backward or turn right or turn left';
        this.emit(':ask', Help_Message, Help_Message);
    },
    'AMAZON.CancelIntent': function () {
		this.emit(':tell','Thank you');
    },
    'AMAZON.StopIntent': function () {
		this.emit(':tell','Thank you');
    }
};

function updateShadow(UserData, EmitEvent) {
    var AWS = require('aws-sdk');
    AWS.config.region = "us-east-1";
    var Update_Parameters = {
        "thingName" : "RaspberryPi",
        "payload" : JSON.stringify(
            { "state":
                { "desired": UserData            
                }
            }
        )
    };
    var iotData = new AWS.IotData({endpoint: "a37ldu8h984ovd.iot.us-east-1.amazonaws.com"});
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

