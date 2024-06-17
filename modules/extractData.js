const logger = require('./logger');

function extractData(responseData, minUpvotes) {
  try {
    const posts = responseData.data.children
      .filter(post => post.data.ups >= minUpvotes)
      .map(post => ({
        title: post.data.title,
        author: post.data.author,
        url: post.data.url,
        created_utc: post.data.created_utc,
        ups: post.data.ups,
        permalink: post.data.permalink
      }));

    return posts;
  } catch (error) {
    logger.error(`Error extracting data: ${error.message}`);
    logger.debug(`Response data: ${JSON.stringify(responseData, null, 2)}`);
    throw error;
  }
}

module.exports = extractData;
