# Backend Web Development - In-Class Activities & Homework

This repository contains backend class activities, homework assignments, and API integrations.

## Contents

- **nasa-pic_of_the_day.py**: Fetches Astronomy Picture of the Day metadata from NASA's REST API and downloads the featured image.
- **reddit_info.py**: Command-line interface querying Reddit API for a specified subreddit. Retrieves community name, subscriber counts, rules, description, and the 10 newest posts using custom User-Agent headers.

## Prerequisites

- Python 3
- requests library (`pip install requests`)

## Running Scripts

### NASA Picture of the Day
Ensure a `.env` file exists with `API_NASA="YOUR_KEY"`:
```bash
python3 nasa-pic_of_the_day.py
```

### Reddit Subreddit Explorer
Query any subreddit:
```bash
python3 reddit_info.py python
```
