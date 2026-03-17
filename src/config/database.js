const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance and reuse it across the app.
// This prevents opening multiple database connection pools.
const prisma = new PrismaClient();

module.exports = prisma;
