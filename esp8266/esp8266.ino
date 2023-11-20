#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <InfluxDbClient.h>
#include <MQUnifiedsensor.h>



#define         Board                   ("ESP8266")
#define         MQ2Pin                     (A5)  //Analog input of ESP8266
#define         MQ3Pin                     (A0)  //Analog input of ESP8266
#define         MQ4Pin                     (A3)  //Analog input of ESP8266
#define         MQ7Pin                     (A1)  //Analog input of ESP8266
#define         MQ135Pin                   (A2)  //Analog input of ESP8266
#define         Voltage_Resolution      (3.3) // Voltage, for ESP8266 it's 3V3
#define         ADC_Bit_Resolution      (10) // For ESP8266
#define         RatioMQ2CleanAir        (9.83)
#define         RatioMQ3CleanAir        (60)
#define         RatioMQ4CleanAir        (4.4)
#define         RatioMQ7CleanAir        (27.5)
#define         RatioMQ135CleanAir      (3.6) // Ratio for specific sensor

#define WIFI_SSID "redacted"
#define WIFI_PASSWORD "redacted"
  
#define INFLUXDB_URL "http://192.168.178.21:8086"
#define INFLUXDB_TOKEN "S3rTN_HlZ_CCwqh8JlHpF-OlYyjywI6nSjJUbdK7DGFlW7yKnSwbjxl92_h58sEJH0jFLTfhuskyfe1mO5B_3w=="
#define INFLUXDB_ORG "0ea4666e1b25eb2e"
#define INFLUXDB_BUCKET "sniffy"

int motor_left[] = {9, 8};
int motor_right[] = {11, 10};

float monoxide = 0;
float dioxide = 0;
float ethanol = 0;
float methanol = 0;
float combustible = 0;

MQUnifiedsensor MQ2(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ2Pin, "MQ-2");
MQUnifiedsensor MQ3(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ3Pin, "MQ-3");
MQUnifiedsensor MQ4(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ4Pin, "MQ-4");
MQUnifiedsensor MQ7(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ7Pin, "MQ-7");
MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ135Pin, "MQ-135");

InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN);
Point data("sniffy");

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    if (strcmp((char*)data, "left") == 0) {
        turn_left();
    } if (strcmp((char*)data, "right") == 0) {
        turn_right();
    } if (strcmp((char*)data, "back") == 0) {
      drive_back();
    } if (strcmp((char*)data, "forwards") == 0) {
      drive_forward();
    }
  }
}

void eventHandler(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
  }
}

void drive_forward()
{
  digitalWrite(motor_left[0], LOW);
  delayMicroseconds(400);
  digitalWrite(motor_left[1], HIGH);
  delayMicroseconds(1000 - 400);
  digitalWrite(motor_right[0], LOW);
  delayMicroseconds(1000 - 400);
  digitalWrite(motor_right[1], HIGH);
  delayMicroseconds(400);
}

void drive_back()
{
  digitalWrite(motor_left[1], LOW);
  delayMicroseconds(400);
  digitalWrite(motor_left[0], HIGH);
  delayMicroseconds(1000 - 400);
  digitalWrite(motor_right[1], LOW);
  delayMicroseconds(1000 - 400);
  digitalWrite(motor_right[0], HIGH);
  delayMicroseconds(400);
}

void turn_left()
{
    digitalWrite(motor_left[0], LOW);
    digitalWrite(motor_left[1], HIGH);
    digitalWrite(motor_right[0], LOW);
    digitalWrite(motor_right[1], LOW);
    delay(900);
  }

    void turn_right()
  {
    digitalWrite(motor_left[0], LOW);
    digitalWrite(motor_left[1], LOW);
    digitalWrite(motor_right[0], LOW);
    digitalWrite(motor_right[1], HIGH);
    delay(900);
  }

void setup()
{
    Serial.begin(115200);

    //Setup WiFi
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Got IP: ");  Serial.println(WiFi.localIP());
  
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

    ws.onEvent(eventHandler);
    server.addHandler(&ws);
}

void loop()
{
  // Clear all fields to accept new measurements
  data.clearFields();

  // Prevent over saturation when multiple clients are connected
  ws.cleanupClients();

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
  client.writePoint(data);

  // Delay for 1 second before getting next measurement 
  delay(1000);
}