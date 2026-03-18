const jwt = require('jsonwebtoken');

/**
 * Authentication middleware.
 * Reads the JWT token from the Authorization header,
 * verifies it, and attaches the decoded payload to req.user.
 *
 * Expected header format: "Bearer <token>"
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Split "Bearer eyJhbGciOi..." and take the second part (the token).
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify checks if the token was signed with our secret
    // and has not expired. If valid, it returns the decoded payload.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authenticate;
