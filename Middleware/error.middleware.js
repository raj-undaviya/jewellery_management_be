export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === 'TokenExpiredError') {
        message = 'jwt expired';
        statusCode = 401;
    } else if (err.name === 'JsonWebTokenError') {
        message = 'invalid token';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
};