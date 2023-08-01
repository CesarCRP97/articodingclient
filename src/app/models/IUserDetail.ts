import { IClassRoom } from "./IClassRoom";
import { IRole } from "./IRole";
import { ILevel } from "./Ilevel";

export interface IUserDetail{
    id: number;
    username: string;
    enabled: boolean;
    roles: IRole[];
    createdLevels: ILevel[];
    classRooms: IClassRoom[];
    ownerClassRooms: IClassRoom[];
    password: string;
}