const typeDefs = `
  type Query {
    article(id: String, seoId: String): Article,
    articles(count: Int, page: Int, sectionName: String): [Article]!,
    author(id: Int, seoName: String): Author,
    collection(id: String!): Collection,
  }
  type Collection {
    id: ID!,
    status: String,
    displayDate: String,
    updatedDate: String,
    articles: [Article],
    parameters: [CollectionParameter],
  }
  type CollectionParameter {
    name: String,
    value: String,
  }
  type Article {
    id: ID!,
    type: String,
    seoId: String,
    canonicalUrl: String,
    headline: String,
    summary: String,
    keywords: [String],
    sectionName: String,
    sectionType: String,
    published: String,
    comments: ArticleComments,
    authors: [Author],
    image: ArticleImage,
  }
  type ArticleComments {
    count: Int,
    enabled: Boolean,
  }
  type ArticleImage {
    slug: ID!,
    url: String,
    credit: String,
    caption: String,
    height: Int,
    width: Int,
  },
  type Author {
    id: ID!,
    seoName: String!,
    byline: String,
    bio: String,
    seoDescription: String,
    title: String,
    email: String,
    twitterHandle: String,
    facebookHandle: String,
    hedcutUrl: String,
    articles(count: Int, page: Int): [Article],
  }
`;

module.exports = typeDefs;
