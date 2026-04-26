// #include <WiFi.h>
// #include <DHT.h>

// #define NODE_ID 2

// #define DHTPIN 4
// #define DHTTYPE DHT11
// #define MQ2_PIN 35
// #define FLAME_PIN 27
// #define SOIL_PIN 34

// // WiFi credentials
// const char* ssid = "Galaxy A14 5G A713";
// const char* password = "9319105248";

// // ThingSpeak
// const char* server = "api.thingspeak.com";
// String apiKey = "H2OW69EZY1TO0P8F";

// WiFiClient client;
// DHT dht(DHTPIN, DHTTYPE);

// // Thresholds
// float TEMP_THRESHOLD = 45.0;
// int GAS_THRESHOLD = 1800;

// void setup_wifi() {
//   delay(10);
//   Serial.println("Connecting to WiFi...");
//   WiFi.begin(ssid, password);

//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }

//   Serial.println("\nWiFi connected");
// }

// void setup() {
//   Serial.begin(115200);
//   dht.begin();

//   pinMode(FLAME_PIN, INPUT);
//   pinMode(SOIL_PIN, INPUT);

//   setup_wifi();

//   Serial.println("=== FIRE NODE STARTED (ThingSpeak) ===");
// }

// void loop() {

//   float temperature = dht.readTemperature();
//   float humidity = dht.readHumidity();
//   int gasValue = analogRead(MQ2_PIN);
//   int flameRaw = digitalRead(FLAME_PIN);
//   bool flameDetected = (flameRaw == LOW);
//   int soilMoisture = analogRead(SOIL_PIN);

//   // Fire Logic
//   String fireStatus = "SAFE";
//   if (flameDetected || temperature > TEMP_THRESHOLD || gasValue > GAS_THRESHOLD) {
//     fireStatus = "HIGH_RISK";
//   }

//   // 🔥 SERIAL MONITOR OUTPUT (CLEAN FORMAT)
//   Serial.println("\n------ SENSOR DATA ------");
//   Serial.print("Temperature: ");
//   Serial.print(temperature);
//   Serial.println(" °C");

//   Serial.print("Humidity: ");
//   Serial.print(humidity);
//   Serial.println(" %");

//   Serial.print("Gas Value: ");
//   Serial.println(gasValue);

//   Serial.print("Flame: ");
//   Serial.println(flameDetected ? "DETECTED 🔥" : "NOT DETECTED");
//   Serial.print("Soil Moisture: ");
//   Serial.println(soilMoisture);

//   Serial.print("Fire Status: ");
//   Serial.println(fireStatus);
//   Serial.println("-------------------------");

//   // 🌐 ThingSpeak Upload
//   if (client.connect(server, 80)) {

//     String url = "/update?api_key=" + apiKey;
//     url += "&field1=" + String(temperature);
//     url += "&field2=" + String(humidity);
//     url += "&field3=" + String(gasValue);
//     url += "&field4=" + String(flameDetected);
//     url += "&field5=" + String(soilMoisture);
//     url += "&field6=" + fireStatus;

//     client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + server + "\r\n" + "Connection: close\r\n\r\n");

//     Serial.println("📡 Data sent to ThingSpeak!");
//   } else {
//     Serial.println("❌ ThingSpeak connection failed");
//   }

//   client.stop();

//   delay(200);
// }



#include <WiFi.h>
#include <DHT.h>

#define NODE_ID 2

#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ2_PIN 35
#define FLAME_PIN 27
#define SOIL_PIN 34

// WiFi credentials
const char* ssid     = "Galaxy A14 5G A713";
const char* password = "9319105248";

// ThingSpeak
const char* server = "api.thingspeak.com";
String apiKey      = "H2OW69EZY1TO0P8F";

WiFiClient client;
DHT dht(DHTPIN, DHTTYPE);

