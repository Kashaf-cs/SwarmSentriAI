from .base import BaseAgent


class AIAnalysisAgent(BaseAgent):
    name = "AI Analysis Agent"

    def __init__(self):
        super().__init__(
            name=self.name,
            role=(
                "You are a cybersecurity analysis assistant. "
                "Analyze security evidence carefully and explain "
                "potential URL threats using only the evidence provided. "
                "Do not invent facts or claim that a URL is malicious "
                "without supporting evidence."
            ),
        )

    def run(self, url, security_data, specialist_results, decision):
        prompt = f"""
Analyze the following URL security assessment.

URL:
{url}

Threat Intelligence Evidence:
{security_data}

Specialist Results:
{specialist_results}

Deterministic Security Decision:
{decision}

Provide a concise cybersecurity analysis containing:

1. Overall assessment
2. Main risk indicators
3. Why the current security verdict was reached
4. What a user should do next

Important:
- Use only the evidence provided.
- Do not invent detections.
- Do not override the deterministic security verdict.
- Clearly distinguish evidence from interpretation.
"""

        analysis = self.analyze(prompt)

        return {
            "agent": self.name,
            "analysis": analysis,
        }