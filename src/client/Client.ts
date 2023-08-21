import { AuthenticationResult, ClientCredentialRequest, ConfidentialClientApplication } from "@azure/msal-node";
import axios, { AxiosInstance } from "axios";
import moment from "moment";
import { Contact } from "./Contact";
import { ContactsResult } from "./ContactsResult";

export class Client {
    private tokenRequest: ClientCredentialRequest;
    private cca: ConfidentialClientApplication;
    private client: AxiosInstance;
    private authenticationResult: AuthenticationResult | null = null;

    constructor(tenantId: string, clientId: string, clientSecret: string, aadEndpoint: string, graphEndpoint: string) {
        this.tokenRequest = {
            scopes: [graphEndpoint + "/.default"],
        };

        this.cca = new ConfidentialClientApplication({
            auth: {
                clientId: clientId,
                authority: aadEndpoint + "/" + tenantId,
                clientSecret: clientSecret,
            },
        });

        this.client = this.createClient(graphEndpoint + "/v1.0");
    }

    private async getToken(): Promise<AuthenticationResult | null> {
        if (this.authenticationResult != null) {
            if (this.authenticationResult.expiresOn != null) {
                const current = moment();
                const expiresOn = moment(this.authenticationResult.expiresOn);

                if (expiresOn.isBefore(current)) {
                    console.warn(
                        `the expires date from token is before current date - ${current.format()} < ${expiresOn.format()} - we have to refresh token`,
                    );
                    this.authenticationResult = null;
                }
            } else {
                console.info(`authenticationResult.expiresOn is null`);
                console.info(`we will refresh the token`);

                this.authenticationResult = null;
            }
        }

        // refresh token
        if (this.authenticationResult == null) {
            console.info("refresh token");
            this.authenticationResult = await this.cca.acquireTokenByClientCredential(this.tokenRequest);
        }

        if (this.authenticationResult == null) {
            console.error("after refresh token we have still no token");
        }

        return this.authenticationResult;
    }

    public async getUsers() {
        const authResponse = await this.getToken();
        const options = this.createAxiosOptions(authResponse);

        const { data, status } = await this.client.get("/users", options);

        console.log(data);
    }

    public async getAllContacts(userId: string): Promise<Contact[]> {
        const authResponse = await this.getToken();
        const options = this.createAxiosOptions(authResponse);
        const baseUrl = `/users/${userId}/contacts`;

        let contacts: Contact[] = [];
        let repsonse;
        let skip = 0;

        do {
            repsonse = (await this.client.get<ContactsResult>(`/users/${userId}/contacts?$skip=${skip}`, options)).data;
            contacts = contacts.concat(repsonse.value);
            skip += 10;
        } while (repsonse["@odata.nextLink"] != null);

        return contacts;
    }

    private createAxiosOptions(authResponse: AuthenticationResult | null): Object {
        let options = {};

        if (authResponse != null) {
            options = {
                headers: {
                    Authorization: `${authResponse.tokenType} ${authResponse.accessToken}`,
                },
            };
        }

        return options;
    }

    private createClient(serverBaseUrl: string): AxiosInstance {
        return axios.create({
            baseURL: `${serverBaseUrl}`,
            timeout: 5000,
            responseType: "json",
            responseEncoding: "utf8",
        });
    }
}
