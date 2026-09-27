from .base import AgentResult


class SecurityDecisionAgent:
    name = "Security Decision Agent"

    def run(self, results):
        scores = [r.risk_score for r in results]
        avg = round(sum(scores) / len(scores)) if scores else 0
        max_score = max(scores) if scores else 0

        if max_score >= 75 or avg >= 65:
            verdict = "BLOCK"
            emoji = "🔴"
        elif max_score >= 40 or avg >= 30:
            verdict = "WARN"
            emoji = "🟡"
        else:
            verdict = "ALLOW"
            emoji = "🟢"

        highest = max(results, key=lambda r: r.risk_score) if results else None
        explanation = (
            f"Aggregated specialist risk is {avg}/100. "
            f"Highest specialist score is {max_score}/100 "
            f"({highest.agent if highest else 'N/A'})."
        )

        return {
            "verdict": verdict,
            "emoji": emoji,
            "risk_score": avg,
            "explanation": explanation,
            "thresholds": {
                "BLOCK": "highest specialist score >= 75 OR average >= 65",
                "WARN": "highest specialist score >= 40 OR average >= 30",
                "ALLOW": "otherwise",
            },
        }
