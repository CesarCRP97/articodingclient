import { IUser } from "./IUser";
import { ILevel } from "./ILevel";

export class PlaylistDetail {

    id: number;
    title: string;
    owner: IUser;
    levels: ILevel[];
    enabled: boolean;
    likes: number;
    timesPlayed: number;

    constructor() {
        this.title = '';
        this.owner = null;
        this.levels = [];
        this.enabled = true;
        this.likes = 0;
        this.timesPlayed = 0;
    }
}