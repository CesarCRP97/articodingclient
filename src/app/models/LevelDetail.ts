import { IUser } from "./IUser";

export class LevelDetail {

    title: string;
    description: string;
    publicLevel: boolean;
    active: boolean;
    classRooms: number;
    owner: IUser;

    constructor() {
        this.title = '';
        this.description = '';
        this.publicLevel = false;
        this.active = false;
        this.owner = null;
        this.classRooms = null;
    }
}