export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: formattedErrors
        });
      }
      return res.status(400).json({
        success: false,
        error: error.message || 'Invalid payload'
      });
    }
  };
}
