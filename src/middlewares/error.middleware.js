/**
 * Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma Known Request Errors (e.g. Unique constraints)
  if (err.code === 'P2002') {
    statusCode = 400;
    const fields = err.meta?.target || 'fields';
    message = `Duplicate field value for: ${fields}`;
  }

  // Handle Prisma Record NotFound Errors
  if (err.code === 'P2025') {
    statusCode = 404;
    message = err.meta?.cause || 'Record not found';
  }

  // Log full error in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Trace:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

export default errorMiddleware;
