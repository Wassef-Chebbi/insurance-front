export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    image?: string;
    role?: string;

}

export class User {
    constructor(
        public id: string = '',
        public firstname: string = '',
        public lastname: string = '',
        public email: string = '',
        public number: string = '',
        public role?: string,
        public image?: string
    ) { }
}