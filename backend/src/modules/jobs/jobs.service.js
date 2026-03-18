const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

/**
 * Create a new job post.
 * The employerId comes from the authenticated user's Employer profile.
 */
async function createJob(employerId, data) {
  const job = await prisma.jobPost.create({
    data: {
      employerId,
      title: data.title,
      description: data.description,
      location: data.location,
      salary: data.salary || null,
      tags: data.tags || null,
    },
  });
  return job;
}

/**
 * Get a paginated, filterable list of active jobs.
 * - location: partial match (case-insensitive)
 * - title: partial match (case-insensitive)
 * - page/limit: pagination
 */
async function getJobs({ location, title, page = 1, limit = 10 }) {
  const where = { isActive: true };

  if (location) {
    where.location = { contains: location };
  }
  if (title) {
    where.title = { contains: title };
  }

  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { employer: { select: { id: true, companyName: true, website: true } } },
    }),
    prisma.jobPost.count({ where }),
  ]);

  return { jobs, total, page, limit };
}

/**
 * Get a single job by ID, including employer info.
 */
async function getJobById(id) {
  const job = await prisma.jobPost.findUnique({
    where: { id },
    include: { employer: { select: { id: true, companyName: true, website: true } } },
  });
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  return job;
}

/**
 * Update a job. Only the employer who created it can update it.
 */
async function updateJob(id, employerId, data) {
  const job = await prisma.jobPost.findUnique({ where: { id } });
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  if (job.employerId !== employerId) {
    throw new AppError('You can only update your own jobs', 403);
  }

  const updated = await prisma.jobPost.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      salary: data.salary,
      tags: data.tags,
    },
  });
  return updated;
}

/**
 * Soft-delete a job (set isActive to false).
 * Only the employer who created it can delete it.
 */
async function deleteJob(id, employerId) {
  const job = await prisma.jobPost.findUnique({ where: { id } });
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  if (job.employerId !== employerId) {
    throw new AppError('You can only delete your own jobs', 403);
  }

  const deleted = await prisma.jobPost.update({
    where: { id },
    data: { isActive: false },
  });
  return deleted;
}

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
