require('dotenv').config();
const axios = require('axios');
const { Command } = require('commander');
const { saveToJson, saveToCsv, saveToExcel, saveToPdf, postToWebhook } = require('./modules/saveData');
const fetchPage = require('./modules/fetchPage');
const extractData = require('./modules/extractData');
const fetchCommentsForPosts = require('./modules/fetchComments');
const logger = require('./modules/logger');
const { delay } = require('./modules/utils');

// Função para autenticação no Reddit
async function authenticate() {
  try {
    const response = await axios.post('https://www.reddit.com/api/v1/access_token',
      `grant_type=password&username=${process.env.REDDIT_USERNAME}&password=${process.env.REDDIT_PASSWORD}`, {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    logger.info('Authentication successful, access token received.');
    return response.data.access_token;
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    throw error;
  }
}

// Função para buscar posts do Reddit com retry
async function fetchWithRetry(url, token, retries = 3, backoff = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.debug(`Fetching URL: ${url}, Attempt: ${attempt}`);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'RedditCrawler/0.1 by Automatic-Mix-7369'
        }
      });
      return response;
    } catch (error) {
      logger.error(`Attempt ${attempt} failed with error: ${error.message}`);
      if (attempt === retries) {
        throw error;
      }
      logger.warn(`Attempt ${attempt} failed. Retrying in ${backoff}ms...`);
      await delay(backoff);
      backoff *= 2; // Exponential backoff
    }
  }
}

// Função principal
async function main(options) {
  try {
    const token = await authenticate();
    const queries = options.search.split(',').map(query => query.trim());
    const amount = options.amount;
    const minUpvotes = options.upvotes;
    const timePeriod = options.time_period;
    let allPosts = [];
    let postsByQuery = [];

    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = currentTime - (timePeriod * 60 * 60);

    for (const query of queries) {
      logger.info(`Searching posts for query: ${query}`);
      const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=100&sort=new&restrict_sr=on&t=all`;
      const data = await fetchWithRetry(url, token);
      logger.debug(`Data received from Reddit: ${JSON.stringify(data.data, null, 2)}`);
      let posts = extractData(data.data, minUpvotes);

      posts = posts.filter(post => post.created_utc >= startTime && post.created_utc <= currentTime);
      posts = await fetchCommentsForPosts(posts, token, minUpvotes);

      allPosts = allPosts.concat(posts.slice(0, amount));
      postsByQuery.push(posts.slice(0, amount));
    }

    if (options.output.endsWith('.json')) {
      saveToJson(allPosts, options.output);
    } else if (options.output.endsWith('.csv')) {
      await saveToCsv(postsByQuery, options.output);
    } else if (options.output.endsWith('.xlsx')) {
      await saveToExcel(postsByQuery, options.output);
    } else if (options.output.endsWith('.pdf')) {
      await saveToPdf(postsByQuery, options.output);
    }

    if (options.webhook_url) {
      try {
        await postToWebhook(options.webhook_url, allPosts);
        logger.info(`Data successfully posted to webhook: ${options.webhook_url}`);
      } catch (error) {
        logger.error(`Error posting to webhook: ${error.message}`);
        logger.debug(error.response ? error.response.data : 'No response data');
      }
    }
  } catch (error) {
    logger.error(`Error in main function: ${error.message}`);
  }
}

const program = new Command();

program
  .version('1.0.0')
  .description('Reddit Crawler')
  .requiredOption('-n, --amount <number>', 'Number of results to fetch', parseInt)
  .requiredOption('-t, --time_period <period>', 'Time period for search in hours')
  .requiredOption('-s, --search <query>', 'Search query')
  .option('-w, --webhook_url <url>', 'Webhook URL to post results', 'http://localhost:5678/webhook/ssm-twitter-in')
  .requiredOption('-o, --output <file>', 'Output file for the resulting data')
  .requiredOption('-u, --upvotes <number>', 'Minimum number of upvotes to filter', parseInt)
  .option('-v, --verbose', 'Enable verbose mode')
  .option('-c, --config_file <file>', 'Configuration file')
  .parse(process.argv);

const options = program.opts();

main(options);
