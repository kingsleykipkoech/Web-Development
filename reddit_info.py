import requests

def fetch_subreddit_info(subreddit_name, your_reddit_username):
    # 1. Structure the required unique User-Agent to comply with access rules
    headers = {
        'User-Agent': f'python:subreddit.assignment:v1.0 (by /u/{your_reddit_username})'
    }
    
    # Base endpoints (appending .json parses raw structured content)
    about_url = f"https://www.reddit.com/r/{subreddit_name}/about.json"
    new_posts_url = f"https://www.reddit.com/r/{subreddit_name}/new.json"
    
    # 2. Query the About Endpoint (Name, Description, Subscribers, and Rules)
    print(f"Fetching details for r/{subreddit_name}...")
    about_response = requests.get(about_url, headers=headers)
    
    if about_response.status_code != 200:
        print(f"Error fetching about data: Status {about_response.status_code}")
        return

    about_data = about_response.json().get('data', {})
    
    # Extract Metadata
    display_name = about_data.get('display_name_prefixed')
    description = about_data.get('public_description')
    subscribers = about_data.get('subscribers')
    
    # Note: Rules are sometimes nested under custom widget contexts depending on the API state.
    # If rules don't appear in 'public_description', they can be found via the rules layout endpoint:
    rules_url = f"https://www.reddit.com/r/{subreddit_name}/about/rules.json"
    rules_response = requests.get(rules_url, headers=headers)
    rules_list = []
    if rules_response.status_code == 200:
        rules_list = [rule.get('short_name') for rule in rules_response.json().get('rules', [])]

    # 3. Query the New Posts Endpoint (Retrieving exactly the 10 newest posts)
    params = {'limit': 10}  # Limit data slice payload size
    posts_response = requests.get(new_posts_url, headers=headers, params=params)
    
    posts_list = []
    if posts_response.status_code == 200:
        children = posts_response.json().get('data', {}).get('children', [])
        for post in children:
            post_data = post.get('data', {})
            posts_list.append({
                'title': post_data.get('title'),
                'author': post_data.get('author'),
                'url': post_data.get('url')
            })
            
    # 4. Display Results
    print("\n" + "="*40)
    print(f"SUBREDDIT NAME: {display_name}")
    print(f"NUMBER OF SUBS: {subscribers:,}")
    print(f"DESCRIPTION:\n{description}\n")
    
    print("SUBREDDIT RULES:")
    for idx, rule in enumerate(rules_list, 1):
        print(f"  {idx}. {rule}")
        
    print(f"\n10 NEWEST POSTS:")
    for idx, post in enumerate(posts_list, 1):
        print(f"  [{idx}] {post['title']} (by u/{post['author']})")
    print("="*40)

# Run the function (Replace with your actual Reddit username)
fetch_subreddit_info(subreddit_name="learnpython", your_reddit_username="your_username_here")
