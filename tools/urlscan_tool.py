# import os
# import requests


# def scan_url_with_urlscan(url):
#     api_key = os.getenv("URLSCAN_API_KEY")

#     if not api_key:
#         return {"error": "URLScan API key not found"}

#     headers = {
#         "API-Key": api_key,
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "url": url,
#         "visibility": "unlisted"
#     }

#     try:
#         response = requests.post(
#             "https://urlscan.io/api/v1/scan/",
#             headers=headers,
#             json=payload
#         )

#         if response.status_code not in [200, 201]:
#             return {
#                 "error": f"URLScan API error: {response.status_code}",
#                 "details": response.text
#             }

#         data = response.json()

#         return {
#             "status": "submitted",
#             "uuid": data.get("uuid"),
#             "result_url": data.get("result")
#         }

#     except Exception as e:
#         return {"error": str(e)}
import os
import requests


def lookup_url_with_urlscan(url: str):
    """
    Search for an existing public URLScan result.
    Does not submit the URL for a new scan.
    """

    api_key = os.getenv("URLSCAN_API_KEY")

    # Extract domain from URL
    from urllib.parse import urlparse
    parsed = urlparse(url)
    domain = parsed.netloc

    endpoint = "https://urlscan.io/api/v1/search/"

    headers = {}
    if api_key:
        headers["API-Key"] = api_key

    try:
        response = requests.get(
            endpoint,
            params={"q": f"domain:{domain}"},
            headers=headers,
            timeout=20,
        )

        response.raise_for_status()

        results = response.json().get("results", [])

        if not results:
            return {
                "available": True,
                "found": False
            }

        first = results[0]

        page = first.get("page", {})
        verdicts = first.get("verdicts", {})
        overall = verdicts.get("overall", {})

        return {
            "available": True,
            "found": True,
            "scan_id": first.get("_id"),
            "scan_url": first.get("result"),
            "page_domain": page.get("domain"),
            "page_ip": page.get("ip"),
            "page_country": page.get("country"),
            "page_status": page.get("status"),
            "malicious": overall.get("malicious"),
            "score": overall.get("score"),
        }

    except requests.RequestException as exc:
        return {
            "available": True,
            "error": str(exc)
        }

    except Exception as exc:
        return {
            "available": True,
            "error": str(exc)
        }