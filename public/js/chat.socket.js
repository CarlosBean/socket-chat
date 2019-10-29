var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('name and room are required');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function () {
    console.log('connected to server');
    socket.emit('enterChat', user, function (res) {
        renderUsers(res);
    });
});

socket.on('disconnect', function () {
    console.log('Lost connection with server');
});

// listen information
socket.on('createMessage', function (message) {
    renderMessages(message, false);
    scrollBottom();
});

// listen users changes, when an user enter or leave of chat
socket.on('listUsers', function (usuarios) {
    renderUsers(usuarios);
});

// private messages
socket.on('privateMessage', function (message) {
    console.log('private message: ', message);
});