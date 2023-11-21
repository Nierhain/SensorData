#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>
#include <MQUnifiedsensor.h>

#define Board ("ESP8266")
#define MQ135Pin (A0)
#define Voltage_Resolution (3.3)
#define ADC_Bit_Resolution (10)
#define RatioMQ135CleanAir (3.6)

#define INFLUXDB_URL "redacted"
#define INFLUXDB_TOKEN "redacted"
#define INFLUXDB_ORG "redacted"
#define INFLUXDB_BUCKET "redacted"

// WLAN AccessPoint
const char *ssid = "redacted";
const char *password = "redacted";

bool ledState = 0;
const int ledPin = 2;

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <style>
            html {
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
            }
            h1 {
                font-size: 1.8rem;
                color: white;
            }
            h2 {
                font-size: 1.5rem;
                font-weight: bold;
                color: #143642;
            }
            .topnav {
                overflow: hidden;
                background-color: #143642;
            }
            body {
                margin: 0;
            }
            .content {
                padding: 30px;
                max-width: 600px;
                margin: 0 auto;
            }
            .card {
                background-color: #f8f7f9;
                box-shadow: 2px 2px 12px 1px rgba(140, 140, 140, 0.5);
                padding: 50px;
                height: 400px;
            }
            .controls {
                position: relative;
                height: 300px;
            }
            .button {
                position: absolute;
                padding: 15px 50px;
                font-size: 24px;
                text-align: center;
                outline: none;
                color: #fff;
                background-color: #0f8b8d;
                border: none;
                border-radius: 5px;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }
            #left {
                top: 100px;
                left: 0;
            }
            #right {
                top: 100px;
                left: 330px;
            }
            #stop {
                top: 100px;
                left: 160px;
            }

            #back {
                top: 160px;
                left: 130px;
            }
            #forward {
                top: 35px;
                left: 145px;
            }
            /*.button:hover {background-color: #0f8b8d}*/
            .button:active {
                background-color: #0f8b8d;
                box-shadow: 2 2px #cdcdcd;
                transform: translateY(2px);
            }
            .state {
                font-size: 1.5rem;
                color: #8c8c8c;
                font-weight: bold;
            }
        </style>
        <title>Sniffy-Steuerung</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:," />
    </head>
    <body>
        <div class="topnav">
            <h1>Sniffy - Steuerung</h1>
        </div>
        <div class="content">
            <div class="card">
                <div class="controls">
                    <button id="forward" class="button">Vorwärts</button>
                    <button id="left" class="button">Links</button>
                    <button id="right" class="button">Rechts</button>
                    <button id="back" class="button">Rückwärts</button>
                    <button id="stop" class="button">STOP</button>
                </div>
            </div>
        </div>
        <script>
            var gateway = `ws://192.168.178.27/ws`;
            var websocket;
            window.addEventListener("load", onLoad);
            function initWebSocket() {
                console.log("Trying to open a WebSocket connection...");
                websocket = new WebSocket(gateway);
                websocket.onopen = onOpen;
                websocket.onclose = onClose;
            }
            function onOpen(event) {
                console.log("Connection opened");
            }
            function onClose(event) {
                console.log("Connection closed");
                setTimeout(initWebSocket, 2000);
            }
            function onLoad(event) {
                initWebSocket();
                initButton();
            }
            function initButton() {
                document
                    .getElementById("forward")
                    .addEventListener("click", forward);
                document.getElementById("back").addEventListener("click", back);
                document.getElementById("left").addEventListener("click", left);
                document
                    .getElementById("right")
                    .addEventListener("click", right);
                document.getElementById("stop").addEventListener("click", stop);
            }
            function forward() {
                websocket.send("forward");
            }
            function left() {
                websocket.send("left");
            }
            function right() {
                websocket.send("right");
            }
            function back() {
                websocket.send("back");
            }
            function stop() {
                websocket.send("stop");
            }
        </script>
    </body>
</html>
)rawliteral";


