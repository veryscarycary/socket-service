const socket = io();

class ChatUser {

  constructor() {
    this.socketId = null;
    this.selectedUser = null;
    this.messages = [];
    this.msgData = null;
    this.userList = [];
    this.username = window.prompt('Enter Your Name');

    if (this.username === '') {
      window.location.reload();
    }

    socket.emit('username', this.username);

    socket.on('userList', (userList, socketId) => {
      if (this.socketId === null) {
        // set own id
        this.socketId = socketId;
      } else {
        // other person joined, set their id
        this.selectedUser = socketId;
      }
      this.userList = userList;
    });

    socket.on('exit', (userList) => {
      this.userList = userList;
    });

    socket.on('sendMsg', (data) => {
      this.messages.push(data);
      console.log('user List =>', this.userList);

      var messageFeed = document.getElementById('messages');
      var li = document.createElement('li');
      li.innerHTML = `${data.username}: ${data.msg}`;
      messageFeed.appendChild(li);
    });
  }

  // selectedUser(selectedUser) {
  //   selectedUser === this.socketId ? alert("Can't message to yourself.") : this.selectedUser = selectedUser;
  // };


  sendMsg(event) {
    event.preventDefault();
    console.log(event, '<=event');

    var inputField = document.getElementById('m');

    if (inputField.value) {
      socket.emit('getMsg', {
        toid: this.selectedUser,
        fromid: this.socketId,
        username: this.username,
        msg: inputField.value
      });
    }

    inputField.value = '';
  };
}

var user = new ChatUser();
