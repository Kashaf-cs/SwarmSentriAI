# from urllib.parse import urlparse
# import re
# from .base import AgentResult


# class BaseSpecialist:
#     name = "Specialist"

#     def run(self, url, security_data):
#         raise NotImplementedError

#     @staticmethod
#     def _vt(security_data):
#         return security_data.get("virustotal", {})

#     @staticmethod
#     def _domain(url):
#         return urlparse(url).netloc.lower()

#     @staticmethod
#     def _path(url):
#         return urlparse(url).path.lower()


# class PhishingSpecialistAgent(BaseSpecialist):
#     name = "Phishing Specialist Agent"

#     def run(self, url, security_data):
#         domain = self._domain(url)
#         path = self._path(url)
#         vt = self._vt(security_data)
#         score = 0
#         reasons = []

#         if "@" in url:
#             score += 25
#             reasons.append("URL contains an @ symbol, which can obscure the real host.")
#         if len(url) > 120:
#             score += 10
#             reasons.append("Unusually long URL.")
#         if re.search(r"(login|verify|secure|account|update|signin|confirm)", path):
#             score += 20
#             reasons.append("Path contains common credential/verification bait terms.")
#         if domain.count(".") >= 3:
#             score += 10
#             reasons.append("Deeply nested subdomain structure.")
#         if vt.get("malicious", 0) > 0 or vt.get("suspicious", 0) > 0:
#             score += 30
#             reasons.append("VirusTotal contains detections associated with the URL.")
#         score = min(100, score)

#         return AgentResult(
#             self.name, score, "high" if score >= 70 else "medium" if score >= 35 else "low",
#             " ".join(reasons) or "No strong phishing indicators found from the available evidence.",
#             {"signals": reasons, "domain": domain},
#         )


# class MalwareSpecialistAgent(BaseSpecialist):
#     name = "Malware Specialist Agent"

#     def run(self, url, security_data):
#         vt = self._vt(security_data)
#         score = min(100, vt.get("malicious", 0) * 12 + vt.get("suspicious", 0) * 4)
#         reasons = []
#         if vt.get("malicious", 0):
#             reasons.append(f"VirusTotal reports {vt['malicious']} malicious detections.")
#         if vt.get("suspicious", 0):
#             reasons.append(f"VirusTotal reports {vt['suspicious']} suspicious detections.")
#         if not reasons:
#             reasons.append("No malware-specific detections were returned by the available reputation lookup.")
#         return AgentResult(
#             self.name, score, "high" if score >= 70 else "medium" if score >= 35 else "low",
#             " ".join(reasons),
#             {"virustotal": vt},
#         )


# class ScamSpecialistAgent(BaseSpecialist):
#     name = "Scam Specialist Agent"

#     def run(self, url, security_data):
#         domain = self._domain(url)
#         path = self._path(url)
#         score = 0
#         reasons = []

#         scam_terms = r"(giveaway|prize|claim|bonus|free-money|crypto|investment|wallet|payment|refund|gift-card)"
#         if re.search(scam_terms, url.lower()):
#             score += 35
#             reasons.append("URL contains terms frequently seen in scam or fraud lures.")
#         if re.search(r"(checkout|payment|billing|invoice)", path):
#             score += 20
#             reasons.append("Payment-related path detected.")
#         if len(domain) > 45:
#             score += 10
#             reasons.append("Long domain name may be harder for users to visually validate.")

#         us = security_data.get("urlscan", {})
#         if us.get("malicious") is True:
#             score += 30
#             reasons.append("urlscan.io's overall verdict marks the observed result as malicious.")

#         score = min(100, score)
#         return AgentResult(
#             self.name, score, "high" if score >= 70 else "medium" if score >= 35 else "low",
#             " ".join(reasons) or "No strong scam-pattern signals found.",
#             {"signals": reasons},
#         )


# class CyberSpecialistAgent(BaseSpecialist):
#     name = "Cyber Specialist Agent"

#     def run(self, url, security_data):
#         parsed = urlparse(url)
#         score = 0
#         reasons = []

#         if parsed.scheme != "https":
#             score += 20
#             reasons.append("URL does not use HTTPS.")
#         if security_data.get("urlscan", {}).get("page_ip"):
#             reasons.append("urlscan.io resolved the observed page to an IP address.")
#         if security_data.get("virustotal", {}).get("final_url") and \
#            security_data["virustotal"]["final_url"] != url:
#             score += 20
#             reasons.append("VirusTotal reports a different final URL, indicating a redirect.")
#         if security_data.get("virustotal", {}).get("malicious", 0):
#             score += 40
#             reasons.append("Threat-intelligence detections indicate cyber risk.")
#         return AgentResult(
#             self.name, min(100, score),
#             "high" if score >= 70 else "medium" if score >= 35 else "low",
#             " ".join(reasons) or "No major general cyber-threat indicators found.",
#             {"signals": reasons},
#         )


# SPECIALISTS = [
#     PhishingSpecialistAgent,
#     MalwareSpecialistAgent,
#     ScamSpecialistAgent,
#     CyberSpecialistAgent,
# ]
from urllib.parse import urlparse

import re

from .base import AgentResult


