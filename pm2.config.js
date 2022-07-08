module.exports = {
    apps: [
        {
            name: "microsoft365RemotePhoneBookSync",
            script: "npm run start:prod",
            watch: ["config"],
        },
        {
            name: "microsoft365RemotePhoneBookServer",
            script: "npm run server:file",
        },
    ],
};
