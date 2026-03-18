const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

/**
 * Apply to a job.
 * A candidate can only apply to the same job once (enforced by @@unique in schema).
 */
async function applyToJob(candidateId, jobPostId, coverLetter) {
  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: { candidateId_jobPostId: { candidateId, jobPostId } },
  });
  if (existing) {
    throw new AppError('You have already applied to this job', 409);
  }

  // Check if the job exists and is active
  const job = await prisma.jobPost.findUnique({ where: { id: jobPostId } });
  if (!job || !job.isActive) {
    throw new AppError('Job not found or no longer active', 404);
  }

  const application = await prisma.application.create({
    data: {
      candidateId,
      jobPostId,
      coverLetter: coverLetter || null,
    },
  });
  return application;
}

/**
 * Get all applications for the authenticated candidate.
 * Includes the job post and employer info so the candidate can see what they applied to.
 */
async function getMyApplications(candidateId) {
  const applications = await prisma.application.findMany({
    where: { candidateId },
    orderBy: { appliedAt: 'desc' },
    include: {
      jobPost: {
        include: {
          employer: { select: { id: true, companyName: true, website: true } },
        },
      },
    },
  });
  return applications;
}

/**
 * Get all applications for a specific job.
 * Only the employer who owns the job can view these.
 */
async function getJobApplications(jobPostId, employerId) {
  // Verify the employer owns this job
  const job = await prisma.jobPost.findUnique({ where: { id: jobPostId } });
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  if (job.employerId !== employerId) {
    throw new AppError('You can only view applications for your own jobs', 403);
  }

  const applications = await prisma.application.findMany({
    where: { jobPostId },
    orderBy: { appliedAt: 'desc' },
    include: {
      candidate: { select: { id: true, fullName: true, phone: true } },
    },
  });
  return applications;
}

/**
 * Update the status of an application (e.g. PENDING → ACCEPTED).
 * Only the employer who owns the job can update the status.
 */
async function updateApplicationStatus(applicationId, employerId, status) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { jobPost: true },
  });
  if (!application) {
    throw new AppError('Application not found', 404);
  }
  if (application.jobPost.employerId !== employerId) {
    throw new AppError('You can only update applications for your own jobs', 403);
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
  return updated;
}

module.exports = { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus };
