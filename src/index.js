const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
    generateMessage,
    generateLocationMessage,
} = require("./utils/messages");
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
    socket.on("join", ({ username, room }, callback) => {
        const { error, returnUser: user } = addUser({
            id: socket.id,
            username,
            room,
        });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit(
            "message",
            generateMessage(
                "Admin",
                `Bem vindo ao Super Chat, ${user.username} 😀`
            )
        );

        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                generateMessage("Admin", `${user.username} entrou no chat 🙂`)
            );

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        if (!user) {
            return;
        }

        io.to(user.room).emit(
            "message",
            generateMessage(user.username, message)
        );

        callback();
    });

    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id);

        if (!user) {
            return;
        }

        io.to(user.room).emit(
            "messageLocation",
            generateLocationMessage(
                user.username,
                `https://google.com.br/maps?q=${coords.latitude},${coords.longitude}`
            )
        );

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                generateMessage(`${user.username} saiu do chat 🙁`)
            );
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
