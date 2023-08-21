import { Contact } from "./Contact";

export interface ContactsResult {
    "@odata.context": string | null;
    "@odata.nextLink": string | null;
    value: Contact[];
}
