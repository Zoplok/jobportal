const { body, validationResult } = require('express-validator');

const registerRules = [
  body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['EMPLOYER', 'CANDIDATE']).withMessage('Role must be EMPLOYER or CANDIDATE'),
];

const loginRules = [
  body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Middleware that checks if any validation rules failed.
// If errors exist, return 400 with the list of problems.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerRules, loginRules, validate };
