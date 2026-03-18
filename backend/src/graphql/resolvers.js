const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { getJobs, getJobById } = require('../modules/jobs/jobs.service');
const { applyToJob, getMyApplications } = require('../modules/applications/applications.service');

const resolvers = {
  Query: {
    // Public: list jobs with optional filters
    jobs: async (_parent, args) => {
      const { location, title, page, limit } = args;
      const result = await getJobs({
        location,
        title,
        page: page || 1,
        limit: limit || 10,
      });
      return result.jobs;
    },

    // Public: get a single job by ID
    job: async (_parent, args) => {
      return getJobById(args.id);
    },

    // Protected: get the authenticated candidate's applications
    myApplications: async (_parent, _args, context) => {
      if (!context.user) {
        throw new AppError('You must be logged in', 401);
      }
      if (context.user.role !== 'CANDIDATE') {
        throw new AppError('Only candidates can view their applications', 403);
      }
      const candidate = await prisma.candidate.findUnique({
        where: { userId: context.user.userId },
      });
      if (!candidate) {
        throw new AppError('Candidate profile not found', 404);
      }
      return getMyApplications(candidate.id);
    },
  },

  Mutation: {
    // Protected: apply to a job as a candidate
    applyToJob: async (_parent, args, context) => {
      if (!context.user) {
        throw new AppError('You must be logged in', 401);
      }
      if (context.user.role !== 'CANDIDATE') {
        throw new AppError('Only candidates can apply to jobs', 403);
      }
      const candidate = await prisma.candidate.findUnique({
        where: { userId: context.user.userId },
      });
      if (!candidate) {
        throw new AppError('Candidate profile not found', 404);
      }
      return applyToJob(candidate.id, args.jobPostId, args.coverLetter);
    },
  },
};

module.exports = resolvers;
