import { IUser } from "./IUser";

export interface ILevel {

    id: number;
    title: string;
    description: string;
    publicLevel: boolean;
    owner: IUser;
    classRooms: number;
    likes: number;
    timesPlayed: number;
    active: boolean;
    
}

export interface ILevelWithImage {
    level: ILevel;
    image: string;
}