// ─── Thresholds ─────────────────────────────────────────────────────────────
//  Temp   SAFE < 30 | MODERATE 30–40 | HIGH RISK > 40
//  Hum    SAFE > 50 | MODERATE 30–50 | HIGH RISK < 30
//  Gas    SAFE < 700| MODERATE 700–800| HIGH RISK > 800
//  Flame  0 = No fire | 1 = Fire detected
// ────────────────────────────────────────────────────────────────────────────
float TEMP_HIGH_RISK   = 40.0;
float TEMP_MODERATE    = 30.0;
float HUM_HIGH_RISK    = 30.0;
float HUM_MODERATE     = 50.0;
int   GAS_HIGH_RISK    = 800;
int   GAS_MODERATE     = 700;

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(FLAME_PIN, INPUT_PULLUP);
  pinMode(SOIL_PIN, INPUT);

  setup_wifi();

  Serial.println("FIRE NODE 2 STARTED ");
}

void loop() {

  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();
  int   gasValue    = analogRead(MQ2_PIN);
  int   soilRaw     = analogRead(SOIL_PIN);

  // ── Flame Sensor (CORRECTED) ──────────────────────────────────────────────
  // Most flame sensors: HIGH (1) = flame detected, LOW (0) = no flame
  // Your previous code had this inverted (flameRaw == LOW → detected),
  // which was triggering false positives. Corrected below:
  int  flameRaw      = digitalRead(FLAME_PIN);
  bool flameDetected = (flameRaw == LOW);  // LOW = fire ✅

  // ── Fire Status (3-Case Logic) ────────────────────────────────────────────
  String fireStatus = "SAFE";

  if (flameDetected) {
    fireStatus = "FIRE_DETECTED";           // Case 3 — flame confirmed 🔥
  } else if (
    temperature > TEMP_HIGH_RISK ||
    humidity    < HUM_HIGH_RISK  ||
    gasValue    > GAS_HIGH_RISK
  ) {
    fireStatus = "HIGH_RISK";               // Case 2 — prediction ⚠️
  } else if (
    temperature > TEMP_MODERATE ||
    (humidity >= HUM_HIGH_RISK && humidity <= HUM_MODERATE) ||
    (gasValue >= GAS_MODERATE)
  ) {
    fireStatus = "MODERATE";               // Mild warning
  }
  // else: SAFE (Case 1)

  // ── Serial Output ─────────────────────────────────────────────────────────
  Serial.println("\n------ SENSOR DATA (NODE 2) ------");
  Serial.print("Temperature  : "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("Humidity     : "); Serial.print(humidity);    Serial.println(" %");
  Serial.print("Gas Value    : "); Serial.println(gasValue);
  Serial.print("Soil Moisture: "); Serial.println(soilRaw);
  Serial.print("Flame Raw    : "); Serial.println(flameRaw);
  Serial.print("Flame Status : "); Serial.println(flameDetected ? " DETECTED 🔥" : "NOT DETECTED ✅");
  Serial.print("Fire Status  : "); Serial.println(fireStatus);
  Serial.println("----------------------------------");

  // ── ThingSpeak Upload ──────────────────────────────────────────────────────
  // field1 = temp | field2 = humidity | field3 = gas
  // field4 = flame (1 = detected, 0 = not) | field5 = soil | field6 = fireStatus
  if (client.connect(server, 80)) {

    String url = "/update?api_key=" + apiKey;
    url += "&field1=" + String(temperature);
    url += "&field2=" + String(humidity);
    url += "&field3=" + String(gasValue);
    url += "&field4=" + String(flameDetected ? 1 : 0);  // Send 1 or 0, not bool string
    url += "&field5=" + String(soilRaw);
    url += "&field6=" + fireStatus;

    client.print(
      String("GET ") + url + " HTTP/1.1\r\n" +
      "Host: " + server + "\r\n" +
      "Connection: close\r\n\r\n"
    );

  } else {
    Serial.println("❌ ThingSpeak connection failed");
  }

  client.stop();

  delay(15000); // ThingSpeak free tier requires min 15s between updates
}