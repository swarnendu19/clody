#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ✅ WiFi Credentials
const char *ssid = "WIFI NAME";    // Replace with your WiFi name
const char *password = "PASSWORD"; // Replace with your WiFi password

// ✅ MQTT Broker
const char *mqttServer = "broker.hivemq.com"; // Public MQTT Broker
const int mqttPort = 1883;
const char *mqttTopic = "swarnendu/data"; // MQTT Topic to publish sensor data

WiFiClient espClient;
PubSubClient client(espClient);

// ✅ DHT Sensor Configuration
#define DHTPIN D4 // GPIO2 (D4)
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(115200);
    delay(10);

    // ✅ Connect to WiFi
    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");

    // ✅ Connect to MQTT Broker
    client.setServer(mqttServer, mqttPort);
    while (!client.connected())
    {
        Serial.print("Connecting to MQTT...");
        if (client.connect("NodeMCU_Client"))
        {
            Serial.println("Connected");
        }
        else
        {
            Serial.print("Failed with state ");
            Serial.println(client.state());
            delay(2000);
        }
    }

    // ✅ Start DHT Sensor
    dht.begin();
}

void loop()
{
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity))
    {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    // ✅ Create JSON Payload
    String payload = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + "}";
    Serial.print("Publishing data: ");
    Serial.println(payload);

    // ✅ Publish Data to MQTT Broker
    client.publish(mqttTopic, payload.c_str());

    delay(5000); // Publish every 5 seconds
}
