# WSJ GRAPHQL

This project intends to show the benefits of using GraphQL to optimize and aggregate data for WSJ Web content.

Allesseh, our current content provider is great and very flexible. However, the current query responses are not optimized resulting in very complicated object properties and excessive response sizes. One single article is ~1k lines of (formatted) code, and ~20kb's. When most of our requests are of at least 10 articles, you can see how this can becomes a problem with bandwidth and filling our caches a lot faster than we already are. For comparison, a fronpage api single article is ~100 lines of (formatted) code. 

## Usage
`npm start` and visit `localhost:4000` to use the GraphQL playground.

## Requirements
You will need to create an `.env` file with the following variables:
- `ALLESSEH_URL`
- `ALLESSEH_KEY`
- `AUTHOR_API_URL`
- `CORAL_URL`

### Resources
- Query

|Parameter|Arguments|Type|
| --- | --- | --- |
|article|id: String, seoId: String|Article|
|articles|count: Int = 10, page: Int = 0, sectionName: String|[Article]|
|author|id: Int, seoName: String|Author|

- Article

|Parameter|Arguments|Type|
| --- | --- | --- |
|id| |ID!|
|type| |String|
|seoId| |String|
|headline| |String|
|keywords| |[String]|
|sectionName| |String|
|sectionType| |String|
|published| |String|
|enableCoralComments| |Boolean|
|commentCount| |Int|
|authors| |[Author]

- Author

|Parameter|Arguments|Type|
| --- | --- | --- |
|id| |ID!|
|seoName| |String!|
|firstName| |String|
|middleName| |String|
|lastName| |String|
|byline| |String|
|displayName| |String|
|bio| |String|
|seoDescription| |String|
|title| |String|
|twitterHandle| |String|
|hedcutURL| |String|
|articles|count: Int = 10, page: Int = 0|[Article]|