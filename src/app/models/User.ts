export class User {

    username: string;
    password: string;
    enabled: boolean;
    roles: string[];
    classes: number[];

    constructor() {
        this.username = '';
        this.password = '';
        this.enabled = true;
        this.roles = [];
        this.classes = [];
    }
}