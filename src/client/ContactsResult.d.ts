import { Contact } from "./Contact";

export interface ContactsResult {
    "@odata.context": string;
    value: Contact[];
}
