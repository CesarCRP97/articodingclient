import { IUser } from "./IUser";
import { ILevel } from "./ILevel";
export interface IPlaylist {
    id: number;
    title: string;
    owner: IUser;
    enabled: boolean;
    levels: ILevel[];
    likes: number;
    timesPlayed: number;
}