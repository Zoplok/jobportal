const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file FIRST
// so every file below can access process.env values.
dotenv.config();

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const buildContext = require('./graphql/context');

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Production hardening middleware ─────────────────────
app.use(helmet());                                      // security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // allow frontend to call API
app.use(morgan('dev'));                                  // request logging

// Parse incoming JSON request bodies.
// Without this, req.body would be undefined.
app.use(express.json());

// Rate-limit auth routes: max 5 requests per 15-minute window.
// Prevents brute-force password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,                     // max 5 requests per window
  message: { error: 'Too many attempts, try again later' },
});

// Health check route — used to verify the server is running.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ─── REST Routes ─────────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authLimiter, authRoutes);

const jobsRoutes = require('./modules/jobs/jobs.routes');
app.use('/jobs', jobsRoutes);

const applicationsRoutes = require('./modules/applications/applications.routes');
app.use('/applications', applicationsRoutes);

const resumesRoutes = require('./modules/resumes/resumes.routes');
app.use('/resumes', resumesRoutes);

// ─── Global error handler (must be LAST middleware) ──────
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ─── Start server (async because Apollo needs await) ─────
async function startServer() {
  // Create and start Apollo Server BEFORE mounting it on Express.
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  // Mount GraphQL at /graphql. expressMiddleware handles JSON parsing
  // and passes each request through buildContext to extract the user.
  app.use('/graphql', expressMiddleware(apolloServer, { context: buildContext }));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL playground at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
