const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { createResume, getMyResumes, updateResume, deleteResume } = require('./resumes.service');

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

async function create(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const resume = await createResume(candidateId, req.body);
    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
}

async function myResumes(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const resumes = await getMyResumes(candidateId);
    res.status(200).json(resumes);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const resume = await updateResume(parseInt(req.params.id, 10), candidateId, req.body);
    res.status(200).json(resume);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const candidateId = await getCandidateId(req.user.userId);
    const result = await deleteResume(parseInt(req.params.id, 10), candidateId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, myResumes, update, remove };
