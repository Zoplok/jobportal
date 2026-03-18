const { Router } = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { jobRules, validate } = require('./jobs.validation');
const { create, list, getOne, update, remove } = require('./jobs.controller');

const router = Router();

// POST /jobs — create a new job (Employers only)
router.post('/', authenticate, authorize('EMPLOYER'), jobRules, validate, create);

// GET /jobs — list all active jobs (public)
router.get('/', list);

// GET /jobs/:id — get a single job (public)
router.get('/:id', getOne);

// PUT /jobs/:id — update a job (Employers only, must own the job)
router.put('/:id', authenticate, authorize('EMPLOYER'), jobRules, validate, update);

// DELETE /jobs/:id — soft-delete a job (Employers only, must own the job)
router.delete('/:id', authenticate, authorize('EMPLOYER'), remove);

module.exports = router;
