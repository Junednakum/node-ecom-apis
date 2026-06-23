import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Seed Admin User
  const adminEmail = 'admin@ecom.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`✅ Admin user seeded: ${admin.email} (Password: admin123)`);
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Seed Default Categories
  const categories = [
    { name: 'Electronics', description: 'Smartphones, Laptops, Accessories and more' },
    { name: 'Apparel & Fashion', description: 'Quality clothing, footwear, and accessories' },
    { name: 'Home & Kitchen', description: 'Smart home appliances and kitchenware' },
    { name: 'Books & Stationery', description: 'Educational, fiction and office materials' },
  ];

  const categoryMap = {};

  for (const cat of categories) {
    let dbCategory = await prisma.category.findUnique({
      where: { name: cat.name },
    });

    if (!dbCategory) {
      dbCategory = await prisma.category.create({ data: cat });
      console.log(`✅ Category seeded: ${dbCategory.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${dbCategory.name}`);
    }
    categoryMap[cat.name] = dbCategory.id;
  }

  // 3. Seed Default Products
  const products = [
    {
      name: 'Quantum Wireless Headphones',
      description: 'Noise cancelling over-ear wireless headphones with 40-hour battery life',
      price: 189.99,
      stock: 45,
      image: '/public/uploads/quantum-headphones.jpg',
      categoryId: categoryMap['Electronics'],
    },
    {
      name: 'Vortex Mechanical Keyboard',
      description: 'RGB mechanical gaming keyboard with tactile red switches',
      price: 99.50,
      stock: 30,
      image: '/public/uploads/mechanical-keyboard.jpg',
      categoryId: categoryMap['Electronics'],
    },
    {
      name: 'Minimalist Cotton T-Shirt',
      description: '100% organic combed cotton t-shirt in space gray',
      price: 24.99,
      stock: 150,
      image: '/public/uploads/cotton-tshirt.jpg',
      categoryId: categoryMap['Apparel & Fashion'],
    },
    {
      name: 'Stainless Steel Travel Mug',
      description: 'Vacuum insulated double-wall travel mug (500ml)',
      price: 19.99,
      stock: 80,
      image: '/public/uploads/travel-mug.jpg',
      categoryId: categoryMap['Home & Kitchen'],
    },
  ];

  for (const prod of products) {
    const existingProd = await prisma.product.findFirst({
      where: { name: prod.name },
    });

    if (!existingProd) {
      const dbProduct = await prisma.product.create({ data: prod });
      console.log(`✅ Product seeded: ${dbProduct.name}`);
    } else {
      console.log(`ℹ️ Product already exists: ${prod.name}`);
    }
  }

  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
