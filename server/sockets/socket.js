const { io } = require('../server');
const { createMessage } = require('../utils/utils')
const { User } = require('../classes/user');

const user = new User();

io.on('connection', (client) => {
    client.on('enterChat', (data, cb) => {
        if (!data.name || !data.room) {
            return cb({
                error: true,
                message: 'name and room are required'
            });
        }

        client.join(data.room);
        user.addUser(client.id, data.name, data.room);
        client.broadcast.to(data.room).emit('listUsers', user.getUsersByRoom(data.room));
        cb(user.getUsersByRoom(data.room));
    });

    client.on('createMessage', (data) => {
        const myUser = user.getUser(client.id);
        const message = createMessage(myUser.name, data.message);
        client.broadcast.to(myUser.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {
        const deleted = user.deleteUser(client.id);
        client.broadcast.to(deleted.room).emit('createMessage', createMessage('ADMIN', `${deleted.name} left the chat`));
        client.broadcast.to(deleted.room).emit('listUsers', user.getUsersByRoom(deleted.room));
    });

    // private messages
    client.on('privateMessage', data => {
        // add id, message exits validation when use DB
        const myUser = user.getUser(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(myUser.name, data.message));
    })
});