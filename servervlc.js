var http = require('http'),
    url = require('url'),
    fs = require('fs');
var  sio = require('socket.io');
var exec = require('child_process').exec;
var util = require('util');
var sys = require('sys')

var messages = ["testing"];
var clients = [];
var child;

var app =  http.createServer(function (req, res) {
   // parse URL
   var url_parts = url.parse(req.url);
   console.log(url_parts);
   if(url_parts.pathname == '/') {
      // file serving
      fs.readFile('./index.html', function(err, data) {
					res.writeHead(200, {"Content-Type": "text/html"});
         res.end(data);
      });

   }

   if(url_parts.pathname == '/js/menucontrol.js') {
      // file serving
      fs.readFile('./js/menucontrol.js', function(err, data) {
					res.writeHead(200, {"Content-Type": "text/javascript"});
         res.end(data);
      });

						
   }
	 

	   
}).listen(8850);


var io = sio.listen(app);

		io.sockets.on('connection', function (socket, server) {
        socket.emit('news', {hello: 'worldpi'});
				
			socket.on('vlcvideostart', function(data){
console.log(util.inspect(data));
			if(data.start == 'live')
				{
					
//					child = exec("pwd", function (error, stdout, stderr) {
					child = exec("raspivid -o - -t 30000 -hf -w 640 -h 360 -fps 25|cvlc -vvv stream:///dev/stdin --sout '#standard{access=http,mux=ts,dst=:8090}' :demux=h264", function (error, stdout, stderr) {
					
sys.print('stdout: ' + stdout);
sys.print('stderr: ' + stderr);
						if (error !== null) {
console.log('exec error: ' + error);
						}
					});
				}
				else if(data.start == 'record')
				{	
					child = exec("raspivid -o swimview.h264 -t 20000", function (error, stdout, stderr) {
					
sys.print('stdout: ' + stdout);
sys.print('stderr: ' + stderr);
						if (error !== null) {
console.log('exec error: ' + error);
						}
					});					
					
					
				}
				
			 else if(data.start == 'convert')
				{					
//					child = exec("pwd", function (error, stdout, stderr) {
					child = exec("MP4Box -add swimview.h264 swimview.mp4", function (error, stdout, stderr) {
					
sys.print('stdout: ' + stdout);
sys.print('stderr: ' + stderr);
						if (error !== null) {
console.log('exec error: ' + error);
						}
					});					
					
					
				}

			});

			
    });

console.log('Server running.');