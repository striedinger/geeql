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
- `ALT_AUTHOR_API_URL` since author api is not public, we'll use `?/type=foo&id=bar` on main site.
- `CORAL_URL`

### Resources
- Query

|Parameter|Arguments|Type|
| --- | --- | --- |
|article|id: String, seoId: String|Article|
|articles|count: Int = 10, page: Int = 0, sectionName: String|[Article]|
|author|id: Int, seoName: String|Author|
|collection|id: String|Collection|

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
|authors| |[Author]|
|image| |ArticleImage|
|comments| |ArticleComments|

- ArticleImage

|Parameter|Arguments|Type|
| --- | --- | --- |
|slug| |ID!|
|url| |String|
|credit| |String|
|caption| |String|
|height| |Int|
|width| |Int|

- ArticleComments

|Parameter|Arguments|Type|
| --- | --- | --- |
|enabled| |Boolean|
|count| |Int|

- Collection

|Parameter|Arguments|Type|
| --- | --- | --- |
|id| |ID!|
|status| |String|
|displayDate| |String|
|updatedDate| |String|
|articles| |[Article]|
|parameters| |[CollectionParameter]|

- CollectionParameter

|Parameter|Arguments|Type|
| --- | --- | --- |
|name| |String|
|value| |String|

- Author

|Parameter|Arguments|Type|
| --- | --- | --- |
|id| |ID!|
|seoName| |String!|
|byline| |String|
|bio| |String|
|seoDescription| |String|
|title| |String|
|email| |String|
|twitterHandle| |String|
|facebookHandle| |String|
|hedcutURL| |String|
|articles|count: Int = 10, page: Int = 0|[Article]|