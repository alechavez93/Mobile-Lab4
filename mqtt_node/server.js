/*
 * Server.js
 * 
 * The main portion of this project. Contains all the defined routes for express,
 * rules for the websockets, and rules for the MQTT broker.
 * 
 * Refer to the portions surrounded by --- for points of interest
 */
var express   = require('express'),
	app       = express();
var pug       = require('pug');
var sockets   = require('socket.io');
var path      = require('path');

var conf      = require(path.join(__dirname, 'config'));
var internals = require(path.join(__dirname, 'internals'));

var api = require("./appAPI");
var Beacon = require("./Beacon");
var mqttManager = require("./mqtt");

var socketList = [];

// Middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -- Setup the application
setupBeacons();
api.run(app);
setupExpress();
setupSocket();




//NOTE: to use mqttManage just call mqttManage.publishMaxCapacity(topic, mqtt) wherever you need it =)


// -- Socket Handler
// Here is where you should handle socket/mqtt events
// The mqtt object should allow you to interface with the MQTT broker through 
// events. Refer to the documentation for more info 
// -> https://github.com/mcollina/mosca/wiki/Mosca-basic-usage
// ----------------------------------------------------------------------------
function socket_handler(socket, mqtt) {
	// Called when a client connects
	mqtt.on('clientConnected', client => {
		socket.emit('debug', {
			type: 'CLIENT', msg: 'New client connected: ' + client.id
		});
	});

	// Called when a client disconnects
	mqtt.on('clientDisconnected', client => {
		socket.emit('debug', {
			type: 'CLIENT', msg: 'Client "' + client.id + '" has disconnected'
		});
	});

	// Called when a client publishes data
	mqtt.on('published', (data, client) => {
		if (!client) return;

		socket.emit('debug', {
			type: 'PUBLISH', 
			msg: 'Client "' + client.id + '" published "' + JSON.stringify(data) + '"'
		});
	});

	// Called when a client subscribes
	mqtt.on('subscribed', (topic, client) => {
		if (!client) return;

		socket.emit('debug', {
			type: 'SUBSCRIBE',
			msg: 'Client "' + client.id + '" subscribed to "' + topic + '"'
		});
	});

	// Called when a client unsubscribes
	mqtt.on('unsubscribed', (topic, client) => {
		if (!client) return;

		socket.emit('debug', {
			type: 'SUBSCRIBE',
			msg: 'Client "' + client.id + '" unsubscribed from "' + topic + '"'
		});
	});
}
// ----------------------------------------------------------------------------


// Helper functions
function setupExpress() {
	app.set('view engine', 'pug'); // Set express to use pug for rendering HTML

	// Setup the 'public' folder to be statically accessable
	var publicDir = path.join(__dirname, 'public');
	app.use(express.static(publicDir));

	// Setup the paths (Insert any other needed paths here)
	// ------------------------------------------------------------------------
	// Home page
	app.get('/', (req, res) => {
		res.render('index', {title: 'MQTT Tracker'});
	});

	// Basic 404 Page
	app.use((req, res, next) => {
		var err = {
			stack: {},
			status: 404,
			message: "Error 404: Page Not Found '" + req.path + "'"
		};

		// Pass the error to the error handler below
		next(err);
	});

	// Error handler
	app.use((err, req, res, next) => {
		console.log("Error found: ", err);
		res.status(err.status || 500);

		res.render('error', {title: 'Error', error: err.message});
	});
	// ------------------------------------------------------------------------

	// Handle killing the server
	process.on('SIGINT', () => {
		internals.stop();
		process.kill(process.pid);
	});
}

function setupSocket() {
	var server = require('http').createServer(app);
	var io = sockets(server);

	// Setup the internals
	internals.start(mqtt => {
		//Initialize API with mqtt object
		api.init(mqtt);
		
		io.on('connection', socket => {
			//Save socket
			socketList.push(socket);
			socket_handler(socket, mqtt);
			socket.on("request-beacons", function(data){
				var beacons = api.getBeacons();
				socket.emit("send-beacons", beacons);
			});
		});

        mqtt.on('subscribed', (topic, client)=>{
            if (!client) return;

            var beacon = api.getBeaconByTopic(topic);

            if(!beacon)return;

			if(beacon.isFull()){
				mqttManager.publishMaxCapacity(topic,mqtt);
			}
		});

		mqtt.on('published', (data, client) => {
			if (!client) return;

			 var beacon = api.getBeaconByTopic(data.topic);

			 if(!beacon) return;
			 
			 var mes = data.payload.toString();

			 if(mes.includes("Up")) {
                 var check = beacon.isFull();

                 beacon.addCapacity();

                 if (!beacon.isFull() && check != beacon.isFull()) {

                     mqttManager.publishOffMaxCapacity(data.topic, mqtt);
                 }
             }
		});
	});

	server.listen(conf.PORT, conf.HOST, () => { 
		console.log("Listening on: " + conf.HOST + ":" + conf.PORT);
	});
}

//Sets up the Beacons for our Project
//Their Locations, Topics, and UUID's
function setupBeacons(){
	//First Beacon is located in Marston Science Library
	var MarstonLocation = {lat: 29.647984, lng: -82.344002};
	var beacon1UUID = "abcdef01234567890123456789012345";
	var beacon1 = new Beacon(beacon1UUID, MarstonLocation);
	beacon1.topic = mqttManager.topics[0];
	api.addBeacon(beacon1);

	//Second Beacon is located in Turlington
	var TurlingtonLocation = {lat: 29.649277, lng: -82.343901};
    var beacon2UUID = "1111222233334444555566667777888a";
	var beacon2 = new Beacon(beacon2UUID, TurlingtonLocation);
    beacon2.topic = mqttManager.topics[1];
    api.addBeacon(beacon2);

	//Third Beacon is located at Satadium
    var StadiumLocation = {lat: 29.649939, lng: -82.348577};
    var beacon3UUID = "8b0ca750e7a74e14bd99095477cb3e77";
    var beacon3 = new Beacon(beacon3UUID, StadiumLocation);
    beacon3.topic = mqttManager.topics[2];
    api.addBeacon(beacon3);

    //Fourth Beacon is located at Library West
    var LibraryWestLocation = {lat: 29.652017, lng: -82.342889};
    var beacon4UUID = "56789012345678901234567890123456";
    var beacon4 = new Beacon(beacon4UUID, LibraryWestLocation);
    beacon4.topic = mqttManager.topics[3];
    api.addBeacon(beacon4);
}

exports.sendBeaconUpdate = function(){
	for(var socket of socketList){
        var beacons = api.getBeacons();
        socket.emit("update-beacons", beacons);
	}
}