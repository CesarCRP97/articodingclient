import { ILevel } from "./ILevel";
import { IUser } from "./IUser";

export class LevelsCompletedByUsers {

    user : IUser;
    level : ILevel;
    

    constructor() {
        this.user = null;
        this.level = null;
    }
}