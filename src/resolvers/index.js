require('dotenv').config();
const axios = require('axios');
const get = require('lodash.get');

const ALLESSEH_URL = process.env.ALLESSEH_URL;
const ALLESSEH_KEY = process.env.ALLESSEH_KEY;
const AUTHOR_API_URL = process.env.ALT_AUTHOR_API_URL;
const CORAL_URL = process.env.CORAL_URL;

const WIRE_IDS_MAP = {
  'PR-': true,
  'BT-': true,
  'DN-': true,
  'LL-': true,
  'ON-': true
};

const callCoralComments = async (canonicalUrl) => {
  const url = `${CORAL_URL}/api/v2/comment-count?asset_url=${canonicalUrl}`;
  const response = await axios.get(url);
  if (response.status === 200) return response.data;
  throw new Error(`${response.status} - ${response.statusText}`);
};

const callAllessehCollection = async (collection) => {
  const response = await axios({
    metthod: 'GET',
    url: `${ALLESSEH_URL}/api/summaries/v2/collection/${collection}`,
    headers: {
      'x-api-key': ALLESSEH_KEY
    }
  });
  if (response.status === 200) return response.data;
  throw new Error(`${response.status} - ${response.statusText}`);
};

const callAllessehArticle = async (id, seoId) => {
  const url = seoId ? `${ALLESSEH_URL}/api/articles/v1/wsj/seoId/${seoId}` : `${ALLESSEH_URL}/api/articles/v1/wsj/originId/${id}`;
  const response = await axios({
    method: 'GET',
    url,
    headers: {
      'x-api-key': ALLESSEH_KEY
    }
  });
  if (response.status === 200) return response.data;
  throw new Error(`${response.status} - ${response.statusText}`);
};

const callAllessehSearch = async (query = {}, page = 0) => {
  const response = await axios({
    method: 'POST',
    url: `${ALLESSEH_URL}/api/Content/v1/query?page=${page}`,
    data: query,
    headers: {
      'x-api-key': ALLESSEH_KEY
    }
  });
  if (response.status === 200) return response.data.data.attributes;
  throw new Error(`${response.status} - ${response.statusText}`);
};

const callAuthorApi = async (id, seoname) => {
  if (!id && !seoname) throw new Error('Must include id or seoname');
  const url = seoname ? `${AUTHOR_API_URL}${seoname}` : `${AUTHOR_API_URL}${id}`;
  const response = await axios.get(url);
  if (response.status === 200) return response.data;
  throw new Error(`${response.status} - ${response.statusText}`);
};

const coralCommentsEnabled = article => {
  const articleId = article.data.id;
  const articleType = article.data.type;
  const flags = article.data.attributes.availability_flags;
  const isWire = articleId.length > 3 && (WIRE_IDS_MAP[articleId.substring(0, 3)] || articleId.indexOf('AP') === 0);
  const disabledBySelfCode = flags.includes('DISABLEUSERCOMMENTS');
  return !isWire && !disabledBySelfCode && articleType === 'article';
};

const resolvers = {
  Query: {
    article: async(parent, args) => {
      const { id, seoId } = args;
      const result = await callAllessehArticle(id, seoId);
      if (result.data) return result;
      throw new Error('Not Found');
    },
    articles: async (parent, args) => {
      const { authorId, authorName, count = 10, page = 0, sectionName = null } = args;
      const sectionFilter = sectionName ? [
        {
          term: {
            key: "SectionName",
            value: sectionName
          }
        }
      ] : [];
      const authorFilter = (authorId || authorName)? [
        {
          term: {
            key: authorId ? "AuthorId" : "Author",
            value: authorId ? authorId : authorName
          }
        }
      ] : [];
      const query = {
        count,
        query: {
          and: [
            {
              term: {
                key: "Product",
                value: "WSJ.com"
              }
            },
            ...sectionFilter,
            ...authorFilter,
          ],
          not: [
            {
              terms: {
                key: "SectionName",
                value: ["Corrections and Amplifications" ,"Decos and Corrections", "Direct Push Alert", "WSJ Puzzles"],
              }
            },
            {
              terms: {
                key: "SectionType",
                value: ["Pepper & Salt", "Deco Summary Liondoor", "Infogrfx House Of The Day", "Pro Bankruptcy Data Tables"],
              }
            }
          ]
        },
        sort: [
          {
            key: "LiveDate",
            order: "desc"
          }
        ]
      };
      const result = await callAllessehSearch(query, page);
      return result;
    },
    author: async (parent, args) => {
      const { id, seoName } = args;
      const result = await callAuthorApi(id, seoName);
      return result;
    },
    collection: async (parent, args) => {
      const { id } = args;
      const result = await callAllessehCollection(id);
      return result;
    },
  },
  Article: {
    id: (parent) => parent.data.id,
    type: (parent) => parent.data.type,
    seoId: (parent) => parent.data.attributes.seo_id,
    canonicalUrl: (parent) => parent.data.attributes.source_url,
    headline: (parent) => parent.data.attributes.headline.text,
    summary: (parent) => get(parent, 'data.attributes.summary.content[1].content[0].text'),
    sectionName: (parent) => parent.data.attributes.section_name,
    sectionType: (parent) => parent.data.attributes.section_type,
    keywords: (parent) => parent.data.attributes.keywords,
    published: (parent) => parent.data.attributes.live_datetime,
    authors: async (parent) => {
      const authors = parent.data.attributes.authors;
      return authors.filter(author => author.id).map(async author => {
        const result = await callAuthorApi(author.id);
        return result;
      });
    },
    comments: async (parent) => parent,
    image: (parent) => {
      const imageObj = parent.links.related.reverse().find(obj => obj.type === 'image') || {};
      return {
        slug: imageObj.slug,
        url: get(imageObj, 'properties.location'),
        credit: imageObj.credit,
        caption: imageObj.caption,
        height: imageObj.height,
        width: imageObj.width,
      }
    },
  },
  ArticleComments: {
    count: async (parent) => {
      if (!coralCommentsEnabled(parent)) return 0;
      const response = await callCoralComments(parent.data.attributes.source_url);
      const data = response[parent.data.attributes.source_url] || {};
      return data.count || 0;
    },
    enabled: (parent) => coralCommentsEnabled(parent),
  },
  Author: {
    id: (parent) => parent.data.authorId,
    seoName: (parent) => parent.data.seoname,
    byline: (parent) => parent.data.byline,
    bio: (parent) => parent.data.biography,
    seoDescription: (parent) => parent.data.seodescription,
    title: (parent) => parent.data.title,
    email: (parent) => parent.data.emailAddress,
    twitterHandle: (parent) => parent.data.twitterHandle,
    facebookHandle: (parent) => parent.data.facebookAccount,
    hedcutUrl: (parent) => parent.data.hedcutImage,
    articles: async (parent, args) => {
      const { count = 10, page = 0 } = args;
      const query = {
        count,
        query: {
          and: [
            {
              term: {
                key: "AuthorId",
                value: parent.data.authorId
              }
            },
            {
              term: {
                key: "Product",
                value: "WSJ.com"
              }
            },
          ]
        }
      };
      const result = await callAllessehSearch(query, page);
      return result;
    }
  },
  Collection: {
    id: (parent) => parent.data.id,
    status: (parent) => parent.data.attributes.status,
    displayDate: (parent) => parent.data.attributes.display_date,
    updatedDate: (parent) => parent.data.attributes.updated_datetime,
    articles: (parent) => parent.included.map(article => article.attributes),
    parameters: (parent) => parent.data.attributes.parameters,
  },
};

module.exports = resolvers;
