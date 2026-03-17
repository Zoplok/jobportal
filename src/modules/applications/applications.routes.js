const { Router } = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { apply, myApplications, jobApplications, updateStatus } = require('./applications.controller');

const router = Router();

// POST /applications — apply to a job (Candidates only)
router.post('/', authenticate, authorize('CANDIDATE'), apply);

// GET /applications/my — view my applications (Candidates only)
router.get('/my', authenticate, authorize('CANDIDATE'), myApplications);

// GET /applications/job/:jobId — view applications for a job (Employers only)
router.get('/job/:jobId', authenticate, authorize('EMPLOYER'), jobApplications);

// PUT /applications/:id/status — update application status (Employers only)
router.put('/:id/status', authenticate, authorize('EMPLOYER'), updateStatus);

module.exports = router;
