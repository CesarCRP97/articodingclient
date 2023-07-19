import { IPageable } from "./IPageable";

export interface IPage<T> {

    content: T[];
    pageable: IPageable;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}