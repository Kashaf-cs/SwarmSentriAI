from dotenv import load_dotenv
from agents.supervisor import SupervisorAgent

load_dotenv()

url = "https://example.com"

print("\n🚀 Starting SwarmSentriAI...")
print(f"🔎 Scanning: {url}\n")

supervisor = SupervisorAgent()
result = supervisor.run(url)

print("\n========== FINAL RESULT ==========")

print("\nSupervisor:")
print(result["agents"]["supervisor"])

print("\nURL Security:")
print(result["agents"]["url_security"])

print("\nSpecialists:")

for agent in result["agents"]["specialists"]:
    print("\n-------------------------")
    print("Agent:", agent["agent"])
    print("Risk:", agent["risk_score"])
    print("Severity:", agent["severity"])
    print("Reasoning:", agent["reasoning"])

print("\nDecision:")
print(result["agents"]["decision"])