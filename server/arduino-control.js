module.exports = function(app, io) {
	var bodyParser = require('body-parser'),
		consolePrefix = 'Arduino Control: ',
		requestPrefix = '/arduino',
		five = require('johnny-five'),
		board = new five.Board(),
		request = require('request'),
		led,
		tempSensor,
		photocell,
		pir,
		motor,
		ledLight,
		led_input,
		temperature = null,
		brightness = null;

	app.use(bodyParser.json());

	board.on('ready', function() {
		console.log(consolePrefix + 'Board ready');

		led = new five.Led(13);
		motor = new five.Sensor({
			pin: '3'
		});
		motor.step(10);

		tempSensor = new five.Sensor({
			pin: 'A4',
			freq: 1000
		});
		photocell = new five.Sensor({
			pin: 'A0',
			freq: 1000
		});
		pir = new five.Sensor({
			pin: '2',
			freq: 1000
		});
		

		tempSensor.on('read', function(err, value){
			var temp = (((value * 0.004882814) - 0.5) * 100).toFixed(1);
			console.log(consolePrefix + 'Temp is ' + temp);
			temperature = temp;
			io.sockets.emit('roomTempReturned', temp);
		});

		photocell.on('read', function(err, value) {
			// Brightness will be from 0 - 255
			var brightnessValue = five.Fn.map(value, 0, 1023, 0, 100);
			console.log(consolePrefix + 'brightnessValue is ' + brightnessValue);
			brightness = brightnessValue;
			io.sockets.emit('roomLightLevelReturned', brightnessValue);
			sensor_data();
			led_function();

		});

		pir.on('read', function(err, value){
			//var pir = five.Fn.map(value, 0, 600, 0, 1);
			console.log(consolePrefix + 'PIR ' + value);
			//temperature = temp;
			//io.sockets.emit('roomTempReturned', temp);
		});

		/*/pir.watch(function(err, value) {
		  if (err) exit();
		  buzzer.writeSync(value);
		  console.log(consolePrefix + 'PIR ' + value);
		  //if(value == 1)  require('./mailer').sendEmail();
		});
	*/



	});


	console.log('\n' + consolePrefix + 'Waiting for device to connect...');

	app.get(requestPrefix + '/tempLevel', function(request, response) {
		if (temperature != null) {
			response.json({roomTempLevel: temperature});
		} else {
			response.json({error: 'Device not connected'});
		}

		console.log(consolePrefix + 'Giving temp level of ' + temperature);
	});

	app.get(requestPrefix + '/lightLevel', function(request, response) {
		if (brightness != null) {
			response.json({roomLightLevel: brightness});
		} else {
			response.json({error: 'Device not connected'});
		}

		console.log(consolePrefix + 'Giving light level of ' + brightness);
	});

	io.sockets.on('connection', function(socket) {
		console.log(consolePrefix + 'Socket io is ready.');
	});


var sensor_data = function() {
	var timestamp= Date();
request.post(
    'http://54.183.110.184/sensor_data',
    {json: {timestamp,temperature,brightness}},
    function (error, response, body) {
    	if (error){
    		console.log('error ' + error);
    	}
        if (!error) {
            console.log("succesfully inserted");
        }
    }
);
};

var led_response = function() {
	request.get(
	    'http://54.183.110.184/led_data',
	    function (error, response, result) {
	    	if (error){
	    		console.log('error ' + error);
	    	}
	        if (!error) {
	            console.log("get excuted succesfully");
	        }
	        var JSONObject = JSON.parse(result);
	        led_input = JSONObject.led;
	        console.log('LED: ' + led_input);
	    }
	);
};

// var led_function = function() {
// 	console.log("wating for led input");
	
/*	board.on('ready', function() {
			  var led = new five.Led(13); // pin 13
			  //led.on(); // 500ms interval
			  

			  
				console.log('LED: ' + led_input);
				if(led_input == true){
					led.on();
					console.log('LED:on ');
				}
				if(led_input == false){
					led.off();
					console.log('LED:off ');
				}
				
			});*/

	/*};*/
	var led_function = function() {
		led_response();
		console.log('LED: ' + led_input);
		if(led_input == true){
			led.on();
			console.log('LED:on ');
		}
		if(led_input == false){
			led.off();
			console.log('LED:off ');
		}
	};
};