module.exports = function(app, io) {
	var bodyParser = require('body-parser'),
		consolePrefix = 'Arduino Control: ',
		requestPrefix = '/arduino',
		five = require('johnny-five'),
		board = new five.Board(),
		tempSensor,
		photocell,
		latestTempLevel = null,
		latestLightLevel = null;

	app.use(bodyParser.json());

	board.on('ready', function() {
		console.log(consolePrefix + 'Board ready');
		tempSensor = new five.Sensor({
			pin: 'A4',
			freq: 1000
		});
		photocell = new five.Sensor({
			pin: 'A0',
			freq: 1000
		});

		tempSensor.on('read', function(err, value){
			var temp = (((value * 0.004882814) - 0.5) * 100).toFixed(1);
			console.log(consolePrefix + 'Temp is ' + temp);
			latestTempLevel = temp;

			io.sockets.emit('roomTempReturned', temp);
		});

		photocell.on('read', function(err, value) {
			// Brightness will be from 0 - 255
			var brightnessValue = five.Fn.map(value, 0, 1023, 0, 255);
			console.log(consolePrefix + 'brightnessValue is ' + brightnessValue);
			latestLightLevel = brightnessValue;
			io.sockets.emit('roomLightLevelReturned', brightnessValue);
		});
	});
	console.log('\n' + consolePrefix + 'Waiting for device to connect...');

	app.get(requestPrefix + '/tempLevel', function(request, response) {
		if (latestTempLevel != null) {
			response.json({roomTempLevel: latestTempLevel});
		} else {
			response.json({error: 'Device not connected'});
		}

		console.log(consolePrefix + 'Giving temp level of ' + latestTempLevel);
	});

	app.get(requestPrefix + '/lightLevel', function(request, response) {
		if (latestLightLevel != null) {
			response.json({roomLightLevel: latestLightLevel});
		} else {
			response.json({error: 'Device not connected'});
		}

		console.log(consolePrefix + 'Giving light level of ' + latestLightLevel);
	});

	io.sockets.on('connection', function(socket) {
		console.log(consolePrefix + 'Socket io is ready.');
	});
};