import morgan from 'morgan';

// Log requests in dev format for development, combined format for production
const loggerMiddleware = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);

export default loggerMiddleware;
