const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('./applications.service');

/**
 * Look up the Candidate profile for the authenticated user.
 */
async function getCandidateId(userId) {
  const candidate = await prisma.candidate.findUnique({ where: { userId } });
  if (!candidate) {
    throw new AppError('Candidate profile not found', 404);
  }
  return candidate.id;
}

/**
 * Look up the Employer profile for the authenticated user.
 */
async function getEmployerId(userId) {
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) {
    throw new AppError('Employer profile not found', 404);
  }
  return employer.id;
}

async function apply(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const { jobPostId, coverLetter } = req.body;
    const application = await applyToJob(candidateId, jobPostId, coverLetter);
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

async function myApplications(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const applications = await getMyApplications(candidateId);
    res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
}

async function jobApplications(req, res, next) {
  try {
    const employerId = await getEmployerId(req.user.userId);
    const jobPostId = parseInt(req.params.jobId, 10);
    const applications = await getJobApplications(jobPostId, employerId);
    res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const employerId = await getEmployerId(req.user.userId);
    const applicationId = parseInt(req.params.id, 10);
    const { status } = req.body;
    const application = await updateApplicationStatus(applicationId, employerId, status);
    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
}

module.exports = { apply, myApplications, jobApplications, updateStatus };
