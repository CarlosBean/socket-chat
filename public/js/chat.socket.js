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
        console.log('connected users', res);
    });
});

socket.on('disconnect', function () {
    console.log('Lost connection with server');
});


// Enviar información
/* socket.emit('createMessage', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function (resp) {
    console.log('respuesta server: ', resp);
}); */

// listen information
socket.on('createMessage', function (message) {
    console.log('Server:', message);
});

// listen users changes, when an user enter or leave of chat
socket.on('listUsers', function (usuarios) {
    console.log(usuarios);
});

// private messages
socket.on('privateMessage', function (message) {
    console.log('private message: ', message);
});