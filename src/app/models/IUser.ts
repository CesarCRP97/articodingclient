export interface IUser {
    id: number;
    username: string;
    password: string;
    enabled: boolean;
    rol: string;
    likedLevels: number[];
    likedPlaylists: number[];
}