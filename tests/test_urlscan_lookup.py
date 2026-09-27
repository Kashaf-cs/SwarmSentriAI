from dotenv import load_dotenv

from tools.urlscan_tool import lookup_url_with_urlscan

load_dotenv()

url = "https://example.com"

result = lookup_url_with_urlscan(url)

print(result)