const axios = require('axios');

// Função para buscar página do Reddit
async function fetchPage(url, token) {
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'RedditCrawler/0.1 by Automatic-Mix-7369'
    }
  });
  return response;
}

module.exports = fetchPage;
