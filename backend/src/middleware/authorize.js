/**
 * Authorization middleware factory.
 * Takes a list of allowed roles and returns a middleware function
 * that checks if the authenticated user has one of those roles.
 *
 * Usage: authorize('EMPLOYER') or authorize('EMPLOYER', 'CANDIDATE')
 *
 * Must be used AFTER the authenticate middleware (req.user must exist).
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission.' });
    }

    next();
  };
}

module.exports = authorize;
