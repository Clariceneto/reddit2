# Reddit Crawler

A Reddit Crawler to fetch and analyze posts and comments based on a search query.

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/reddit-crawler.git
    cd reddit-crawler
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file with your Reddit API credentials:
    ```plaintext
    REDDIT_CLIENT_ID=your-client-id
    REDDIT_CLIENT_SECRET=your-client-secret
    REDDIT_USERNAME=your-username
    REDDIT_PASSWORD=your-password
    ```

4. Run the crawler:
    ```sh
    node redditCrawler.js -n 10 -t day -s "AI, artificial intelligence" -o output.json -u 5 -w "http://localhost:5678/webhook/ssm-twitter-in" -v
    ```

## Options

- `-n, --amount <number>`: Number of results to fetch (required)
- `-t, --time_period <period>`: Time period for search (e.g., day, week, month) (required)
- `-s, --search <query>`: Search query (required)
- `-w, --webhook_url <url>`: Webhook URL to post results (optional)
- `-o, --output <file>`: Output file for the resulting data (required)
- `-u, --upvotes <number>`: Minimum number of upvotes to filter (required)
- `-v, --verbose`: Enable verbose mode (optional)
- `-c, --config_file <file>`: Configuration file (optional)
#   r e d d i t - c r a w l e r  
 #   r e d d i t - c r a w l e r  
 