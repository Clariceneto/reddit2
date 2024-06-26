# Reddit Scraper Crawler

This project is a Reddit scraper and crawler that fetches posts and comments based on specific search queries, filters them by upvotes, and saves the results in various formats. It also supports posting the fetched data to a webhook.

## Features

- Fetches Reddit posts based on search queries
- Filters posts by upvotes
- Retrieves comments for each post
- Saves data in JSON, CSV, Excel, and PDF formats
- Supports posting data to a webhook

## Prerequisites

- Node.js installed
- Reddit API credentials

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Clariceneto/reddit2.git
    cd reddit-scraper-crawler
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with your Reddit API credentials:
    ```
    REDDIT_CLIENT_ID=your_client_id
    REDDIT_CLIENT_SECRET=your_client_secret
    REDDIT_USERNAME=your_username
    REDDIT_PASSWORD=your_password
    ```

## Usage

To run the crawler, use the following command with appropriate options:

```sh
node redditCrawler.js -n <amount> -t <time_period> -s <search_query> -o <output_file> -u <upvotes> [-w <webhook_url>] [-v]
Options
-n, --amount <number>: Number of results to fetch
-t, --time_period <period>: Time period for search (e.g., day, week, month)
-s, --search <query>: Search query
-o, --output <file>: Output file for the resulting data (supports .json, .csv, .xlsx, .pdf)
-u, --upvotes <number>: Minimum number of upvotes to filter
-w, --webhook_url <url>: Webhook URL to post results (optional)
-v, --verbose: Enable verbose mode (optional)
Example
To fetch 10 posts from the past day with the search query "AI" that have at least 5 upvotes, and save the results to output.json:

sh
Copy code
node redditCrawler.js -n 10 -t day -s "AI" -o output.json -u 5 -w "http://localhost:5678/webhook/ssm-twitter-in" -v
Project Structure
redditCrawler.js: Main script to run the crawler
modules/
fetchPage.js: Module to fetch pages from Reddit
extractData.js: Module to extract data from fetched pages
fetchComments.js: Module to fetch comments for each post
saveData.js: Module to save data in various formats
logger.js: Logging module
utils.js: Utility functions
.env: Environment variables for Reddit API credentials
