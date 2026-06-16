import { StatusCodes } from 'http-status-codes';
import BaseError from './BaseError.js';

class InternalServerError extends BaseError {
    constructor(details) {
        super(
            'BadRequest',
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Internal server error !! please try after sometime`,
            details,
        );
    }
}

export default InternalServerError;
