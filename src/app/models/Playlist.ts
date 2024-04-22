import { IPlaylist } from "./IPlaylist";
import { IUser } from "./IUser";
import { ILevel } from "./ILevel";

export class Playlist implements IPlaylist {
    id: number;
    title: string;
    owner: IUser;
    enabled: boolean;
    levels: ILevel[];
    likes: number;
    timesPlayed: number;

    constructor() {
        this.title = "";
        this.owner = null;
        this.enabled = true;
        this.levels = [];
        this.likes = 0;
        this.timesPlayed = 0;
    }
}