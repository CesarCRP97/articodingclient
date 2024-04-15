import { IUser } from "./IUser";

export interface IClassRoom {

    name: string;
    description: string;
    teachers: IUser[];
    students: number;
    levels: number;
    key: string;
}