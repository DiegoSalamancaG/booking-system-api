const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@test.com";
  const adminPass = "1234test"

  // Verificar si ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  // Hash de contraseña
  const hashedPassword = await bcrypt.hash(adminPass, 10);

  // Crear admin
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });