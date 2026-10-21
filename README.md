# Backend Web Development - In-Class Activities & Homework

This repository organizes all daily backend activities, homework assignments, and API integrations.

## Directory Structure

```text
Web-Development/
├── README.md
├── nasa_api/
│   └── nasa-pic_of_the_day.py
└── reddit_api/
    └── reddit_info.py
```

## Activities

### 1. NASA APOD (`nasa_api/`)
Fetches Astronomy Picture of the Day metadata from NASA's REST API and downloads the featured image.
```bash
python3 nasa_api/nasa-pic_of_the_day.py
```

### 2. Reddit API Explorer (`reddit_api/`)
Queries the Reddit API for a specified subreddit. Retrieves community name, subscriber count, rules, description, and the 10 newest posts using custom User-Agent headers.
```bash
python3 reddit_api/reddit_info.py python
```
