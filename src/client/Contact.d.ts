export interface Contact {
    "@odata.etag": string;
    id: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
    parentFolderId: string;
    fileAs: string;
    displayName: string;
    givenName: string;
    initials: string;
    middleName: string;
    nickName: string;
    surname: string;
    title: string;
    jobTitle: string;
    companyName: string;
    department: string;
    officeLocation: string;
    homePhones: string[];
    mobilePhone: string;
    businessPhones: string[];
}
