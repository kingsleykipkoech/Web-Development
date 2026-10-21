import os
import requests
import urllib.request

env_file = os.path.join(os.path.dirname(__file__), ".env")
if not os.path.exists(env_file):
    env_file = ".env"

API_KEY = ""
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            if line.startswith("API_NASA"):
                delimiter = ":" if ":" in line else "="
                API_KEY = line.split(delimiter)[1].strip().strip('"')
                break

URL = f"https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key={API_KEY}"

response = requests.get(URL)
if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")

image_url = "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/september/NGC5139CadenasParra.jpg"

with open("nasa_image.jpg", "wb") as f:
    f.write(urllib.request.urlopen(image_url).read())