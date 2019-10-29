class User {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return this.users;
    }

    getUser(id) {
        const user = this.users.find(user => user.id === id);
        return user;
    }

    getUsers() {
        return this.users;
    }

    getUsersByRoom(room) {
        const usersInRoom = this.users.filter(user => user.room === room);
        return usersInRoom;
    }

    deleteUser(id) {
        const deletedUser = this.getUser(id);
        this.users = this.users.filter(user => user.id !== id);
        return deletedUser;
    }
}

module.exports = {
    User
}