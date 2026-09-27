import os

from dotenv import load_dotenv
from openai import OpenAI


class AgentResult:
    """
    Standard result returned by SwarmSentriAI agents.
    """

    def __init__(self, agent, risk_score, severity, reasoning, evidence=None):
        self.agent = agent
        self.risk_score = risk_score
        self.severity = severity
        self.reasoning = reasoning
        self.evidence = evidence or {}

    def to_dict(self):
        return {
            "agent": self.agent,
            "risk_score": self.risk_score,
            "severity": self.severity,
            "reasoning": self.reasoning,
            "evidence": self.evidence,
        }


class BaseAgent:
    """
    Base class for AI-powered SwarmSentriAI agents.

    Handles:
    - OpenRouter API configuration
    - NVIDIA Nemotron model selection
    - AI requests
    - Common response handling
    """

    MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"

    def __init__(self, name, role):
        self.name = name
        self.role = role

        load_dotenv()

        api_key = os.getenv("OPENROUTER_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENROUTER_API_KEY is missing from the .env file."
            )

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )

    def analyze(self, prompt):
        """
        Send a prompt to NVIDIA Nemotron
        through OpenRouter and return its response.
        """

        response = self.client.chat.completions.create(
            model=self.MODEL,
            messages=[
                {
                    "role": "system",
                    "content": self.role
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=500
        )

        return response.choices[0].message.content