// Motoren Pins
int motor_left[] = { 5, 4 };
int motor_right[] = { 0, 2 };

// Vorwärts fahren
void drive_back() {
  Serial.println("back");
  digitalWrite(motor_left[1], HIGH);
  digitalWrite(motor_right[1], HIGH);
  delay(400);
  digitalWrite(motor_left[1], LOW);
  digitalWrite(motor_right[1], LOW);
}

// Rückwärts fahren
void drive_forward() {
  Serial.println("forward");
  digitalWrite(motor_left[0], HIGH);
  digitalWrite(motor_right[0], HIGH);
  delay(400);
  digitalWrite(motor_left[0], LOW);
  digitalWrite(motor_right[0], LOW);
}

// nach Links drehen
void turn_left() {
  digitalWrite(motor_left[1], HIGH);
  digitalWrite(motor_right[0], HIGH);
  Serial.println("turn left");
  delay(400);
  digitalWrite(motor_right[0], LOW);
  digitalWrite(motor_left[1], LOW);
}

// nach Rechts drehen
void turn_right() {
  digitalWrite(motor_left[0], HIGH);
  digitalWrite(motor_right[1], HIGH);
  Serial.println("turn right");
  delay(400);
  digitalWrite(motor_left[0], LOW);
  digitalWrite(motor_right[1], LOW);
}
void stop_drive() {
  digitalWrite(motor_left[0], LOW);
  digitalWrite(motor_left[1], LOW);
  digitalWrite(motor_right[0], LOW);
  digitalWrite(motor_right[1], LOW);
}

void notifyClients() {
  ws.textAll(String(ledState));
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    if (strcmp((char *)data, "toggle") == 0) {
      ledState = !ledState;
      notifyClients();
    }
    if (strcmp((char *)data, "left") == 0) {

      turn_left();
    }
    if (strcmp((char *)data, "right") == 0) {

      turn_right();
    }
    if (strcmp((char *)data, "forward") == 0) {

      drive_forward();
    }
    if (strcmp((char *)data, "back") == 0) {

      drive_back();
    }
    if (strcmp((char *)data, "stop") == 0) {
      stop_drive();
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
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

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

String processor(const String &var) {
  Serial.println(var);
  if (var == "STATE") {
    if (ledState) {
      return "ON";
    } else {
      return "OFF";
    }
  }
  return String();
}

float dioxide = 0;
MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ135Pin, "MQ-135");

// Datenbankverbindung und Datensatz vorbereiten
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
Point data("sniffy");

#define TZ_INFO "UTC1"

void setup() {
  // Serial port for debugging purposes
  Serial.begin(115200);

  pinMode(motor_left[0], OUTPUT);
  pinMode(motor_left[1], OUTPUT);
  pinMode(motor_right[0], OUTPUT);
  pinMode(motor_right[1], OUTPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");

  initWebSocket();

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", index_html, processor);
  });

  // Start server
  server.begin();

  // Sensor kalibrieren
  MQ135.setRegressionMethod(1);
  MQ135.init();
  float calcR0MQ135 = 0;
  for (int i = 1; i <= 10; i++) {
    MQ135.update();
    calcR0MQ135 += MQ135.calibrate(RatioMQ135CleanAir);
    Serial.print(".");
  }
  MQ135.setR0(calcR0MQ135 / 10);

  // Datensatz taggen
  data.addTag("device", "Sniffy");
}

void loop() {
  ws.cleanupClients();

  // Unkommentieren, um Daten zu messen und senden
  // data.clearFields();
  // MQ135.update();
  // MQ135.setA(110.47);
  // MQ135.setB(-2.862);                  // Configure the equation to calculate CO2 concentration value
  // dioxide = MQ135.readSensor() + 400;  // Sensor will read PPM concentration using the model, a and b values set previously or from the setup
  // Serial.print("CO2: ");
  // Serial.println(dioxide);
  // data.addField("dioxide", dioxide);
  // // Daten in Datenbank schreiben
  // client.writePoint(data);
  // delay(1000);
}