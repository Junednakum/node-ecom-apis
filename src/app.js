import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import loggerMiddleware from './middlewares/logger.middleware.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import apiRoutes from './routes/index.js';
import swaggerSpec from './config/swagger.js';
import NotFoundError from './errors/NotFoundError.js';

const app = express();

// 1. Set Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Logging middleware
app.use(loggerMiddleware);

// 3. Rate limiting
app.use('/api', rateLimiter);

// 4. CORS settings
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// 5. Body parsers (JSON, URLencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Cookie parser
app.use(cookieParser());

// 7. Serve Static Files (uploaded product images)
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// 8. Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 9. API Routes
app.use('/api/v1', apiRoutes);

// 10. Default Home Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to E-Commerce REST API. Go to /api-docs for documentation.',
  });
});

// 11. Handle Unhandled Routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

// 12. Centralized Error Handler
app.use(errorMiddleware);

export default app;
