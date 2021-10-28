  // Project Name: D-Stress
  // Team Members: Kelvin Bian, Amanda Lau, Edmond Niu, TC Taylor, Annie Wang
  // Date: 6/6/2021
  // Task Description: Arduino code that sends sensor values from GSR sensor to serial monitor/plotter

const int GSR=A0;
int sensorValue=0;
int gsr_average=0;
 
void setup(){
  Serial.begin(9600);
}
 
void loop(){
  long sum=0;
  for(int i=0;i<10;i++)           //Average the 10 measurements to remove the glitch
      {
      sensorValue=analogRead(GSR);
      sum += sensorValue;
      delay(5);
      }
   gsr_average = sum/10;
   Serial.println(gsr_average);
}
