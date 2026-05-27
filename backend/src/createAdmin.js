const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(
      'Admin',
      10
    );

    const admin = await prisma.admin.update({
      where: {
        id: 'admin',
      },
      data: {
        email: 'admin@infura.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    console.log(
      'Admin password reset successfully!'
    );

    console.log({
      email: admin.email,
      password: 'Admin',
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();