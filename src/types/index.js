const typeDefs = `
  type Query {
    article(id: String, seoId: String): Article,
    articles(count: Int, page: Int, sectionName: String): [Article]!,
    author(id: Int, seoName: String): Author,
  }
  type Article {
    id: ID!,
    type: String,
    seoId: String,
    canonicalUrl: String,
    headline: String,
    keywords: [String],
    sectionName: String,
    sectionType: String,
    published: String,
    enableCoralComments: Boolean,
    commentCount: Int,
    authors: [Author],
  }
  type Author {
    id: ID!,
    seoName: String!,
    firstName: String,
    middleName: String,
    lastName: String,
    byline: String,
    displayName: String,
    bio: String,
    seoDescription: String,
    title: String,
    twitterHandle: String,
    hedcutUrl: String,
    articles(count: Int, page: Int): [Article],
  }
`;

module.exports = typeDefs;
