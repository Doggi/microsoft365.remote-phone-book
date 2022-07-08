# microsoft365.remote-phone-book

This application creates remote phone books from Microsoft 365 contacts for use for IP phones

## Setup

### Install curl and git

1. To update the contents database of your Debian Linux package repository, use the apt update command:

    ```bash
    sudo apt update
    sudo apt install -y curl git
    ```

### Install Node 16.x (example for debian 11)

1. Install Node.js 16 on Debian 11 once the system has been updated by first installing the necessary repository:

    ```bash
    curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
    ```

2. After you’ve added the repository, you may start installing Node.js 16 on Debian 11:

    ```bash
    sudo apt -y install nodejs
    ```

3. Check the Node.js version installed:

    ```bash
    node -v
    ```

### Install the microsoft365.remote-phone-book repository

1. Clone the microsoft365.remote-phone-book repository

```bash
git clone https://github.com/Doggi/microsoft365.remote-phone-book.git
```

2. Change the dir

```bash
cd microsoft365.remote-phone-book
```

### Register the application by Microsoft 365

first you need to register an application by Microsoft 365 to get the following authentication informations

-   TENANT_ID
-   CLIENT_ID
-   CLIENT_SECRET
-   AAD_ENDPOINT
-   GRAPH_ENDPOINT

1. follow the instruction https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

2. follow the instruction https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-nodejs-console#register-the-application

3. Create a configuration file

```bash
cp config/default.json.example config/default.json
```

4. Enter the microsoft365 credentials

```bash
nano config/default.json
```

5. add phone book(s)

```bash
nano config/default.json
```

A phonebook entry as three attributes.

**user:** is the userPrincipalName in the most cases its the email address  
**phonebookName:** is the name of the phone book you can type what you want. In Yealink phone book will this used as the display phone book name.  
**phonebookFile:** is the filename of the phonebook how the app will save it in the folder _remote_phone_books_ and how you can access it over http

```javascript
...
"phonebooks": [
    {
        "user": "example@mail.com",
        "phonebookName": "Example Phone book",
        "phonebookFile": "example_book.xml"
    },
    {
        "user": "example2@mail.com",
        "phonebookName": "Example Phone book 2",
        "phonebookFile": "example_book_2.xml"
    }
]
...
```

If you want you can also increase or decrease the refresh timer. You have to change the minute number in _service.refresh_.

```javascript
...
"service": {
    "refresh": 60 // in minutes
},
...
```

### Start app and file server

You can start the app for the phone book creation with

```bash
npm run start:prod
```

and the file server with

```bash
npm run server:file
```

**Best way to run**
The best way to start both, app and file server, is to use pm2. In this repository is a predefined configuraion file.

1. install pm2 global

```bash
sudo npm install -g pm2
```

2. start the app and file server

```bash
pm2 start pm2.config.js
```

3. Starting PM2 on Boot

```bash
pm2 startup
pm2 start pm2.config.js
pm2 save
```

With the following command you can see the status of the apps

```bash
pm2 status pm2.config.js
```

and if you are a _nerd_ use this command ;)

```bash
pm2 monit
```

Enjoy
