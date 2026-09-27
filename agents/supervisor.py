from concurrent.futures import ThreadPoolExecutor, as_completed
from .url_security import URLSecurityAgent
from .specialists import SPECIALISTS
from .decision import SecurityDecisionAgent


class SupervisorAgent:
    name = "Supervisor Agent"

    def __init__(self):
        self.security_agent = URLSecurityAgent()
        self.decision_agent = SecurityDecisionAgent()
        self.specialists = [cls() for cls in SPECIALISTS]

    def run(self, url):
        security = self.security_agent.run(url)
        security_data = {
            **security.evidence,
            "security_score": security.risk_score,
        }

        specialist_results = []
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = {
                pool.submit(agent.run, url, security_data): agent
                for agent in self.specialists
            }
            for future in as_completed(futures):
                specialist_results.append(future.result())

        specialist_results.sort(key=lambda x: x.agent)

        decision = self.decision_agent.run(specialist_results)

        return {
            "url": url,
            "agents": {
                "supervisor": {"agent": self.name, "status": "completed"},
                "url_security": security.to_dict(),
                "specialists": [r.to_dict() for r in specialist_results],
                "decision": decision,
            },
        }
