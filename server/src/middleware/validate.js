const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: errors.join(', ')
                }
            });
        }
        next();
    };
};

module.exports = validate;