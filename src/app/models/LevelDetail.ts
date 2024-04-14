import { IUser } from "./IUser";

export class LevelDetail {

    title: string;
    description: string;
    publicLevel: boolean;
    active: boolean;
    classRooms: number;
    owner: IUser;
    likes: number;
    timesPlayed: number;

    constructor() {
        this.title = '';
        this.description = '';
        this.publicLevel = false;
        this.active = false;
        this.owner = null;
        this.classRooms = null;
        this.likes = 0;
        this.timesPlayed = 0;
    }
}