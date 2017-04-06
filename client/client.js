/* ------------------------------------------------------
 * 
 *  IoT Dashboard - Client side
 *
 * ------------------------------------------------------ */

var _ = require('underscore'),
	io = require('socket.io-client'),
	socket = io.connect('http://localhost:5000'),
	request = require('request'),
	temperature,
	brightness,
	timestamp;
/*	roomTempClient = require('./modules/room-temp-client.js'),
	roomLightClient = require('./modules/room-light-client.js');*/

//temperature
var io = require('socket.io-client'),
	sockets = io.connect('http://localhost:5000');

sockets.on('roomTempReturned', function(temp) {
	console.log('Temperature returned: ' + temp);
	temperature=temp;
});

//Light
var io = require('socket.io-client'),
	sockets = io.connect('http://localhost:5000');

sockets.on('roomLightLevelReturned', function(data) {
	console.log('Brightness returned: ' + data);
	brightness=data;
	timestamp= Date();
	sensor_data();

	console.log('timestamp ' + timestamp);
});

//post function
/*var data = {
	temperature,
	brightness
}*/

/*var sensor_data = function($http) {
     $http({
      method  : 'POST',
      url     : '54.183.110.184/sensor_data',
      data    : data,
    }).then(function(data) {
      console.log('post succesful ' + data);
    }, function(err) {
    	console.log('error ' + err);
    });
  };

  sensor_data();*/

/* var request = require('request');*/

var sensor_data = function() {
request.post(
    'http://54.183.110.184/sensor_data',
    {json: {timestamp,temperature,brightness}},
    function (error, response, body) {
    	if (error){
    		console.log('error ' + error);
    	}
        if (!error) {
            console.log("succesfully inserted, temperature: " +response.temperature+ " brightness: "+response.brightness);
        }
    }
);
};

