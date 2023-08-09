import { IClassRoom } from "./IClassRoom";
import { IRole } from "./IRole";
import { IUserDetail } from "./IUserDetail";
import { ILevel } from "./Ilevel";

export class UserDetail implements IUserDetail {
    id: number;
    username: string;
    enabled: boolean;
    role: IRole;
    createdLevels: ILevel[];
    classRooms: IClassRoom[];
    ownerClassRooms: IClassRoom[];
    password: string;
    constructor() {
        this.username = '';
        this.enabled = true;
        this.role = { name: ''};
        this.createdLevels = [];
        this.classRooms = [];
        this.ownerClassRooms = [];
        this.password = '';
    }
}