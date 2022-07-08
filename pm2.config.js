module.exports = {
    apps: [
        {
            name: "remotePhoneBookSync",
            script: "npm run start:prod",
            watch: ["config"],
        },
        {
            name: "remotePhoneBookServer",
            script: "npm run server:file",
        },
    ],
};
