export function successResponse(res, { statusCode, message, data }) {
    return res.status(statusCode).json({
        success: true,
        message: message || 'Success response',
        data: data || {},
        error: {},
    });
}
