#include <WiFi.h>
#include <DHT.h>
#include <TinyGPS++.h>

// -------- CONFIG --------
#define NODE_ID 1

#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ2_PIN 35
#define FLAME_PIN 27

// WiFi
const char* ssid     = "Wifi username";
const char* password = "password";

// ThingSpeak
const char* server = "api.thingspeak.com";
String apiKey      = "WRITE_API_KEY";

// Objects
WiFiClient tsClient;
DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

// ─── Thresholds ─────────────────────────────────────────────────────────────
//  Temp   SAFE < 30 | MODERATE 30–40 | HIGH RISK > 40
//  Hum    SAFE > 50 | MODERATE 30–50 | HIGH RISK < 30
//  Gas    SAFE < 700| MODERATE 700–800| HIGH RISK > 800
//  Flame  0 = No fire | 1 = Fire detected  (sent to ThingSpeak)
// ────────────────────────────────────────────────────────────────────────────
float TEMP_HIGH_RISK = 40.0;
float TEMP_MODERATE  = 30.0;
float HUM_HIGH_RISK  = 30.0;
float HUM_MODERATE   = 50.0;
int   GAS_HIGH_RISK  = 800;
int   GAS_MODERATE   = 700;

// Timers
unsigned long lastThingSpeak = 0;
unsigned long lastSerial     = 0;

// -------- WIFI --------
void setup_wifi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi FAILED");
  }
}

// -------- SETUP --------
void setup() {
  Serial.begin(115200);

  dht.begin();

  // INPUT_PULLUP keeps pin firmly HIGH when no flame.
  // Sensor pulls it LOW on detection → active-low, no false positives.
  pinMode(FLAME_PIN, INPUT_PULLUP);

  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);

  setup_wifi();

  Serial.println("FIRE NODE 1 STARTED ");
}

// -------- LOOP --------
void loop() {

  // -------- READ SENSORS --------
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();
  int   gasValue    = analogRead(MQ2_PIN);

  // ── Flame Sensor (ACTIVE-LOW) ─────────────────────────────────────────────
  // LOW = flame detected, HIGH = no flame
  // INPUT_PULLUP holds pin HIGH → prevents floating pin false positives
  int  flameRaw      = digitalRead(FLAME_PIN);
  bool flameDetected = (flameRaw == LOW);   // LOW = fire ✅

  // -------- GPS READ --------
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  float lat = 0, lon = 0;
  if (gps.location.isValid()) {
    lat = gps.location.lat();
    lon = gps.location.lng();
  }

  // ── Fire Status (3-Case Logic) ────────────────────────────────────────────
  //  Case 3 → FIRE_DETECTED : flame = 1
  //  Case 2 → HIGH_RISK     : params above threshold, flame = 0  (prediction)
  //  Case 1 → SAFE          : all params below threshold, flame = 0
  String fireStatus = "SAFE";

  if (flameDetected) {
    fireStatus = "FIRE_DETECTED";
  } else if (
    temperature > TEMP_HIGH_RISK ||
    humidity    < HUM_HIGH_RISK  ||
    gasValue    > GAS_HIGH_RISK
  ) {
    fireStatus = "HIGH_RISK";
  } else if (
    temperature > TEMP_MODERATE ||
    (humidity >= HUM_HIGH_RISK && humidity <= HUM_MODERATE) ||
    gasValue   >= GAS_MODERATE
  ) {
    fireStatus = "MODERATE";
  }

  // -------- SERIAL OUTPUT (every 15 sec) --------
  if (millis() - lastSerial > 15000) {
    lastSerial = millis();

    Serial.println("\n------ SENSOR DATA (NODE 1) ------");
    Serial.print("Temperature  : "); Serial.print(temperature); Serial.println(" °C");
    Serial.print("Humidity     : "); Serial.print(humidity);    Serial.println(" %");
    Serial.print("Gas Value    : "); Serial.println(gasValue);
    Serial.print("Flame Raw Pin: "); Serial.println(flameRaw);  // 0 = fire, 1 = no fire
    Serial.print("Flame Status : "); Serial.println(flameDetected ? "DETECTED 🔥" : "NOT DETECTED ✅");
    Serial.print("Lat          : "); Serial.println(lat, 6);
    Serial.print("Lon          : "); Serial.println(lon, 6);
    Serial.print("Fire Status  : "); Serial.println(fireStatus);
    Serial.println("----------------------------------");
  }

  // -------- THINGSPEAK (every 15 sec) --------
  if (millis() - lastThingSpeak > 15000) {
    lastThingSpeak = millis();

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("⚠️ WiFi disconnected, reconnecting...");
      WiFi.begin(ssid, password);
      return;
    }

    if (tsClient.connect(server, 80)) {

      // field4: send 1 = fire detected, 0 = no fire (logical, not raw pin)
      String url = "/update?api_key=" + apiKey;
      url += "&field1=" + String(temperature);
      url += "&field2=" + String(humidity);
      url += "&field3=" + String(gasValue);
      url += "&field4=" + String(flameDetected ? 1 : 0);  // 1 = fire, 0 = safe
      url += "&field5=" + String(lat, 6);
      url += "&field6=" + String(lon, 6);

      tsClient.print(
        String("GET ") + url + " HTTP/1.1\r\n" +
        "Host: " + server + "\r\n" +
        "Connection: close\r\n\r\n"
      );


      while (tsClient.available()) {
        String line = tsClient.readStringUntil('\r');
        Serial.print(line);
      }

    } else {
      Serial.println("❌ ThingSpeak connection failed");
    }

    tsClient.stop();
  }
}
