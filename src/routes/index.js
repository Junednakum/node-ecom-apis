import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import uploadRoutes from './upload.routes.js';
import prisma from '../config/db.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Ping DB
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'API server is healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'API server is degraded',
      error: error.message,
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// Register routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;
