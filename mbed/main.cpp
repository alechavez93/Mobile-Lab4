#include "mbed.h"
#include "MQTTClient.h"
#include "MQTTEthernet.h"
#include "rtos.h"
#include "k64f.h"

// connect options for MQTT broker
#define BROKER "192.168.1.149"              // MQTT broker URL
#define PORT 1883                           // MQTT broker port number
#define CLIENTID "jorge_mbed"               // use K64F MAC address without colons
#define USERNAME ""                         // not required for MQTT Dashboard public broker 
#define PASSWORD ""                         // not required for MQTT Dashboard public broker
#define TOPIC "position1"                   // MQTT topic

Queue<uint32_t, 6> messageQ;

// LED color control function
void controlLED(color_t led_color) {
    switch(led_color) {
        case red :
            greenLED = blueLED = 1;          
            redLED = 0.7;
            break;
        case green :
            redLED = blueLED = 1;
            greenLED = 0.7;
            break;
        case blue :
            redLED = greenLED = 1;
            blueLED = 0.7;
            break;
        case off :
            redLED = greenLED = blueLED = 1;
            break;
    }
}

 void lighChange(color_t color, int count){
    
    float time = 0.2f;
    
    for(int i = 0; i < count; i++){
        controlLED(color);
        wait(time);  
        controlLED(off);
        wait(time);  
    }
    
}
 
// MQTT message arrived callback function
void messageArrived(MQTT::MessageData& md) {
    MQTT::Message &message = md.message;
    
    if(message.payloadlen == 3){
        if(strncmp((char*)message.payload,"red",3) == 0){
            controlLED(red);
        }
        else if(strncmp((char*)message.payload,"off",3) == 0){
            controlLED(off);
        }
    }
}

int inc = 0;
int dec = 0;
void on_tapRight()
{   
    inc ++;
   lighChange(green,1); 
}
void on_tapLeft()
{   
    dec++;
    lighChange(red,1); 
}

InterruptIn g_button_tap(SW2); //down right button is press
InterruptIn g_button_mode(SW3); //down left button is press

int main() {
    // turn off LED  
    controlLED(off);
    
    //mbed buttons 
     g_button_tap.fall(&on_tapRight);
     g_button_mode.fall(&on_tapLeft);
 
    // initialize ethernet interface
    MQTTEthernet ipstack = MQTTEthernet();

    // construct the MQTT client
    MQTT::Client<MQTTEthernet, Countdown> client = MQTT::Client<MQTTEthernet, Countdown>(ipstack);
    
    char* hostname = BROKER;
    int port = PORT;
    int rc;
    
    // connect to TCP socket and check return code
    if ((rc = ipstack.connect(hostname, port)) != 0){
        //It couldn't get connected
        lighChange(red,1);
    }
    else{
        //It connected
        lighChange(green,1);
    }
    
    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;       
    data.MQTTVersion = 3;
    data.clientID.cstring = CLIENTID;
//    data.username.cstring = USERNAME;
//    data.password.cstring = PASSWORD;
    
    // send MQTT connect packet and check return code
    if ((rc = client.connect(data)) != 0){
        //It couldn't conncted
        lighChange(red,1);
    }
    else{
        //It connected
        lighChange(green,1);
    }
    
    char* topic = TOPIC;
    
    // subscribe to MQTT topic
    if ((rc = client.subscribe(topic, MQTT::QOS0, messageArrived)) != 0){
       //It couldn't subscribe
        lighChange(red,1);    
    }
    else{
        //It subscribe
        lighChange(green,1);
    }
    
        
    MQTT::Message message;
    char buf[100];
    message.qos = MQTT::QOS0;
    message.retained = false;
    message.dup = false;
    message.payload = (void*)buf;
    message.payloadlen = strlen(buf)+1;
    
    client.setDefaultMessageHandler(messageArrived);    
    while(true) {
        
        while(inc > 0){
            sprintf(buf, "Up");
            rc = client.publish(topic, message);
            inc--;
        }
        while(dec > 0){
            sprintf(buf, "Down");
            rc = client.publish(topic, message);
            dec--;
        }
        
        client.yield(100);
        
    }
}
