const AppError = require('../utils/AppError');

/**
 * Global error handler middleware.
 * Express knows this is an error handler because it has 4 parameters:
 * (err, req, res, next).
 *
 * This MUST be the last middleware mounted in index.js — after all routes.
 * It catches every error thrown or passed via next(err) in the app.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = 500;
  let message = 'Something went wrong';

  // ─── Prisma P2002: Unique constraint violation ─────────
  // e.g. trying to register with an email that already exists
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Already exists. A record with this data is already in the database.';
  }

  // ─── Prisma P2025: Record not found ────────────────────
  // e.g. trying to update/delete a record that doesn't exist
  else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // ─── AppError: Our custom error class ──────────────────
  // We threw this ourselves with a specific statusCode and message
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ─── JWT errors ────────────────────────────────────────
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // ─── express-validator errors ──────────────────────────
  else if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = err.array().map((e) => e.msg);
  }

  // ─── Fallback: unknown errors ──────────────────────────
  else if (err.message) {
    message = err.message;
  }

  // In production, never expose stack traces to clients.
  const response = {
    error: message,
  };
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  console.error(`[ERROR] ${statusCode} — ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
