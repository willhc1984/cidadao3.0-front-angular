export interface PageResponse<T>{
    elements: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}