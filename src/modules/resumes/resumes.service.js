const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

/**
 * Create a new resume for a candidate.
 * skills example: ["JavaScript","Node.js","MySQL"]
 * experience example: [{"company":"ABC","role":"Dev","years":2}]
 */
async function createResume(candidateId, data) {
  const resume = await prisma.resume.create({
    data: {
      candidateId,
      title: data.title,
      fileUrl: data.fileUrl || null,
      skills: data.skills || null,
      experience: data.experience || null,
    },
  });
  return resume;
}

/**
 * Get all resumes for the authenticated candidate.
 */
async function getMyResumes(candidateId) {
  const resumes = await prisma.resume.findMany({
    where: { candidateId },
    orderBy: { createdAt: 'desc' },
  });
  return resumes;
}

/**
 * Update a resume. Only the candidate who owns it can update it.
 */
async function updateResume(id, candidateId, data) {
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }
  if (resume.candidateId !== candidateId) {
    throw new AppError('You can only update your own resumes', 403);
  }

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title : resume.title,
      fileUrl: data.fileUrl !== undefined ? data.fileUrl : resume.fileUrl,
      skills: data.skills !== undefined ? data.skills : resume.skills,
      experience: data.experience !== undefined ? data.experience : resume.experience,
    },
  });
  return updated;
}

/**
 * Delete a resume. Only the candidate who owns it can delete it.
 */
async function deleteResume(id, candidateId) {
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }
  if (resume.candidateId !== candidateId) {
    throw new AppError('You can only delete your own resumes', 403);
  }

  await prisma.resume.delete({ where: { id } });
  return { message: 'Resume deleted successfully' };
}

module.exports = { createResume, getMyResumes, updateResume, deleteResume };
