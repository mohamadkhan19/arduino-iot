var SerialPort = require("node-serialport").SerialPort,
	srlprt = new SerialPort("/dev/ttyATH0", {
	    baudrate: 9600
	}, false),
	server = require('http').Server(),
	io = require('socket.io-client'),
	socket = io('http://localhost', {reconnect: true}),
	port = 8080,
	consolePrefix = 'Yun Server: ';

/* ---------------------------------------------------
 *  Serial port
 * --------------------------------------------------- */
srlprt.on('open', function () {
    console.log(consolePrefix + 'Serial port open');
});

srlprt.on('error', function(err) {
    console.log(consolePrefix + 'Serial port error: '+err);
});

srlprt.open();

/* ---------------------------------------------------
 *  Socket.io
 * --------------------------------------------------- */
socket.on('connect', function() {
	console.log(consolePrefix + 'Socket io is connected.');
});

/*socket.on('playSong', function(songNumber) {
	if (songNumber != null) {
		console.log(consolePrefix + 'Song request heard of ' + songNumber);
		srlprt.write(songNumber, function(err, results) {
			if (err) {
				console.log(consolePrefix + 'Writing to serial port error: ' + err);
			}
		});
	}
});*/

/* ---------------------------------------------------
 *  Start our server
 * --------------------------------------------------- */
server.listen(port, function() {
  console.log(consolePrefix + 'Listening on ' + port);
});