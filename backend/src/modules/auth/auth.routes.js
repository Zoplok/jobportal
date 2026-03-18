const { Router } = require('express');
const { register, login } = require('./auth.controller');
const { registerRules, loginRules, validate } = require('./auth.validation');

const router = Router();

// POST /auth/register — create a new user account
router.post('/register', registerRules, validate, register);

// POST /auth/login — log in and receive a JWT token
router.post('/login', loginRules, validate, login);

module.exports = router;
