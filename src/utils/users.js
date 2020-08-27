const users = [];

module.exports = {
    addUser({ id, username, room }) {
        username = username.trim().toLowerCase();
        room = room.trim().toLowerCase();

        if (!username || !room) {
            return {
                error: "Nome de usuário e sala snão podem ser vazios",
            };
        }

        const existingUser = users.find((user) => {
            return user.room === room && user.username === username;
        });

        if (existingUser) {
            return {
                error: "Esse nome já está sendo usado",
            };
        }

        const returnUser = { id, username, room };

        users.push(returnUser);

        return { returnUser };
    },

    removeUser(id) {
        const idx = users.findIndex((user) => {
            return user.id === id;
        });

        if (idx !== -1) {
            return users.splice(idx, 1)[0];
        }
    },

    getUser(id) {
        const foundUser = users.find((user) => {
            return user.id === id;
        });

        return foundUser;
    },

    getUsersInRoom(room) {
        room = room.trim().toLowerCase();
        const usersInRoom = users.filter((user) => {
            return user.room === room;
        });

        return usersInRoom;
    },
};
