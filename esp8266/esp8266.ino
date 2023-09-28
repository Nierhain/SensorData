#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include<InfluxDB.h>
#include <MQUnifiedsensor.h>

#define         Board                   ("ESP8266")
#define         Pin                     (A0)  //Analog input of ESP8266
#define         Type                    ("MQ-3") //Sensor Type
#define         Voltage_Resolution      (3.3) // Voltage, for ESP8266 it's 3V3
#define         ADC_Bit_Resolution      (10) // For ESP8266
#define         RatioMQ135CleanAir        (3.6) // Ratio for specific sensor
#define         RatioMQ3CleanAir        (60)

#define WIFI_SSID "Martin Router 'King"
#define WIFI_PASSWORD "rWmnH9o3B!X25RA&m9^*"
  
#define INFLUXDB_URL "http://192.168.0.21:8086"
#define INFLUXDB_TOKEN "zA6Xc1z7KiyiW8ebtx4YZDJJza2l0iIhng3xfDlwFBKigTPTS1zY-sOWEK93zuuYLl8-Oav_zv24-guCTkp5Yw=="
#define INFLUXDB_ORG "0ea4666e1b25eb2e"
#define INFLUXDB_BUCKET "sniffy"'

float monoxide = 0;
float dioxide = 0;
float ethanol = 0;
float methanol = 0;
float combustible = 0;

MQUnifiedsensor MQ2(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);
MQUnifiedsensor MQ3(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);
MQUnifiedsensor MQ4(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);
MQUnifiedsensor MQ7(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);
MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);

InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
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


    data.addTag("device", "Sniffy");
}

void loop()
{
  // Clear all fields to accept new measurements
  data.clearFields();

  //Read sensor
  MQ135.update();
  MQ135.setA(605.18); MQ135.setB(-3.937); // Configure the equation to calculate CO concentration value
  monoxide = MQ135.readSensor(); // Sensor will read PPM concentration using the model, a and b values set previously or from the setup

  MQ135.setA(77.255); MQ135.setB(-3.18); //Configure the equation to calculate Alcohol concentration value
  ethanol = MQ135.readSensor(); // SSensor will read PPM concentration using the model, a and b values set previously or from the setup

  MQ135.setA(110.47); MQ135.setB(-2.862); // Configure the equation to calculate CO2 concentration value
  dioxide = MQ135.readSensor() + 400; // Sensor will read PPM concentration using the model, a and b values set previously or from the setup

  MQ135.setA(44.947); MQ135.setB(-3.445); // Configure the equation to calculate Toluen concentration value
  float Toluen = MQ135.readSensor(); // Sensor will read PPM concentration using the model, a and b values set previously or from the setup
  
  MQ135.setA(102.2 ); MQ135.setB(-2.473); // Configure the equation to calculate NH4 concentration value
  float NH4 = MQ135.readSensor(); // Sensor will read PPM concentration using the model, a and b values set previously or from the setup

  MQ135.setA(34.668); MQ135.setB(-3.369); // Configure the equation to calculate Aceton concentration value
  float Aceton = MQ135.readSensor();

  //Add sensors data to InfluxDB Point
  data.addField("monoxide", monoxide);
  data.addField("dioxide",dioxide);
  data.addField("ethanol",ethanol);
  data.addField("methanol",methanol);
  data.addField("combustible",combustible);

  //Send data to database;
  client.writePoint(data);

  // Delay for 1 second before getting next measurement 
  delay(1000);
}