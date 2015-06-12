var Hapi   = require('hapi');
var Path   = require('path');
var Bell   = require('bell');
var Cookie = require('hapi-auth-cookie');
var Routes = require('./routes');
var controllers = require('./controllers');
var server  = new Hapi.Server();
//view engine
server.views({
			engines:{jade : require('jade')},
			path : Path.join(__dirname,'views'),
			compileOptions:{
				pretty:true
			}
		}
);
//config
server.connection({
	host:'localhost',
	port:process.env.PORT || 8000,
	labels:['app']
});
server.connection({
	host:'localhost',
	port:process.env.PORTCHAT || 8001,
	labels:['chat']
});
//register plugins
server.register([Bell,Cookie],function(err){
	if(err) console.log(err);
	server.auth.strategy('facebook','bell',{
		provider:'facebook',
		password:'cookiesecret',
		clientId:'401181136740783', //facebookAppId
		clientSecret:'18950f9d83fef20531986e14eb0db700', //facebookAppSecret
		isSecure:false // true for https
	});
	server.auth.strategy('session','cookie',{
		password:'password',
		cookie:'sid',
		redirectTo:'/login',
		redirectOnTry:false,
		isSecure:false
	});
});

//socket io routes
var io = require('socket.io')(server.select('chat').listener);
Routes.io(io);

//css files
server.route(
				{
				    method: 'GET',
				    path: '/css/{param*}',
				    handler: {
				        directory: {
				            path: Path.join(__dirname + '/public/css')
				        }
				    }
				});
//js files
server.route(
				{
				    method: 'GET',
				    path: '/js/{param*}',
				    handler: {
				        directory: {
				            path: Path.join(__dirname + '/public/js')
				        }
				    }
				});
//img files
server.route(
				{
				    method: 'GET',
				    path: '/images/{param*}',
				    handler: {
				        directory: {
				            path: Path.join(__dirname + '/public/images')
				        }
				    }
				});
//error 404
server.route(
				{
					method:'GET',
					path:'/{p*}',
					handler:function(req,res){
						res('404').code(404);
					}
				});
server.route(
	[	{
			method:['GET','POST'],
			path:'/login',
			config:{
				auth:'facebook',
				handler: controllers.login
			}
		},
		{
			method:'GET',
			path:'/',
			config:{
				auth:{
					strategy:'session',
					mode:'try'
				},
				handler: controllers.home
			}
		},
		{
			method:'GET',
			path:'/logout',
			config:{
				auth:{
					strategy:'session'
				},
				handler: controllers.logout
			}
		}		

	]
);
server.start();