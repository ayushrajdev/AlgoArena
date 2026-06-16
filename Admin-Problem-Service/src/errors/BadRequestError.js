import { StatusCodes } from 'http-status-codes';
import BaseError from './BaseError.js';

class BadRequestError extends BaseError {
    constructor(propertyName, details) {
        super(
            'BadRequest',
            StatusCodes.BAD_REQUEST,
            `Invalid ${propertyName} provided`,
            details,
        );
    }
}

export default BadRequestError;
