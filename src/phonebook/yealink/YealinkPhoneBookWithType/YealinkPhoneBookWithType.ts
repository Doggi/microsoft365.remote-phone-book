import * as xmlBuilder from "xmlbuilder";
import { Contact } from "../../../client/Contact";
import { PhoneBook } from "../../PhoneBook";
import { DirectoryEntry } from "./DirectoryEntry";
import { Telephone } from "./Telephone";
import { TelephoneTypes } from "./TelephoneTypes";

export class YealinkPhoneBookWithType implements PhoneBook {
    private name: string;
    private entries: DirectoryEntry[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addContact(contact: Contact) {
        let telephones: Telephone[] = [];

        const bPhones = this.convertPhoneArray2Telephone(contact.businessPhones, TelephoneTypes.Work);
        const hPhones = this.convertPhoneArray2Telephone(contact.homePhones, TelephoneTypes.Home);

        telephones = telephones.concat(bPhones, hPhones);

        if (contact.mobilePhone != null) {
            telephones.push({
                type: TelephoneTypes.Mobile,
                phone: contact.mobilePhone,
            });
        }

        this.entries.push({
            name: contact.displayName,
            telephones: telephones,
        });
    }

    private convertPhoneArray2Telephone(phones: string[], type: TelephoneTypes) {
        let telephones: Telephone[] = [];
        for (const phone of phones) {
            telephones.push({
                type: type,
                phone: phone,
            });
        }
        return telephones;
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

            for (const telephone of entry.telephones) {
                e.ele("Telephone", telephone.phone).att("type", telephone.type);
            }
        }

        return xmlRoot.end({ pretty: true });
    }
}
