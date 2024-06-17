const axios = require('axios');
const logger = require('./logger');
const { delay } = require('./utils');

// Função para buscar comentários de um post
async function fetchComments(post, token) {
  const url = `https://oauth.reddit.com${post.permalink}.json`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'RedditCrawler/0.1 by Automatic-Mix-7369'
      }
    });
    const comments = response.data[1].data.children.map(child => child.data);
    return comments;
  } catch (error) {
    logger.error(`Error fetching comments for post: ${post.permalink}, ${error.message}`);
    return [];
  }
}

// Função para buscar comentários para todos os posts
async function fetchCommentsForPosts(posts, token, minUpvotes) {
    for (let post of posts) {
      try {
        const url = `https://oauth.reddit.com${post.permalink}.json`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'RedditCrawler/0.1 by Automatic-Mix-7369'
          }
        });
        const comments = response.data[1].data.children
          .filter(comment => comment.data.ups >= minUpvotes)
          .map(comment => ({
            author: comment.data.author,
            body: comment.data.body,
            ups: comment.data.ups,
            created_utc: comment.data.created_utc
          }));
        post.comments = comments;
        logger.info(`Fetched ${comments.length} comments for post: ${post.url}`);
      } catch (error) {
        logger.error(`Error fetching comments for post: ${post.url}, ${error.message}`);
        post.comments = [];
      }
      await delay(1000); // Adiciona um pequeno atraso entre as requisições
    }
    return posts;
  }
  

module.exports = fetchCommentsForPosts,fetchComments;
