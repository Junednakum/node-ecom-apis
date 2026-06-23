import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Backend API',
      version: '1.0.0',
      description: 'Production-ready Node.js & Express E-Commerce API with Prisma ORM and MySQL. Built using Controller-Service-Repository pattern.',
      contact: {
        name: 'Developer Portfolio',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current API version server path',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter Access Token to authenticate. E.g. "Bearer eyJhbGciOi..."',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'Authenticate using HttpOnly cookie: accessToken',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            image: { type: 'string' },
            categoryId: { type: 'integer' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            productId: { type: 'integer' },
            quantity: { type: 'integer' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] },
            paymentStatus: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  productId: { type: 'integer' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
