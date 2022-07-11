const config = require("config");

import axios from "axios";
import { writeFileSync } from "fs";
import moment from "moment";
import { Client } from "./client/Client";
import { Contact } from "./client/Contact";
import { YealinkPhoneBook } from "./phonebook/yealink/YealinkPhoneBook";

export class Main {
    constructor() {
        const microsoft365 = config.get("microsoft365");
        const client = new Client(
            microsoft365.TENANT_ID,
            microsoft365.CLIENT_ID,
            microsoft365.CLIENT_SECRET,
            microsoft365.AAD_ENDPOINT,
            microsoft365.GRAPH_ENDPOINT,
        );

        this.start(client);
    }

    private async start(client: Client) {
        const refresh = 1000 * 60 * config.get("service.refresh");

        const phonebooksConfig = config.get("phonebooks");

        for (let i in phonebooksConfig) {
            try {
                const result = await client.getAllContacts(phonebooksConfig[i].user);
                if (result.status == 200) {
                    const book = new YealinkPhoneBook(phonebooksConfig[i].phonebookName);
                    book.addContacts(this.filterInvalidContacts(result.data.value));
                    const bookStr = book.generate();
                    writeFileSync(`./remote_phone_books/${phonebooksConfig[i].phonebookFile}`, bookStr);
                    console.info(`phone book updated for ${phonebooksConfig[i].user}`);
                } else {
                    console.log("damm");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(`${error.message} - ${phonebooksConfig[i].user}`);
                } else {
                    console.error(`unexpected error: ${error}`);
                }
            }
        }

        const next = moment().add(refresh, "ms");
        console.log(`next refresh ${next.format()}`);
        setTimeout(() => {
            this.start(client);
        }, refresh);
    }

    private filterInvalidContacts(contacts: Contact[]): Contact[] {
        return contacts.filter((contact) => {
            // should have phone number
            let mobileCheck = contact.mobilePhone != null;
            let homeCheck = contact.homePhones != null && contact.homePhones.length > 0;
            let businessCheck = contact.businessPhones != null && contact.businessPhones.length > 0;

            return mobileCheck || homeCheck || businessCheck;
        });
    }
}

const consoleLog = console.log;
const consoleError = console.error;
const consoleInfo = console.info;
const consoleDebug = console.debug;
const consoleWarn = console.warn;

console.log = (...args) => {
    consoleLog(moment().format(), ...args);
};

console.error = (...args) => {
    consoleError(moment().format(), ...args);
};

console.info = (...args) => {
    consoleInfo(moment().format(), ...args);
};

console.debug = (...args) => {
    consoleDebug(moment().format(), ...args);
};

console.warn = (...args) => {
    consoleWarn(moment().format(), ...args);
};

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = new Main();
} else {
    // otherwise start the instance directly
    (() => new Main())();
}
