from dotenv import load_dotenv
from agents.url_security import URLSecurityAgent

load_dotenv()

url = "https://example.com"

agent = URLSecurityAgent()
result = agent.run(url)

print("\n========== URL SECURITY RESULT ==========")
print(result.to_dict())