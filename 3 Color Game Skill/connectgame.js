const Region         = 'us-east-1';  //Enter your AWS Region
const SubscribeTopic = '$aws/things/YourThingName/shadow/update/accepted'; //Enter your thing's Name
const mqttEndpoint   = " "; //Enter your AWS IoT REST API Endpoint here
const IdentityPoolId = ' '; //Enter your Amazon Cognito Identity Pool ID here

AWS.config.region = Region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
});

checkAWSCredentials();

function checkAWSCredentials() {
    AWS.config.credentials.refresh(function(err) {
        if (err) console.log(err, err.stack); 
        else {                                
            PassCredentials(AWS.config.credentials);
        }
    });
}


function PassCredentials(creds) {

    var cid = clientId();
    console.log('ClientID = ' + cid);
	
    mqttClient = createMQTTClient({
        regionName: Region,
        accessKey: creds.accessKeyId,
        secretKey: creds.secretAccessKey,
        sessionToken: creds.sessionToken,
        endpoint: mqttEndpoint,
        clientId: cid
    });

    connect(mqttClient);

}

function clientId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function createMQTTClient(options) {

    var time = moment.utc();
    var dateStamp = time.format('YYYYMMDD');
    var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    var service = 'iotdevicegateway';
    var region = options.regionName;
    var secretKey = options.secretKey;
    var accessKey = options.accessKey;
    var algorithm = 'AWS4-HMAC-SHA256';
    var method = 'GET';
    var canonicalUri = '/mqtt';
    var host = options.endpoint.toLowerCase();

    var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = SigV4Utils.sha256('');
    var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
  
    var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
    var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    var signature = SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    var requestUrl = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
    if (options.sessionToken) {
        requestUrl += "&X-Amz-Security-Token=" + encodeURIComponent(options.sessionToken);
    }
    return new Paho.MQTT.Client(requestUrl, options.clientId);
}

function SigV4Utils() {}

SigV4Utils.sign = function(key, msg) {
    var hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.sha256 = function(msg) {
    var hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
};

function connect(client) {
    client.connect({
        onSuccess: onConnect,
        onFailure: onConnectionFailure,
        useSSL: true,
        timeout: 30,
        mqttVersion: 4
    });
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
}

function onConnect() {

    console.log("onConnect");

    document.getElementById("status").innerText = 'CONNECTED';

    mqttClient.subscribe(SubscribeTopic);
}

function onConnectionFailure(error) {
    console.log(error);

    document.getElementById("status").innerText = 'CONNECT FAIL';
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        document.getElementById("status").innerText = 'CONNECTION LOST';
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived");
    payload = JSON.parse(message.payloadString);
	input = payload.state.desired
  	console.log(input);
	SetData(input);
} 
