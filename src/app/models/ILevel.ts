import { IUser } from "./IUser";

export interface ILevel {

    title: string;
    description: string;
    publicLevel: boolean;
    owner: IUser;
    classRooms: number;
}