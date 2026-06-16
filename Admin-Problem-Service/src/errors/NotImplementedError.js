import { StatusCodes } from 'http-status-codes';
import BaseError from './BaseError.js';

class NotImplementedError extends BaseError {
    constructor(methodName) {
        super(
            'Not Implemented',
            StatusCodes.NOT_IMPLEMENTED,
            `Not Implemented ${methodName}`,
            {},
        );
    }
}

export default NotImplementedError;
