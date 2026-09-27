from dotenv import load_dotenv

from tools.virustotal_tool import scan_url_with_virustotal
from tools.urlscan_tool import scan_url_with_urlscan

load_dotenv()

test_url = "https://example.com"

print("\n--- VirusTotal ---")
print(scan_url_with_virustotal(test_url))

print("\n--- URLScan ---")
print(scan_url_with_urlscan(test_url))