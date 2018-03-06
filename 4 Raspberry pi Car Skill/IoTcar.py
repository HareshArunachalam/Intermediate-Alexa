from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import time
import json
import RPi.GPIO as GPIO

global k
k = " "

GPIO.setwarnings(False)
m1_p1 = 16
m1_p2 = 18
m1_en = 22
m2_p1 = 19
m2_p2 = 21
m2_en = 23
GPIO.setmode(GPIO.BOARD)
GPIO.setup(m1_p1,GPIO.OUT)
GPIO.setup(m1_p2,GPIO.OUT)
GPIO.setup(m2_p1,GPIO.OUT)
GPIO.setup(m2_p2,GPIO.OUT)
GPIO.setup(m1_en,GPIO.OUT)
GPIO.setup(m2_en,GPIO.OUT)



def customCallback(client, userdata, message):
	payload_json = json.loads(message.payload)
	global k
	k = payload_json["state"]["desired"]["Direction"]

host = "a37ldu8h984ovd.iot.us-east-1.amazonaws.com"
rootCAPath = "/home/pi/certificates/rootCA.pem"
certificatePath = "/home/pi/certificates/certificate.pem.crt"
privateKeyPath = "/home/pi/certificates/private.pem.key"
clientId = "RPI3"
topic = "$aws/things/RaspberryPi/shadow/update/accepted"

myAWSIoTMQTTClient = None
myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureDrainingFrequency(2)  
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  

myAWSIoTMQTTClient.connect()
myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
time.sleep(2)

try:	
	while True:
      	if k=='forward':
			print("Going Forward")
			GPIO.output(m1_p1,GPIO.HIGH)
			GPIO.output(m1_p2,GPIO.LOW)
			GPIO.output(m1_en,GPIO.HIGH)
			GPIO.output(m2_p1,GPIO.LOW)
			GPIO.output(m2_p2,GPIO.HIGH)
			GPIO.output(m2_en,GPIO.HIGH)
			time.sleep(0.5)
			GPIO.output(m1_en,GPIO.LOW)
			GPIO.output(m2_en,GPIO.LOW)
		elif k=='backward':
			print ("Going Backward")
			GPIO.output(m1_p1,GPIO.LOW)
			GPIO.output(m1_p2,GPIO.HIGH)
			GPIO.output(m1_en,GPIO.HIGH)
			GPIO.output(m2_p1,GPIO.HIGH)
			GPIO.output(m2_p2,GPIO.LOW)
			GPIO.output(m2_en,GPIO.HIGH)
			time.sleep(0.5)
			GPIO.output(m1_en,GPIO.LOW)
			GPIO.output(m2_en,GPIO.LOW)
		elif k=='right':
			print ("Going Right")
			GPIO.output(m1_p1,GPIO.HIGH)
			GPIO.output(m1_p2,GPIO.LOW)
			GPIO.output(m1_en,GPIO.HIGH)
			GPIO.output(m2_p1,GPIO.HIGH)
			GPIO.output(m2_p2,GPIO.LOW)
			GPIO.output(m2_en,GPIO.HIGH)
			time.sleep(0.5)
			GPIO.output(m1_en,GPIO.LOW)
			GPIO.output(m2_en,GPIO.LOW)
		elif k=='left':
			print ("Going Left")
			GPIO.output(m1_p1,GPIO.LOW)
			GPIO.output(m1_p2,GPIO.HIGH)
			GPIO.output(m1_en,GPIO.HIGH)
			GPIO.output(m2_p1,GPIO.LOW)
			GPIO.output(m2_p2,GPIO.HIGH)
			GPIO.output(m2_en,GPIO.HIGH)
			time.sleep(0.5)
			GPIO.output(m1_en,GPIO.LOW)
			GPIO.output(m2_en,GPIO.LOW)
		k = " "
		time.sleep(1)

except KeyboardInterrupt:
		GPIO.cleanup()


