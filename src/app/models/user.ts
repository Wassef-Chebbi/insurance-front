export interface User {
    id: string;
    firstname: string;
    lastname: string;
    number: string;
    email: string;
    password?: string;
    image?: string;
    role?: string;

}

export class User {
    constructor(
        public id: string = '',
        public firstname: string = '',
        public lastname: string = '',
        public number: string = '',
        public email: string = '',
        public password?: string,
        public role?: string,
        public image?: string
    ) { }
}