# import os
# from urllib.parse import urlparse

# from dotenv import load_dotenv

# from .base import AgentResult

# load_dotenv()


# class URLSecurityAgent:
#     name = "URL Security Agent"

#     def __init__(self):
#         self.vt_key = os.getenv("VIRUSTOTAL_API_KEY")
#         self.urlscan_key = os.getenv("URLSCAN_API_KEY")

#     def _virustotal(self, url: str):
#         if not self.vt_key:
#             return {
#                 "available": False,
#                 "error": "VIRUSTOTAL_API_KEY is not configured.",
#             }

#         from tools.virustotal_tool import lookup_url_with_virustotal

#         return lookup_url_with_virustotal(url)

#     def _urlscan(self, url: str):
#         if not self.urlscan_key:
#             return {
#                 "available": False,
#                 "error": "URLSCAN_API_KEY is not configured.",
#             }

#         from tools.urlscan_tool import lookup_url_with_urlscan

#         return lookup_url_with_urlscan(url)

#     def run(self, url: str) -> AgentResult:
#         parsed = urlparse(url)

#         evidence = {
#             "domain": parsed.netloc,
#             "scheme": parsed.scheme,
#         }

#         try:
#             evidence["virustotal"] = self._virustotal(url)
#         except Exception as exc:
#             evidence["virustotal"] = {
#                 "available": True,
#                 "error": str(exc),
#             }

#         try:
#             evidence["urlscan"] = self._urlscan(url)
#         except Exception as exc:
#             evidence["urlscan"] = {
#                 "available": True,
#                 "error": str(exc),
#             }

#         vt = evidence["virustotal"]
#         us = evidence["urlscan"]

#         score = 0

#         score += min(70, vt.get("malicious", 0) * 10)
#         score += min(20, vt.get("suspicious", 0) * 5)

#         if us.get("malicious") is True:
#             score += 15

#         score = min(100, score)

#         status = (
#             "high"
#             if score >= 70
#             else "medium"
#             if score >= 35
#             else "low"
#         )

#         return AgentResult(
#             self.name,
#             score,
#             status,
#             "Threat-intelligence reputation data collected from VirusTotal and urlscan.io.",
#             evidence,
#         )
import os
from urllib.parse import urlparse

from dotenv import load_dotenv

from .base import AgentResult

load_dotenv()


class URLSecurityAgent:
    name = "URL Security Agent"

    def __init__(self):
        self.vt_key = os.getenv("VIRUSTOTAL_API_KEY")
        self.urlscan_key = os.getenv("URLSCAN_API_KEY")

    def _virustotal(self, url: str):
        if not self.vt_key:
            return {
                "available": False,
                "error": "VIRUSTOTAL_API_KEY is not configured.",
            }

        from tools.virustotal_tool import lookup_url_with_virustotal

        return lookup_url_with_virustotal(url)

    def _urlscan(self, url: str):
        if not self.urlscan_key:
            return {
                "available": False,
                "error": "URLSCAN_API_KEY is not configured.",
            }

        from tools.urlscan_tool import lookup_url_with_urlscan

        return lookup_url_with_urlscan(url)

    def run(self, url: str) -> AgentResult:
        parsed = urlparse(url)

        evidence = {
            "domain": parsed.netloc,
            "scheme": parsed.scheme,
        }

        try:
            evidence["virustotal"] = self._virustotal(url)
        except Exception as exc:
            evidence["virustotal"] = {
                "available": True,
                "error": str(exc),
            }

        try:
            evidence["urlscan"] = self._urlscan(url)
        except Exception as exc:
            evidence["urlscan"] = {
                "available": True,
                "error": str(exc),
            }

        vt = evidence["virustotal"]
        us = evidence["urlscan"]

        vt_pending = vt.get("pending", False)
        vt_scored = vt.get("found", False)  # covers both cached and freshly_scanned results

        score = 0

        if vt_scored:
            score += min(70, vt.get("malicious", 0) * 10)
            score += min(20, vt.get("suspicious", 0) * 5)

        if us.get("malicious") is True:
            score += 15

        score = min(100, score)

        if vt_pending and not vt_scored:
            status = "unknown"
            summary = (
                "VirusTotal had no prior record for this URL, so a fresh scan was "
                "submitted; the result was still processing. Verdict is based on "
                "urlscan.io data only — re-check in a moment for the full VirusTotal result."
            )
        else:
            status = (
                "high"
                if score >= 70
                else "medium"
                if score >= 35
                else "low"
            )
            summary = "Threat-intelligence reputation data collected from VirusTotal and urlscan.io."

        return AgentResult(
            self.name,
            score,
            status,
            summary,
            evidence,
        )