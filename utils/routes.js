'use strict';

class Routes{

	constructor(app, socket){
		this.app = app;
		this.io = socket;

		/*
			Array to store the list of users along with there respective socket id.
		*/
		this.users = [];
	}


	appRoutes(){

		this.app.get('/', (request,response) => {
			response.redirect('index.html');
		});

	}

	socketEvents(){

		this.io.on('connection', (socket) => {

      socket.join('private room');

  			socket.on('username', (userName) => {

	      	this.users.push({
	      		id : socket.id,
	      		userName : userName
	      	});

          const length = this.users.length;

	      	this.io.emit('userList', this.users, this.users[length - 1].id);
		    });

		    socket.on('getMsg', (data) => {
          console.log(data, 'getting data')
		    	this.io.in('private room').emit('sendMsg', {
		    		msg: data.msg,
		    		username: data.username
		    	});
		    });

		    socket.on('disconnect', (socket) => {

		      	for(let i=0, length=this.users.length; i < length; i++){
		        	if(this.users[i].id === socket.id){
		          		this.users.splice(i,1);
		        	}
		      	}

		      	this.io.emit('exit', this.users);
		    });

		});

	}

	routesConfig(){
		this.appRoutes();
		this.socketEvents();
	}
}
module.exports = Routes;
