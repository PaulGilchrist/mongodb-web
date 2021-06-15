export interface Address {
    "street": string,
    "city": string,
    "state": string,
    "zip": string
}

export interface Contact {
    "id": string,
    "firstName": string,
    "lastName": string,
    "displayName": string,
    "addresses": Address[],
    "emails": Email[],
    "phones": Phone[]
}

export interface Email {
    "email": string
}

export interface Phone {
    "phoneNumber": string
}