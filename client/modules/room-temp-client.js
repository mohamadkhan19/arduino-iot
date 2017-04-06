/* ------------------------------------------------------
 * 
 *  IoT Dashboard - Room Temperature client
 *
 * ------------------------------------------------------ */

var io = require('socket.io-client'),
	sockets = io.connect('http://localhost:5000');

sockets.on('roomTempReturned', function(temp) {
	console.log('Temperature returned: ' + temp);

});