const typeDefs = `#graphql
  type Employer {
    id: Int!
    companyName: String!
    website: String
  }

  type JobPost {
    id: Int!
    title: String!
    description: String!
    location: String!
    salary: String
    isActive: Boolean!
    tags: [String]
    createdAt: String!
    updatedAt: String!
    employer: Employer
  }

  type Application {
    id: Int!
    candidateId: Int!
    jobPostId: Int!
    status: String!
    coverLetter: String
    appliedAt: String!
    jobPost: JobPost
  }

  type Query {
    jobs(location: String, title: String, page: Int, limit: Int): [JobPost!]!
    job(id: Int!): JobPost
    myApplications: [Application!]!
  }

  type Mutation {
    applyToJob(jobPostId: Int!, coverLetter: String): Application!
  }
`;

module.exports = typeDefs;
