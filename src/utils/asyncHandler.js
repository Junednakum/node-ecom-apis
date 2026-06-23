/**
 * Wrapper utility to catch errors in async middleware/route handlers
 * and pass them to the express error handler.
 * @param {Function} fn - Async middleware function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
