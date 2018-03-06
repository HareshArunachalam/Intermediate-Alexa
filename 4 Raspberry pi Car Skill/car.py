import time
import RPi.GPIO as GPIO

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

try:
	while True:
		k = raw_input("Give the direction: ");
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

except KeyboardInterrupt:
		GPIO.cleanup()
