const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred in server side.'
    });
};

module.exports = errorHandler;