class BaseSpecialist:
    name = "Specialist"

    def run(self, url, security_data):
        raise NotImplementedError

    @staticmethod
    def _vt(security_data):
        return security_data.get("virustotal", {})

    @staticmethod
    def _domain(url):
        return urlparse(url).netloc.lower()

    @staticmethod
    def _path(url):
        return urlparse(url).path.lower()


class PhishingSpecialistAgent(BaseSpecialist):
    name = "Phishing Specialist Agent"

    def run(self, url, security_data):
        domain = self._domain(url)
        path = self._path(url)
        vt = self._vt(security_data)

        score = 0
        reasons = []

        if "@" in url:
            score += 25
            reasons.append(
                "URL contains an @ symbol, which can obscure the real host."
            )

        if len(url) > 120:
            score += 10
            reasons.append("Unusually long URL.")

        if re.search(
            r"(login|verify|secure|account|update|signin|confirm)",
            path
        ):
            score += 20
            reasons.append(
                "Path contains common credential/verification bait terms."
            )

        if domain.count(".") >= 3:
            score += 10
            reasons.append("Deeply nested subdomain structure.")

        if vt.get("malicious", 0) > 0 or vt.get("suspicious", 0) > 0:
            score += 30
            reasons.append(
                "VirusTotal contains detections associated with the URL."
            )

        score = min(100, score)

        return AgentResult(
            self.name,
            score,
            "high" if score >= 70 else "medium" if score >= 35 else "low",
            " ".join(reasons)
            or "No strong phishing indicators found from the available evidence.",
            {
                "signals": reasons,
                "domain": domain
            },
        )


class MalwareSpecialistAgent(BaseSpecialist):
    name = "Malware Specialist Agent"

    def run(self, url, security_data):
        vt = self._vt(security_data)

        score = min(
            100,
            vt.get("malicious", 0) * 12
            + vt.get("suspicious", 0) * 4
        )

        reasons = []

        if vt.get("malicious", 0):
            reasons.append(
                f"VirusTotal reports {vt['malicious']} malicious detections."
            )

        if vt.get("suspicious", 0):
            reasons.append(
                f"VirusTotal reports {vt['suspicious']} suspicious detections."
            )

        if not reasons:
            reasons.append(
                "No malware-specific detections were returned by the "
                "available reputation lookup."
            )

        return AgentResult(
            self.name,
            score,
            "high" if score >= 70 else "medium" if score >= 35 else "low",
            " ".join(reasons),
            {
                "virustotal": vt
            },
        )


class ScamSpecialistAgent(BaseSpecialist):
    name = "Scam Specialist Agent"

    def run(self, url, security_data):
        domain = self._domain(url)
        path = self._path(url)

        score = 0
        reasons = []

        scam_terms = (
            r"(giveaway|prize|claim|bonus|free-money|crypto|"
            r"investment|wallet|payment|refund|gift-card)"
        )

        if re.search(scam_terms, url.lower()):
            score += 35
            reasons.append(
                "URL contains terms frequently seen in scam or fraud lures."
            )

        if re.search(
            r"(checkout|payment|billing|invoice)",
            path
        ):
            score += 20
            reasons.append("Payment-related path detected.")

        if len(domain) > 45:
            score += 10
            reasons.append(
                "Long domain name may be harder for users to visually validate."
            )

        us = security_data.get("urlscan", {})

        if us.get("malicious") is True:
            score += 30
            reasons.append(
                "urlscan.io's overall verdict marks the observed result as malicious."
            )

        score = min(100, score)

        return AgentResult(
            self.name,
            score,
            "high" if score >= 70 else "medium" if score >= 35 else "low",
            " ".join(reasons)
            or "No strong scam-pattern signals found.",
            {
                "signals": reasons
            },
        )


class CyberSpecialistAgent(BaseSpecialist):
    name = "Cyber Specialist Agent"

    def run(self, url, security_data):
        parsed = urlparse(url)

        score = 0
        reasons = []

        # HTTPS check
        if parsed.scheme != "https":
            score += 20
            reasons.append("URL does not use HTTPS.")

        # IP resolution information
        if security_data.get("urlscan", {}).get("page_ip"):
            reasons.append(
                "urlscan.io resolved the observed page to an IP address."
            )

        # Redirect detection
        final_url = security_data.get(
            "virustotal", {}
        ).get("final_url")

        if final_url:
            original = url.rstrip("/")
            final = final_url.rstrip("/")

            if final != original:
                score += 20
                reasons.append(
                    "VirusTotal reports a different final URL, "
                    "indicating a redirect."
                )

        # VirusTotal malicious detections
        if security_data.get("virustotal", {}).get("malicious", 0):
            score += 40
            reasons.append(
                "Threat-intelligence detections indicate cyber risk."
            )

        return AgentResult(
            self.name,
            min(100, score),
            "high" if score >= 70 else "medium" if score >= 35 else "low",
            " ".join(reasons)
            or "No major general cyber-threat indicators found.",
            {
                "signals": reasons
            },
        )


SPECIALISTS = [
    PhishingSpecialistAgent,
    MalwareSpecialistAgent,
    ScamSpecialistAgent,
    CyberSpecialistAgent,
]
