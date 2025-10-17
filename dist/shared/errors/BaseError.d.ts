export declare class BaseError extends Error {
    status: number;
    errorType: string;
    constructor(message: string, errorType: string, status: number, name?: string);
}
