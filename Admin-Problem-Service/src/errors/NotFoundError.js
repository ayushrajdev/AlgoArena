import BaseError from './BaseError.js';

class NotFoundError extends BaseError {
    constructor(details) {
        super('Not Found Error', 404, 'Resource not found', details);
    }
}

export default NotFoundError;
