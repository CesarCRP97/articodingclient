export interface IUser {

    username: string;
    password: string;
    enabled: boolean;
    rol: string;
    likedLevels: number[];
    likedPlaylists: number[];
}