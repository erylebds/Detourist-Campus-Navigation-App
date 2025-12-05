// async handler wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// global error handler
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'production' ? {} : {
            stack: err.stack,
            url: req.originalUrl,
            method: req.method
        }
    };

    res.json(errorResponse);
};

// database error handler
const handleDatabaseError = (err, req, res, next) => {
    if (err.code) {
        switch (err.code) {
            case 'ER_DUP_ENTRY':
                err.message = 'Duplicate entry: This record already exists';
                res.status(409);
                break;
            case 'ER_NO_REFERENCED_ROW':
            case 'ER_ROW_IS_REFERENCED':
                err.message = 'Database constraint error: Invalid reference';
                res.status(400);
                break;
            case 'ER_BAD_FIELD_ERROR':
                err.message = 'Database field error: Invalid column';
                res.status(400);
                break;
            case 'PROTOCOL_CONNECTION_LOST':
                err.message = 'Database connection lost';
                res.status(503);
                break;
            default:
                err.message = 'Database error occurred';
                res.status(500);
        }
    }
    next(err);
};

module.exports = {
    asyncHandler,
    notFoundHandler,
    errorHandler,
    handleDatabaseError
};
