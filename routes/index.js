var Path = require('path');
//socket.io
var io = function(io){
	io.on('connection',function(socket){
		socket.join('jade-course');
		socket.emit('join','Welcome');
		socket.on('SendMessage',function(data){
			io.to('jade-course').emit('newMessage',data);
		})
	});
}
module.exports.io = io;
