const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

/**
 * Build the GraphQL context for each request.
 * - Always provides prisma (database client).
 * - If a valid Bearer token is in the Authorization header,
 *   also provides the decoded user object.
 * - Public queries still work when user is null.
 */
async function buildContext({ req }) {
  const context = { prisma, user: null };

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      context.user = decoded;
    } catch (err) {
      // Token is invalid or expired — user stays null.
      // Public queries will still work fine.
    }
  }

  return context;
}

module.exports = buildContext;
