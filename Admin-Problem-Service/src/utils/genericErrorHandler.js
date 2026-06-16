import { StatusCodes } from 'http-status-codes';
import BaseError from '../errors/BaseError.js';
import logger from '../config/logger.config.js';

function genericErrorHandler(err, req, res, next) {
    logger.info("Error")
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.details,
            data: {}, // bcz its an exception
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong',
        error: err,
        data: {}, // bcz its an exception
    });
}

export default genericErrorHandler;
