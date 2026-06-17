const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'Duplicate entry detected'
            }
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'An unexpected error occurred'
        }
    });
};

module.exports = errorHandler;