//Multiplexer
//https://electropeak.com/learn/interfacing-cd74hc4067-16-channel-analog-digital-multiplexer-with-arduino/

//

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <InfluxDbClient.h>
#include <MQUnifiedsensor.h>

#define         Board                   ("ESP8266")
#define         Pin                     (A0)  //Analog input of ESP8266
#define         Voltage_Resolution      (3.3) // Voltage, for ESP8266 it's 3V3
#define         ADC_Bit_Resolution      (10) // For ESP8266
#define         RatioMQ2CleanAir        (9.83)
#define         RatioMQ3CleanAir        (60)
#define         RatioMQ4CleanAir        (4.4)
#define         RatioMQ7CleanAir        (27.5)
#define         RatioMQ135CleanAir      (3.6) // Ratio for specific sensor

#define WIFI_SSID "redacted"
#define WIFI_PASSWORD "redacted"
  
#define INFLUXDB_URL "http://192.168.0.21:8086"
#define INFLUXDB_TOKEN "zA6Xc1z7KiyiW8ebtx4YZDJJza2l0iIhng3xfDlwFBKigTPTS1zY-sOWEK93zuuYLl8-Oav_zv24-guCTkp5Yw=="
#define INFLUXDB_ORG "0ea4666e1b25eb2e"
#define INFLUXDB_BUCKET "sniffy"

float monoxide = 0;
float dioxide = 0;
float ethanol = 0;
float methanol = 0;
float combustible = 0;

MQUnifiedsensor MQ2(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, "MQ-2");
MQUnifiedsensor MQ3(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, "MQ-3");
MQUnifiedsensor MQ4(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, "MQ-4");
MQUnifiedsensor MQ7(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, "MQ-7");
MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, "MQ-135");

InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN);
Point data("sniffy");

void setup()
{
    Serial.begin(115200);

    //Setup WiFi
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  
    MQ2.setRegressionMethod(1);
    MQ2.init();
    MQ3.setRegressionMethod(1);
    MQ3.init();
    MQ4.setRegressionMethod(1);
    MQ4.init();
    MQ7.setRegressionMethod(1);
    MQ7.init();
    MQ135.setRegressionMethod(1);
    MQ135.init();

    float calcR0MQ2 = 0;
    float calcR0MQ3 = 0;
    float calcR0MQ4 = 0;
    float calcR0MQ7 = 0;
    float calcR0MQ135 = 0;
    for(int i = 1; i<=10; i ++)
    {
      MQ2.update();
      MQ3.update();
      MQ4.update(); 
      MQ7.update(); 
      MQ135.update(); 
      calcR0MQ2 += MQ2.calibrate(RatioMQ2CleanAir);
      calcR0MQ3 += MQ3.calibrate(RatioMQ3CleanAir);
      calcR0MQ4 += MQ4.calibrate(RatioMQ4CleanAir);
      calcR0MQ7 += MQ7.calibrate(RatioMQ7CleanAir);
      calcR0MQ135 += MQ135.calibrate(RatioMQ135CleanAir);
      Serial.print(".");
    }
    MQ2.setR0(calcR0MQ2/10);
    MQ3.setR0(calcR0MQ3/10);
    MQ4.setR0(calcR0MQ4/10);
    MQ7.setR0(calcR0MQ7/10);
    MQ135.setR0(calcR0MQ135/10);

    data.addTag("device", "Sniffy");
}

void loop()
{
  // Clear all fields to accept new measurements
  data.clearFields();

  //Update sensor data
  MQ2.update();
  // Read combustible gases
  MQ2.setA(658.71); MQ2.setB(-2.168);
  combustible = MQ2.readSensor();
  Serial.print("Combust: ");
  Serial.println(combustible);


  MQ3.update();
  // Read Alcohol
  MQ3.setA(0.3934); MQ3.setB(-1.504);
  ethanol = MQ3.readSensor();
  Serial.print("Alcohol: ");
  Serial.println(ethanol);

  MQ4.update();
  // Read CH4
  MQ4.setA(1012.7); MQ4.setB(-2.786); //Configure the equation to calculate methanol concentration value
  methanol = MQ4.readSensor(); // SSensor will read PPM concentration using the model, a and b values set previously or from the setup
  Serial.print("CH4: ");
  Serial.println(methanol);

  MQ7.update();
  // Read C0
  MQ7.setA(99.042); MQ7.setB(-1.518); // Configure the equation to calculate CO concentration value
  monoxide = MQ135.readSensor(); // Sensor will read PPM concentration using the model, a and b values set previously or from the setup
  Serial.print("C0: ");
  Serial.println(monoxide);

  MQ135.update();
  // Read CO2
  MQ135.setA(110.47); MQ135.setB(-2.862); // Configure the equation to calculate CO2 concentration value
  dioxide = MQ135.readSensor() + 400; // Sensor will read PPM concentration using the model, a and b values set previously or from the setup
  Serial.print("CO2: ");
  Serial.println(dioxide);

  //Add sensors data to InfluxDB Point
  data.addField("monoxide", monoxide);
  data.addField("dioxide",dioxide);
  data.addField("ethanol",ethanol);
  data.addField("methanol",methanol);
  data.addField("combustible",combustible);

  // Send data to database;
  // client.writePoint(data);

  // Delay for 1 second before getting next measurement 
  delay(1000);
}