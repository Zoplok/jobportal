const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * 1. Hash the password (never store plain text passwords).
 * 2. Create the User record.
 * 3. Create the matching Employer or Candidate profile.
 * 4. Return the user (without the password).
 */
async function registerUser(email, password, role) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password with bcrypt — 12 rounds means it runs the hashing
  // algorithm 2^12 = 4096 times, making it slow to brute-force.
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user and profile in a transaction so both succeed or both fail.
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      // Automatically create the role-specific profile
      ...(role === 'EMPLOYER'
        ? { employer: { create: { companyName: 'My Company' } } }
        : { candidate: { create: { fullName: 'New Candidate' } } }),
    },
    // Select which fields to return (exclude password)
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      employer: true,
      candidate: true,
    },
  });

  return user;
}

/**
 * Log in an existing user.
 * 1. Find user by email.
 * 2. Compare the provided password against the stored hash.
 * 3. Sign and return a JWT token.
 */
async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // bcrypt.compare hashes the provided password the same way and checks
  // if the result matches the stored hash.
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Sign a JWT token. The payload contains the user's id, role, and email.
  // The token expires after the time defined in JWT_EXPIRES_IN (e.g. "7d").
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token };
}

module.exports = { registerUser, loginUser };
