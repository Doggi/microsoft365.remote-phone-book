import { Contact } from "../client/Contact";

export interface PhoneBook {
    addContact(contact: Contact): void;
    addContacts(contacts: Contact[]): void;
    generate(): string;
    size(): number;
}
