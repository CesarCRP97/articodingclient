export class User {

    username: string;
    password: string;
    enabled: boolean;
    role: string;
    classes: number[];

    constructor() {
        this.username = '';
        this.password = '';
        this.enabled = true;
        this.role = '';
        this.classes = [];
    }
}