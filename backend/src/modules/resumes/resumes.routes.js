const { Router } = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { create, myResumes, update, remove } = require('./resumes.controller');

const router = Router();

// POST /resumes — create a new resume (Candidates only)
router.post('/', authenticate, authorize('CANDIDATE'), create);

// GET /resumes/my — view my resumes (Candidates only)
router.get('/my', authenticate, authorize('CANDIDATE'), myResumes);

// PUT /resumes/:id — update a resume (Candidates only, must own it)
router.put('/:id', authenticate, authorize('CANDIDATE'), update);

// DELETE /resumes/:id — delete a resume (Candidates only, must own it)
router.delete('/:id', authenticate, authorize('CANDIDATE'), remove);

module.exports = router;
