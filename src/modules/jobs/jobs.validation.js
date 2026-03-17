const { body, validationResult } = require('express-validator');

const jobRules = [
  body('title')
    .notEmpty().withMessage('Title is required'),
  body('description')
    .notEmpty().withMessage('Description is required'),
  body('location')
    .notEmpty().withMessage('Location is required'),
  body('salary')
    .optional()
    .isString().withMessage('Salary must be a string'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { jobRules, validate };
