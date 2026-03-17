const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('./jobs.service');

/**
 * Look up the Employer profile for the authenticated user.
 * We need the employer.id (not user.id) for job ownership.
 */
async function getEmployerId(userId) {
  const employer = await prisma.employer.findUnique({ where: { userId } });
  if (!employer) {
    throw new AppError('Employer profile not found', 404);
  }
  return employer.id;
}

async function create(req, res, next) {
  try {
    const employerId = await getEmployerId(req.user.userId);
    const job = await createJob(employerId, req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { location, title, page, limit } = req.query;
    const result = await getJobs({
      location,
      title,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const job = await getJobById(parseInt(req.params.id, 10));
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const employerId = await getEmployerId(req.user.userId);
    const job = await updateJob(parseInt(req.params.id, 10), employerId, req.body);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const employerId = await getEmployerId(req.user.userId);
    const job = await deleteJob(parseInt(req.params.id, 10), employerId);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
