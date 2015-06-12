angular.module('ChatApp',[])
		.factory('socket',function(){
			var socket = io('http://localhost:8001');
				socket.on('join',function(data){
					console.log(data);
				});
			return socket;
		})
		.controller('CtrlChatList',function($scope,socket){
			$scope.comments = [];
			$scope.comment={};
			$scope.SendMessage=function(){
				$scope.comment.userInfo={
					photo : (document.getElementById('userImg') ).getAttribute('src'),
					displayName : (document.getElementById('userDisplayName') ).text,
					url : (document.getElementById('userDisplayName') ).getAttribute('href')
				};
				//console.log($scope.comment);
				socket.emit('SendMessage',$scope.comment);
				$scope.comment={};
				scroll();
			};
			$scope.getOldMessages=(function(){
				socket.emit('getOldMessages',function(data){
					console.log(data);
				})
			})();
			socket.on('newMessage',function(data){

				$scope.comments.push(data)

			});
		});

$('.ui.video').video();
function scroll(){
	$('.comments-list').scrollTop($(".comments-list").height());
}