import { ISort } from "./ISort";

export interface IPageable {

    pageSize: number;
    pageNumber: number;
    sort: ISort;
}