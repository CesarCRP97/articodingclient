import { IUser } from "./IUser";
import { ILevel } from "./ILevel";

export class ClassRoomDetail {

    name: string;
    description: string;
    teachers: IUser[];
    students: IUser[];
    levels: ILevel[];
    enabled: boolean;
    key : string;

    constructor() {
        this.name = '';
        this.description = '';
        this.teachers = [];
        this.students = [];
        this.levels = [];
        this.enabled = true;
        this.key = '';

    }
}