import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BOARD)
m1_p1 = 16
m1_p2 = 18
m1_en = 22
GPIO.setup(m1_p1,GPIO.OUT)
GPIO.setup(m1_p2,GPIO.OUT)
GPIO.setup(m1_en,GPIO.OUT)
print("clockwise")
GPIO.output(m1_p1,GPIO.HIGH)
GPIO.output(m1_p2,GPIO.LOW)
GPIO.output(m1_en,GPIO.HIGH)
time.sleep(3)
print("counter-clockwise")
GPIO.output(m1_p1,GPIO.LOW)
GPIO.output(m1_p2,GPIO.HIGH)
GPIO.output(m1_en,GPIO.HIGH)
time.sleep(3)
print("stop")
GPIO.output(m1_en,GPIO.LOW)

GPIO.cleanup()


