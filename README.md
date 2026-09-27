<div align="center">

# 🛡️ SwarmSentri AI

### A Multi-Agent Cybersecurity Threat Intelligence System — *Don't trust one scanner's guess. Trust a swarm.*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge\&logo=flask\&logoColor=white)](https://flask.palletsprojects.com/)
[![VirusTotal](https://img.shields.io/badge/VirusTotal-API-394EFF?style=for-the-badge\&logo=virustotal\&logoColor=white)](https://www.virustotal.com/)
[![urlscan.io](https://img.shields.io/badge/urlscan.io-API-00C7B7?style=for-the-badge\&logoColor=white)](https://urlscan.io/)
[![Pytest](https://img.shields.io/badge/Pytest-0A9EDC?style=for-the-badge\&logo=pytest\&logoColor=white)](https://pytest.org/)

</div>

---

## 📌 Overview

A single malicious link can drain an account, steal credentials, or breach a network — and it can look completely harmless at first glance.

A single scanner can provide a detection count, but it does not always explain **why** a URL may be risky or **how confident** the assessment is.

**SwarmSentri AI** is a multi-agent cybersecurity threat intelligence system built with **Python, Flask, and real-world security APIs**. It analyzes submitted URLs through a coordinated swarm of **7 specialized agents**, combining threat intelligence with phishing, malware, scam, and broader cyber-threat analysis.

The system produces an explainable security assessment with one of three final verdicts:

🟢 **ALLOW** · 🟡 **WARN** · 🔴 **BLOCK**

> A low-risk result does not guarantee that a URL is completely safe. SwarmSentri AI combines multiple available signals to provide a broader security assessment before a user visits a suspicious link.

---

## 🎯 Key Features

* **Multi-Agent Swarm:** 7 coordinated agents work together across the security-analysis pipeline instead of relying on one monolithic check.
* **Real Threat Intelligence:** Live lookups against **VirusTotal** and **urlscan.io**, including reputation data, detection counts, domain information, and scan results.
* **Automatic Fresh Scans:** If VirusTotal has no existing analysis for a submitted URL, SwarmSentri automatically submits it for a fresh scan and polls for the result.
* **Consensus Verdict:** A dedicated **Security Decision Agent** combines specialist assessments into a final **ALLOW**, **WARN**, or **BLOCK** verdict with a confidence estimate.
* **Explainable Reasoning:** Specialist agents provide threat scores together with plain-language reasoning rather than returning only a number.
* **Live Agent Log:** The dashboard displays the agent-to-agent analysis flow and shows what each agent found during the assessment.

---

## 🧩 Agent Swarm

| # | Agent                         | Role                   | What It Checks                                                        |
| - | ----------------------------- | ---------------------- | --------------------------------------------------------------------- |
| 1 | **Supervisor Agent**          | Orchestrator           | Receives the URL and coordinates the analysis pipeline                |
| 2 | **URL Security Agent**        | Threat Intel Gatherer  | VirusTotal + urlscan.io reputation and scan data                      |
| 3 | **Phishing Specialist Agent** | Phishing Analyst       | Suspicious domain patterns, long/obfuscated URLs, phishing indicators |
| 4 | **Malware Specialist Agent**  | Malware Analyst        | Malware-distribution and payload-related indicators                   |
| 5 | **Scam Specialist Agent**     | Fraud Analyst          | Fake shops, fraudulent offers, and scam patterns                      |
| 6 | **Cyber Specialist Agent**    | General Threat Analyst | IP reputation, redirects, ASN, and broader cyber-threat signals       |
| 7 | **Security Decision Agent**   | Consensus Engine       | Aggregates specialist assessments into the final verdict              |

---

## ⚙️ How It Works

```text
User submits URL
      │
      ▼
Supervisor Agent
      │
      ▼
URL Security Agent ──► VirusTotal + urlscan.io
      │
      ▼
┌───────────┬───────────┬───────────┬───────────┐
▼           ▼           ▼           ▼
Phishing    Malware     Scam        Cyber
Specialist  Specialist  Specialist  Specialist
└───────────┴───────────┴───────────┴───────────┘
      │
      ▼
Security Decision Agent
      │
      ▼
Final Verdict + Risk Score + Confidence %
```

### Analysis Pipeline

1. **URL Submission** — The user submits a URL through the SwarmSentri AI dashboard.
2. **Orchestration** — The Supervisor Agent receives the request and coordinates the analysis pipeline.
3. **Threat Intelligence Collection** — The URL Security Agent queries VirusTotal and urlscan.io for available reputation and scan information.
4. **Automatic Fresh Scan** — If VirusTotal has no existing analysis, the system submits the URL for scanning and polls for the result.
5. **Specialist Analysis** — The Phishing, Malware, Scam, and Cyber agents independently evaluate the collected security signals and produce threat assessments.
6. **Security Decision** — The Security Decision Agent combines the specialist assessments into a weighted risk score and confidence estimate.
7. **Final Result** — The dashboard presents the verdict, risk score, confidence, agent reasoning, and analysis log.

---

## 🚩 Red Flags Detected

| Indicator                         | Example                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| 🕓 **Suspicious Domain Patterns** | Unusual domain structure, excessive length, or obfuscation          |
| 🛑 **Known-Bad Reputation**       | Flagged as malicious or suspicious by security vendors              |
| 🎣 **Phishing Patterns**          | URLs attempting to imitate trusted brands or services               |
| 🦠 **Malware Signals**            | Indicators associated with malware distribution or payload delivery |
| 💸 **Scam Patterns**              | Fake storefronts, unrealistic offers, or fraud-style behavior       |
| 🔀 **Redirect Signals**           | Suspicious or unexpected URL redirection behavior                   |
| 🌐 **IP / ASN Signals**           | Risk indicators associated with hosting or network information      |

---

## 🛠️ Tech Stack

* **Language:** Python 3.10+
* **Backend:** Flask
* **Threat Intelligence APIs:** VirusTotal, urlscan.io
* **Agent Architecture:** Custom Python agent classes
* **Frontend:** HTML, CSS, JavaScript, Jinja2
* **Testing:** Pytest
* **Configuration:** python-dotenv
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
SwarmSentriAI/
│
├── .gitignore
├── .env.example
├── app.py
├── requirements.txt
├── README.md
│
├── agents/
│   ├── __init__.py
│   ├── base.py             # Shared agent interface
│   ├── supervisor.py       # Orchestrator agent
│   ├── url_security.py     # VirusTotal + urlscan.io integration
│   ├── specialists.py      # Phishing / Malware / Scam / Cyber agents
│   ├── decision.py         # Security Decision agent
│   └── ai_analysis.py      # LLM-based reasoning layer
│
├── tools/
│   ├── __init__.py
│   ├── virustotal_tool.py  # VirusTotal wrapper
│   └── urlscan_tool.py     # urlscan.io wrapper
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   ├── script.js
└── tests/
    ├── test_agents.py
    ├── test_swarm.py
    ├── test_url_security.py
    ├── test_vt_lookup.py
    └── test_urlscan_lookup.py
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kashaf-cs/SwarmSentriAI.git
cd SwarmSentriAI
```

### 2. Create a Virtual Environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 4. Configure API Keys

Copy `.env.example` to `.env` and add your API keys:

```env
VIRUSTOTAL_API_KEY=your_virustotal_api_key
URLSCAN_API_KEY=your_urlscan_api_key
```

Get API keys from:

* [VirusTotal](https://www.virustotal.com/)
* [urlscan.io](https://urlscan.io/)

> ⚠️ **Never commit your `.env` file or expose your API keys publicly.**

### 5. Run the Application

```bash
python app.py
```

Open your browser at:

```text
http://127.0.0.1:5000
```

### 6. Run Tests

```bash
pytest
```

---

## 📊 Example Result

| Metric         | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| **Verdict**    | 🟢 LOW RISK                                                  |
| **Risk Score** | 2 / 100                                                      |
| **VirusTotal** | Malicious: 0 · Suspicious: 0 · Harmless: 63 · Undetected: 29 |
| **urlscan.io** | HTTP 200 · Not Flagged                                       |

> Example results depend on the URL submitted and the current threat-intelligence data returned by external services.

---

## ⚠️ Notes & Scope

* Verdicts are based on real-time data from VirusTotal and urlscan.io — the system's accuracy reflects the strength of these industry-standard threat-intelligence sources.
* A brand-new domain with no prior scan history may initially show limited reputation data; SwarmSentri automatically triggers a fresh scan in this case to close that gap.
* As with any AI-assisted security tool, specialist agent reasoning is a strong signal, not an absolute guarantee — it's designed to support safer decisions, not replace judgment entirely.
* Free-tier API usage may add a short delay on back-to-back scans due to rate limits.

---

## 🔮 Future Improvements

* [ ] Browser extension for real-time link checking
* [ ] Chatbot / WhatsApp integration for instant URL checks
* [ ] Transformer-based classifiers for specialist analysis
* [ ] Multi-language support
* [ ] Cloud deployment
* [ ] Persistent scan history and reporting
* [ ] User feedback loop for continuous improvement
* [ ] Additional threat-intelligence sources

---

## 🤝 Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss the proposed change.

---

## 📜 License

This project is distributed under the **MIT License**.

---

## 👩‍💻 Connect With Me

<div align="center">

**Kashaf Rasheed** — BS Computer Science, LCWU '28

[![GitHub](https://img.shields.io/badge/GitHub-Kashaf--cs-181717?style=for-the-badge\&logo=github)](https://github.com/Kashaf-cs)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge\&logo=linkedin)](https://www.linkedin.com/in/kashaf-rasheed-694a11416/)

⭐ **If you found this useful, drop a star!**

</div>
