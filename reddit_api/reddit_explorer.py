import sys
import requests

def display_community(subreddit):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    about_url = f"https://www.reddit.com/r/{subreddit}/about.json"
    rules_url = f"https://www.reddit.com/r/{subreddit}/about/rules.json"
    posts_url = f"https://www.reddit.com/r/{subreddit}/top.json?limit=10"

    print("\n" + "=" * 80)
    print(f"COMMUNITY: r/{subreddit}")
    print("=" * 80)

    about_res = requests.get(about_url, headers=headers, allow_redirects=False)
    if about_res.status_code == 200:
        data = about_res.json().get("data", {})
        title = data.get("title", "")
        subscribers = data.get("subscribers", 0)
        active_users = data.get("active_user_count", 0)
        description = data.get("public_description", "").strip() or data.get("description", "").strip()

        print(f"Title:       {title}")
        print(f"Subscribers: {subscribers:,} members ({active_users:,} active)")
        print("\nDESCRIPTION / SUMMARY:")
        print(description if description else "No description available.")
    else:
        print(f"Failed to fetch community details. HTTP Status: {about_res.status_code}")

    print("\n" + "-" * 80)
    print("COMMUNITY RULES:")
    print("-" * 80)

    rules_res = requests.get(rules_url, headers=headers, allow_redirects=False)
    if rules_res.status_code == 200:
        rules = rules_res.json().get("rules", [])
        if rules:
            for idx, rule in enumerate(rules, 1):
                short_name = rule.get("short_name", "")
                desc = rule.get("description", "").strip()
                print(f"{idx}. {short_name}")
                if desc:
                    print(f"   {desc.splitlines()[0]}")
        else:
            print("No rules listed.")
    else:
        print(f"Failed to fetch community rules. HTTP Status: {rules_res.status_code}")

    print("\n" + "-" * 80)
    print(f"TOP 10 POSTS IN r/{subreddit}:")
    print("-" * 80)

    posts_res = requests.get(posts_url, headers=headers, allow_redirects=False)
    if posts_res.status_code == 200:
        posts = posts_res.json().get("data", {}).get("children", [])
        if posts:
            print(f"{'#':<4} {'Score':<8} {'Title':<45} {'Author':<15} {'Comments':<8}")
            print("-" * 80)
            for idx, post in enumerate(posts[:10], 1):
                post_data = post.get("data", {})
                title = post_data.get("title", "")
                if len(title) > 42:
                    title = title[:39] + "..."
                score = post_data.get("score", 0)
                author = post_data.get("author", "unknown")
                if len(author) > 14:
                    author = author[:12] + ".."
                comments = post_data.get("num_comments", 0)
                print(f"{idx:<4} {score:<8} {title:<45} {author:<15} {comments:<8}")
        else:
            print("No posts found.")
    else:
        print(f"Failed to fetch posts. HTTP Status: {posts_res.status_code}")

    print("=" * 80 + "\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        subreddit = sys.argv[1].strip().lstrip("r/").lstrip("/")
    else:
        subreddit = input("Enter subreddit name (e.g. python, space, webdev): ").strip().lstrip("r/").lstrip("/")
        if not subreddit:
            subreddit = "python"

    display_community(subreddit)
