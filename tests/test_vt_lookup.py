from dotenv import load_dotenv

from tools.virustotal_tool import lookup_url_with_virustotal

load_dotenv()

url = "https://example.com"

result = lookup_url_with_virustotal(url)

print(result)