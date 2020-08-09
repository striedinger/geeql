const typeDefs = `
  type Query {
    article(id: String, seoId: String): Article,
    articles(count: Int, page: Int, sectionName: String): [Article]!,
    author(id: Int, seoName: String): Author,
    collection(collectionId: String!): Collection,
  }
  type Collection {
    id: ID!,
    status: String,
    displayDate: String,
    updatedDate: String,
    articles: [Article],
    parameters: [CollectionParams],
  }
  type CollectionParams {
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
    enableCoralComments: Boolean,
    commentCount: Int,
    authors: [Author],
    image: Image,
  }
  type Image {
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
