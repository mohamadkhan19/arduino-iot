/* ------------------------------------------------------
 * 
 *  IoT Dashboard - Room Light client
 *
 * ------------------------------------------------------ */

var io = require('socket.io-client'),
	sockets = io.connect('http://localhost:5000');

sockets.on('roomLightLevelReturned', function(data) {
	console.log('Brightness returned: ' + data);
});