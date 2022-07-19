import * as xmlBuilder from "xmlbuilder";
import { Contact } from "../../../client/Contact";
import { PhoneBook } from "../../PhoneBook";
import { DirectoryEntry } from "./DirectoryEntry";

export class YealinkPhoneBook implements PhoneBook {
    private name: string;
    private entries: DirectoryEntry[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addContact(contact: Contact) {
        let telephones: string[] = [];

        telephones = telephones.concat(contact.businessPhones);
        telephones = telephones.concat(contact.homePhones);

        if (contact.mobilePhone != null) {
            telephones.push(contact.mobilePhone);
        }

        const entry = {
            name: contact.displayName,
            telephone: telephones,
        };

        this.entries.push(entry);
    }

    addContacts(contacts: Contact[]) {
        for (const contact of contacts) {
            this.addContact(contact);
        }
    }

    generate(): string {
        const xmlRoot = xmlBuilder.create("M365IPPhoneDirectory");
        xmlRoot.dec("1.0", "UTF-8");

        xmlRoot.ele("Title", this.name);
        xmlRoot.ele("Prompt", `Prompt from ${this.name}`);

        for (const entry of this.entries) {
            const e = xmlRoot.ele("DirectoryEntry");
            e.ele("Name", entry.name);

            for (const telephone of entry.telephone) {
                e.ele("Telephone", telephone);
            }
        }

        return xmlRoot.end({ pretty: true });
    }
}
