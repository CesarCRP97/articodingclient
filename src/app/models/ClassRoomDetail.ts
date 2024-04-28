import { IUser } from "./IUser";
import { ILevel } from "./ILevel";
import { LevelsCompletedResponse } from "./LevelsCompletedResponse";

export class ClassRoomDetail {

    name: string;
    description: string;
    teachers: IUser[];
    students: IUser[];
    levels: ILevel[];
    levelsCompletedByUsers : LevelsCompletedResponse[];
    enabled: boolean;
    classKey : string;

    constructor() {
        this.name = '';
        this.description = '';
        this.teachers = [];
        this.students = [];
        this.levels = [];
        this.levelsCompletedByUsers = [];
        this.enabled = true;
        this.classKey = '';

    }
}