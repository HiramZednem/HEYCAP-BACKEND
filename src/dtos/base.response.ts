
export class BaseResponse <T> {
    private data: T;
    private success: boolean;
    private message?: string;
    private error?: string;

    constructor(data: T, success: boolean, message?: string, error?: string){
        this.success = success
        this.data = data;
        this.message = message;
        this.error = error;
    }

    toResponseEntity(): BaseResponse<T> { //this methos is used to return a BasesResponse<T> instance with the status code
        return this;
    }
}