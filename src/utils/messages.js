module.exports = {
    generateMessage(username, text) {
        return {
            text,
            username,
            createdAt: new Date().getTime(),
        };
    },

    generateLocationMessage(username, url) {
        return {
            url,
            username,
            createdAt: new Date().getTime(),
        };
    },
};
