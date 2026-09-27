# import os
# import requests


# def scan_url_with_virustotal(url):
#     api_key = os.getenv("VIRUSTOTAL_API_KEY")

#     if not api_key:
#         return {"error": "VirusTotal API key not found"}

#     headers = {
#         "x-apikey": api_key
#     }

#     try:
#         response = requests.post(
#             "https://www.virustotal.com/api/v3/urls",
#             headers=headers,
#             data={"url": url}
#         )

#         if response.status_code != 200:
#             return {
#                 "error": f"VirusTotal API error: {response.status_code}",
#                 "details": response.text
#             }

#         data = response.json()

#         return {
#             "status": "submitted",
#             "analysis_id": data["data"]["id"]
#         }

#     except Exception as e:
#         return {"error": str(e)}
# import base64
# import os

# import requests


# def _vt_url_id(url: str) -> str:
#     """
#     Convert a URL into the ID format used by VirusTotal.
#     """
#     return base64.urlsafe_b64encode(url.encode()).decode().strip("=")


# def lookup_url_with_virustotal(url: str):
#     """
#     Look up an existing URL analysis in VirusTotal.
#     """

#     api_key = os.getenv("VIRUSTOTAL_API_KEY")

#     if not api_key:
#         return {
#             "available": False,
#             "error": "VIRUSTOTAL_API_KEY is not configured.",
#         }

#     endpoint = (
#         f"https://www.virustotal.com/api/v3/urls/"
#         f"{_vt_url_id(url)}"
#     )

#     headers = {
#         "x-apikey": api_key
#     }

#     try:
#         response = requests.get(
#             endpoint,
#             headers=headers,
#             timeout=20,
#         )

#         if response.status_code == 404:
#             return {
#                 "available": True,
#                 "found": False,
#             }

#         response.raise_for_status()

#         data = response.json().get("data", {})
#         attributes = data.get("attributes", {})

#         stats = attributes.get(
#             "last_analysis_stats",
#             {}
#         ) or {}

#         return {
#             "available": True,
#             "found": True,
#             "malicious": stats.get("malicious", 0),
#             "suspicious": stats.get("suspicious", 0),
#             "harmless": stats.get("harmless", 0),
#             "undetected": stats.get("undetected", 0),
#             "reputation": attributes.get("reputation"),
#             "final_url": attributes.get("last_final_url"),
#             "categories": attributes.get("categories", {}),
#         }

#     except requests.RequestException as exc:
#         return {
#             "available": True,
#             "error": str(exc),
#         }

#     except Exception as exc:
#         return {
#             "available": True,
#             "error": str(exc),
#         }
import base64
import os
import time

import requests


def _vt_url_id(url: str) -> str:
    return base64.urlsafe_b64encode(url.encode()).decode().strip("=")


def _parse_vt_data(data: dict) -> dict:
    attributes = data.get("attributes", {})
    stats = attributes.get("last_analysis_stats", {}) or {}
    return {
        "available": True,
        "found": True,
        "malicious": stats.get("malicious", 0),
        "suspicious": stats.get("suspicious", 0),
        "harmless": stats.get("harmless", 0),
        "undetected": stats.get("undetected", 0),
        "reputation": attributes.get("reputation"),
        "final_url": attributes.get("last_final_url"),
        "categories": attributes.get("categories", {}),
    }


def lookup_url_with_virustotal(url: str, auto_submit: bool = True):
    """
    Look up a URL in VirusTotal. If no prior scan exists and
    auto_submit is True, submit it for a fresh scan and poll
    briefly for the result — so every URL, scanned before or not,
    ends up with a real result.
    """
    api_key = os.getenv("VIRUSTOTAL_API_KEY")

    if not api_key:
        return {"available": False, "error": "VIRUSTOTAL_API_KEY is not configured."}

    headers = {"x-apikey": api_key}
    endpoint = f"https://www.virustotal.com/api/v3/urls/{_vt_url_id(url)}"

    try:
        response = requests.get(endpoint, headers=headers, timeout=20)

        if response.status_code == 200:
            return _parse_vt_data(response.json().get("data", {}))

        if response.status_code == 404 and auto_submit:
            return _submit_and_poll(url, headers)

        if response.status_code == 404:
            return {"available": True, "found": False}

        response.raise_for_status()

    except requests.RequestException as exc:
        return {"available": True, "error": str(exc)}
    except Exception as exc:
        return {"available": True, "error": str(exc)}


def _submit_and_poll(url: str, headers: dict, max_wait_seconds: int = 15):
    try:
        submit_resp = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url},
            timeout=20,
        )
        submit_resp.raise_for_status()
        analysis_id = submit_resp.json()["data"]["id"]

        analysis_endpoint = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"

        waited = 0
        interval = 3
        while waited < max_wait_seconds:
            time.sleep(interval)
            waited += interval

            poll_resp = requests.get(analysis_endpoint, headers=headers, timeout=20)
            poll_resp.raise_for_status()
            poll_data = poll_resp.json()["data"]["attributes"]

            if poll_data.get("status") == "completed":
                stats = poll_data.get("stats", {})
                return {
                    "available": True,
                    "found": True,
                    "freshly_scanned": True,
                    "malicious": stats.get("malicious", 0),
                    "suspicious": stats.get("suspicious", 0),
                    "harmless": stats.get("harmless", 0),
                    "undetected": stats.get("undetected", 0),
                }

        return {
            "available": True,
            "found": False,
            "pending": True,
            "message": "URL submitted to VirusTotal; scan still in progress.",
        }

    except requests.RequestException as exc:
        return {"available": True, "error": str(exc)}