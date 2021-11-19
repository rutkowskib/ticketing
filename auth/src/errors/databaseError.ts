import { CustomError } from './customError';

export class DatabaseError extends CustomError {
    statusCode = 500;
    reason = 'Error';

    constructor() {
        super('DB error');
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{ message: this.reason }];
    }
}