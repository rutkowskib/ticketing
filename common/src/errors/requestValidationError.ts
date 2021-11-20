import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Validation error');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.errors.map((error) => ({ message: error.msg, field: error.param }));
    }
}