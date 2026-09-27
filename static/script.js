/* =========================================================
   SWARMSENTRIAI
   COMPLETE FRONTEND JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("SwarmSentriAI JavaScript loaded.");

    /* =====================================================
       1. BASIC ELEMENTS
    ===================================================== */

    const primaryButtons = document.querySelectorAll(".primary-button");

    const urlInput =
        document.querySelector(".ciby-input input") ||
        document.getElementById("url") ||
        document.getElementById("target-url-input");

    const analyzeButton =
        document.querySelector(".ciby-input button") ||
        document.getElementById("scanBtn") ||
        document.getElementById("scan-btn");

    const faqItems =
        document.querySelectorAll(".faq-container details");

    const feedbackForm =
        document.querySelector(".feedback-form");


    /* =====================================================
       2. GLOBAL SCAN DATA

       Last successful scan yahan store hoga.
       Report isi data ko use karegi.
    ===================================================== */

    let lastScanData = null;


    /* =====================================================
       3. HELPER FUNCTIONS
    ===================================================== */

    const wait = (milliseconds) => {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    };


    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function showMessage(message) {
        alert(message);
    }


    /* =====================================================
       4. HERO BUTTONS
    ===================================================== */

    primaryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const swarmSection =
                document.querySelector("#swarm");

            if (swarmSection) {

                swarmSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            if (urlInput) {
                setTimeout(() => {
                    urlInput.focus();
                }, 600);
            }

        });

    });


    /* =====================================================
       5. HEADER DOCS → REPORT

       Existing HTML:
       <a href="#docs">Docs</a>

       Hum isko Report bana rahe hain.
    ===================================================== */

    const docsLinks =
        document.querySelectorAll('a[href="#docs"]');

    docsLinks.forEach(link => {

        link.textContent = "Report";

        link.addEventListener("click", event => {

            event.preventDefault();

            createReportSection();

            const reportSection =
                document.getElementById("docs");

            if (reportSection) {

                reportSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       6. CREATE REPORT SECTION
    ===================================================== */

    function createReportSection() {

        if (document.getElementById("docs")) {
            return;
        }


        const reportSection =
            document.createElement("section");

        reportSection.id = "docs";

        reportSection.className = "report-section";


        reportSection.innerHTML = `

            <div class="report-container">

                <p class="badge">
                    ● SECURITY REPORT
                </p>

                <h2>
                    Scan Report
                </h2>

                <p class="report-intro">
                    Review your latest SwarmSentriAI
                    security analysis and download
                    the report.
                </p>


                <div id="reportContent">

                    <div class="report-empty">

                        <h3>
                            No scan report yet
                        </h3>

                        <p>
                            Run a URL security scan first.
                            Your report will appear here.
                        </p>

                        <button
                            type="button"
                            class="primary-button"
                            id="reportScanButton"
                        >
                            Launch Security Scan →
                        </button>

                    </div>

                </div>

            </div>

        `;


        const main =
            document.querySelector("main");

        if (main) {

            main.appendChild(reportSection);

        }


        const reportScanButton =
            document.getElementById("reportScanButton");

        if (reportScanButton) {

            reportScanButton.addEventListener(
                "click",
                () => {

                    const swarmSection =
                        document.querySelector("#swarm");

                    if (swarmSection) {

                        swarmSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                    if (urlInput) {
                        urlInput.focus();
                    }

                }
            );

        }

    }


    /* =====================================================
       7. OLD SCANNER ELEMENTS
    ===================================================== */

    const scanBtn =
        document.getElementById("scanBtn") ||
        document.getElementById("scan-btn") ||
        analyzeButton;

    const statusEl =
        document.getElementById("scanStatus");

    const result =
        document.getElementById("result");

    const verdict =
        document.getElementById("verdict");

    const explanation =
        document.getElementById("explanation");

    const riskNumber =
        document.getElementById("riskNumber");

    const riskBar =
        document.getElementById("riskBar");

    const riskLevel =
        document.getElementById("riskLevel");

    const scannedUrl =
        document.getElementById("scannedUrl");

    const resultTime =
        document.getElementById("resultTime");

    const specialistResults =
        document.getElementById("specialistResults");

    const vtStats =
        document.getElementById("vtStats");

    const urlscanStats =
        document.getElementById("urlscanStats");

    const canvas =
        document.getElementById("swarmCanvas");


    /* =====================================================
       8. STATUS
    ===================================================== */

    function setStatus(text) {

        if (statusEl) {
            statusEl.textContent = text;
        }

    }


    /* =====================================================
       9. AGENT UI
    ===================================================== */

    function setAgent(name, state) {

        const card =
            document.querySelector(
                `.agent-card[data-agent="${name}"]`
            );

        if (!card) {
            return;
        }


        const stateElement =
            card.querySelector(".agent-state");


        if (state === "active") {

            card.classList.add("active");
            card.classList.remove("done");

            if (stateElement) {
                stateElement.textContent = "ANALYZING";
            }

        }


        if (state === "done") {

            card.classList.remove("active");
            card.classList.add("done");

            if (stateElement) {
                stateElement.textContent = "COMPLETE";
            }

        }

    }


    function resetAgents() {

        document
            .querySelectorAll(".agent-card")
            .forEach(card => {

                card.classList.remove(
                    "active",
                    "done"
                );


                const state =
                    card.querySelector(".agent-state");


                if (state) {
                    state.textContent = "STANDBY";
                }

            });

    }


    /* =====================================================
       10. CANVAS SECURITY SWARM
    ===================================================== */

    let activeAgent = null;

    let canvasAgents = [];


    if (canvas) {

        const ctx =
            canvas.getContext("2d");


        function resizeCanvas() {

            const rect =
                canvas.getBoundingClientRect();

            const dpr =
                window.devicePixelRatio || 1;


            canvas.width =
                rect.width * dpr;

            canvas.height =
                rect.height * dpr;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

        }


        function setupAgents() {

            canvasAgents = [

                {
                    id: "supervisor",
                    label: "SUPERVISOR",
                    x: 0.50,
                    y: 0.50,
                    color: "#10b981"
                },

                {
                    id: "url_security",
                    label: "URL SECURITY",
                    x: 0.18,
                    y: 0.25,
                    color: "#22d3ee"
                },

                {
                    id: "phishing",
                    label: "PHISHING",
                    x: 0.82,
                    y: 0.25,
                    color: "#ef4444"
                },

                {
                    id: "malware",
                    label: "MALWARE",
                    x: 0.17,
                    y: 0.76,
                    color: "#f59e0b"
                },

                {
                    id: "scam",
                    label: "SCAM",
                    x: 0.83,
                    y: 0.76,
                    color: "#a78bfa"
                },

                {
                    id: "cyber",
                    label: "CYBER",
                    x: 0.50,
                    y: 0.12,
                    color: "#06b6d4"
                },

                {
                    id: "decision",
                    label: "DECISION",
                    x: 0.50,
                    y: 0.88,
                    color: "#34d399"
                }

            ];

        }


        resizeCanvas();

        setupAgents();


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        let tick = 0;


        function drawGrid(
            context,
            width,
            height
        ) {

            context.strokeStyle =
                "rgba(16,185,129,0.035)";

            context.lineWidth = 1;


            const size = 35;


            for (
                let x = 0;
                x < width;
                x += size
            ) {

                context.beginPath();

                context.moveTo(x, 0);

                context.lineTo(x, height);

                context.stroke();

            }


            for (
                let y = 0;
                y < height;
                y += size
            ) {

                context.beginPath();

                context.moveTo(0, y);

                context.lineTo(width, y);

                context.stroke();

            }

        }


        function drawConnection(
            context,
            center,
            target,
            width,
            height
        ) {

            const x1 =
                center.x * width;

            const y1 =
                center.y * height;

            const x2 =
                target.x * width;

            const y2 =
                target.y * height;


            const active =
                activeAgent === target.id;


            context.beginPath();

            context.moveTo(x1, y1);

            context.lineTo(x2, y2);


            context.strokeStyle =
                active
                    ? "rgba(52,211,153,0.7)"
                    : "rgba(16,185,129,0.12)";


            context.lineWidth =
                active ? 2 : 1;


            context.stroke();


            if (active) {

                const progress =
                    (Math.sin(tick * 0.08) + 1) / 2;


                const px =
                    x1 + (x2 - x1) * progress;

                const py =
                    y1 + (y2 - y1) * progress;


                context.beginPath();

                context.arc(
                    px,
                    py,
                    3,
                    0,
                    Math.PI * 2
                );


                context.fillStyle =
                    "#34d399";

                context.shadowBlur = 12;

                context.shadowColor =
                    "#34d399";

                context.fill();

                context.shadowBlur = 0;

            }

        }


        function drawAgent(
            context,
            agent,
            width,
            height,
            index
        ) {

            const x =
                agent.x * width;

            const y =
                agent.y * height;


            const active =
                activeAgent === agent.id;


            const radius =
                active
                    ? 18 +
                      Math.sin(
                          tick * 0.09 + index
                      ) * 2
                    : 11;


            context.beginPath();

            context.arc(
                x,
                y,
                radius + 9,
                0,
                Math.PI * 2
            );


            context.fillStyle =
                active
                    ? agent.color + "18"
                    : agent.color + "08";

            context.fill();


            context.beginPath();

            context.arc(
                x,
                y,
                active ? 9 : 6,
                0,
                Math.PI * 2
            );


            context.fillStyle =
                agent.color;

            context.shadowBlur =
                active ? 18 : 8;

            context.shadowColor =
                agent.color;

            context.fill();

            context.shadowBlur = 0;


            context.fillStyle =
                "#64736c";

            context.font =
                "8px monospace";

            context.textAlign =
                "center";

            context.fillText(
                agent.label,
                x,
                y + 24
            );

        }


        function renderCanvas() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            drawGrid(
                ctx,
                width,
                height
            );


            const center =
                canvasAgents[0];


            canvasAgents
                .slice(1)
                .forEach(agent => {

                    drawConnection(
                        ctx,
                        center,
                        agent,
                        width,
                        height
                    );

                });


            canvasAgents.forEach(
                (agent, index) => {

                    drawAgent(
                        ctx,
                        agent,
                        width,
                        height,
                        index
                    );

                }
            );


            tick++;


            requestAnimationFrame(
                renderCanvas
            );

        }


        renderCanvas();

    }


    /* =====================================================
       11. PIPELINE ANIMATION
    ===================================================== */

    async function animatePipeline() {

        const sequence = [

            "supervisor",
            "url_security",
            "phishing",
            "malware",
            "scam",
            "cyber",
            "decision"

        ];


        for (const agent of sequence) {

            activeAgent = agent;

            setAgent(
                agent,
                "active"
            );


            await wait(450);


            setAgent(
                agent,
                "done"
            );

        }


        activeAgent = null;

    }


    /* =====================================================
       12. PRESET BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".preset-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!urlInput) {
                        return;
                    }


                    urlInput.value =
                        button.textContent.trim();


                    urlInput.focus();

                }
            );

        });


    /* =====================================================
       13. SPECIALIST RESULTS
    ===================================================== */

    function renderSpecialists(
        specialists
    ) {

        if (!specialistResults) {
            return;
        }


        if (
            !specialists ||
            !specialists.length
        ) {

            specialistResults.innerHTML = `
                <div class="specialist-card">
                    No specialist results returned.
                </div>
            `;

            return;

        }


        specialistResults.innerHTML =
            specialists.map(s => {

                const score =
                    Number(
                        s.risk_score ?? 0
                    );


                const severity =
                    String(
                        s.severity || "low"
                    ).toUpperCase();


                return `

                    <div class="specialist-card">

                        <div class="specialist-top">

                            <div class="specialist-name">
                                ${escapeHTML(
                                    s.agent
                                )}
                            </div>

                            <div class="specialist-score">
                                ${score}/100
                            </div>

                        </div>


                        <div class="mini-risk">

                            <div
                                style="
                                    width:${Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            score
                                        )
                                    )}%;
                                "
                            ></div>

                        </div>


                        <div class="specialist-severity">

                            ${escapeHTML(
                                severity
                            )}

                        </div>


                        <div class="specialist-reason">

                            ${escapeHTML(
                                s.reasoning ||
                                "No reasoning returned."
                            )}

                        </div>

                    </div>

                `;

            }).join("");

    }


    /* =====================================================
       14. VIRUSTOTAL
    ===================================================== */

    function renderVirusTotal(evidence) {

        if (!vtStats) {
            return;
        }


        const vt =
            evidence?.virustotal || {};


        if (!vt.available) {

            vtStats.innerHTML = `
                <div class="stat-row">

                    <strong>Status</strong>

                    <span>
                        Unavailable
                    </span>

                </div>
            `;

            return;

        }


        if (!vt.found) {

            vtStats.innerHTML = `
                <div class="stat-row">

                    <strong>Result</strong>

                    <span>
                        Not found
                    </span>

                </div>
            `;

            return;

        }


        vtStats.innerHTML = `

            <div class="stat-row">

                <strong>
                    Malicious
                </strong>

                <span class="${
                    Number(vt.malicious || 0) > 0
                        ? "stat-danger"
                        : "stat-safe"
                }">

                    ${vt.malicious ?? 0}

                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Suspicious
                </strong>

                <span>
                    ${vt.suspicious ?? 0}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Harmless
                </strong>

                <span class="stat-safe">
                    ${vt.harmless ?? 0}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Undetected
                </strong>

                <span>
                    ${vt.undetected ?? 0}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Reputation
                </strong>

                <span>
                    ${vt.reputation ?? "N/A"}
                </span>

            </div>

        `;

    }


    /* =====================================================
       15. URLSCAN
    ===================================================== */

    function renderURLScan(evidence) {

        if (!urlscanStats) {
            return;
        }


        const us =
            evidence?.urlscan || {};


        if (!us.available) {

            urlscanStats.innerHTML = `
                <div class="stat-row">

                    <strong>
                        Status
                    </strong>

                    <span>
                        Unavailable
                    </span>

                </div>
            `;

            return;

        }


        if (!us.found) {

            urlscanStats.innerHTML = `
                <div class="stat-row">

                    <strong>
                        Result
                    </strong>

                    <span>
                        No existing result
                    </span>

                </div>
            `;

            return;

        }


        urlscanStats.innerHTML = `

            <div class="stat-row">

                <strong>
                    Domain
                </strong>

                <span>
                    ${escapeHTML(
                        us.page_domain || "N/A"
                    )}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    IP Address
                </strong>

                <span>
                    ${escapeHTML(
                        us.page_ip || "N/A"
                    )}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    HTTP Status
                </strong>

                <span>
                    ${escapeHTML(
                        us.page_status || "N/A"
                    )}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Country
                </strong>

                <span>
                    ${escapeHTML(
                        us.page_country || "N/A"
                    )}
                </span>

            </div>


            <div class="stat-row">

                <strong>
                    Verdict
                </strong>

                <span class="${
                    us.malicious === true
                        ? "stat-danger"
                        : "stat-safe"
                }">

                    ${
                        us.malicious === true
                            ? "MALICIOUS"
                            : "NOT FLAGGED"
                    }

                </span>

            </div>

        `;

    }


    /* =====================================================
       16. RISK SCORE
    ===================================================== */

    function renderRisk(score) {

        score =
            Number(score ?? 0);


        if (riskNumber) {

            riskNumber.textContent =
                score;

        }


        if (riskBar) {

            riskBar.style.width =
                `${Math.min(
                    100,
                    Math.max(
                        0,
                        score
                    )
                )}%`;

        }


        if (!riskLevel) {
            return;
        }


        if (score >= 70) {

            riskLevel.textContent =
                "HIGH RISK";

            riskLevel.style.color =
                "#ef4444";


            if (riskBar) {

                riskBar.style.background =
                    "#ef4444";

            }

        }

        else if (score >= 35) {

            riskLevel.textContent =
                "MEDIUM RISK";

            riskLevel.style.color =
                "#f59e0b";


            if (riskBar) {

                riskBar.style.background =
                    "#f59e0b";

            }

        }

        else {

            riskLevel.textContent =
                "LOW RISK";

            riskLevel.style.color =
                "#22c55e";


            if (riskBar) {

                riskBar.style.background =
                    "#22c55e";

            }

        }

    }


    /* =====================================================
       17. CREATE REPORT HTML
    ===================================================== */

    function renderReport(data) {

        createReportSection();


        const reportContent =
            document.getElementById(
                "reportContent"
            );


        if (!reportContent) {
            return;
        }


        const decision =
            data.agents?.decision || {};


        const security =
            data.agents?.url_security || {};


        const specialists =
            data.agents?.specialists || [];


        const risk =
            Number(
                decision.risk_score ?? 0
            );


        const reportURL =
            data.url || "";


        const reportVerdict =
            String(
                decision.verdict ||
                "UNKNOWN"
            ).toUpperCase();


        const scanTime =
            new Date().toLocaleString();


        const specialistsHTML =
            specialists.length

                ? specialists.map(agent => `

                    <div class="report-specialist">

                        <strong>
                            ${escapeHTML(
                                agent.agent ||
                                "Agent"
                            )}
                        </strong>

                        <span>
                            Risk:
                            ${Number(
                                agent.risk_score ?? 0
                            )}/100
                        </span>

                        <p>
                            ${escapeHTML(
                                agent.reasoning ||
                                "No reasoning returned."
                            )}
                        </p>

                    </div>

                `).join("")

                : `
                    <p>
                        No specialist results returned.
                    </p>
                `;


        const vt =
            security.evidence?.virustotal || {};


        const us =
            security.evidence?.urlscan || {};


        reportContent.innerHTML = `

            <div class="report-card">

                <div class="report-header">

                    <div>

                        <p class="badge">
                            ● SWARMSENTRIAI REPORT
                        </p>

                        <h3>
                            Security Analysis Report
                        </h3>

                    </div>

                    <div class="report-date">
                        ${scanTime}
                    </div>

                </div>


                <div class="report-summary">

                    <div class="report-item">

                        <span>
                            Scanned URL
                        </span>

                        <strong>
                            ${escapeHTML(
                                reportURL
                            )}
                        </strong>

                    </div>


                    <div class="report-item">

                        <span>
                            Verdict
                        </span>

                        <strong>
                            ${escapeHTML(
                                reportVerdict
                            )}
                        </strong>

                    </div>


                    <div class="report-item">

                        <span>
                            Risk Score
                        </span>

                        <strong>
                            ${risk}/100
                        </strong>

                    </div>

                </div>


                <div class="report-block">

                    <h4>
                        Security Explanation
                    </h4>

                    <p>
                        ${escapeHTML(
                            decision.explanation ||
                            "No explanation returned."
                        )}
                    </p>

                </div>


                <div class="report-block">

                    <h4>
                        Specialist Analysis
                    </h4>

                    ${specialistsHTML}

                </div>


                <div class="report-block">

                    <h4>
                        VirusTotal
                    </h4>

                    <p>
                        Malicious:
                        ${vt.malicious ?? "N/A"}
                    </p>

                    <p>
                        Suspicious:
                        ${vt.suspicious ?? "N/A"}
                    </p>

                    <p>
                        Harmless:
                        ${vt.harmless ?? "N/A"}
                    </p>

                    <p>
                        Reputation:
                        ${vt.reputation ?? "N/A"}
                    </p>

                </div>


                <div class="report-block">

                    <h4>
                        URLScan
                    </h4>

                    <p>
                        Domain:
                        ${escapeHTML(
                            us.page_domain ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        IP:
                        ${escapeHTML(
                            us.page_ip ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        HTTP Status:
                        ${escapeHTML(
                            us.page_status ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        Country:
                        ${escapeHTML(
                            us.page_country ||
                            "N/A"
                        )}
                    </p>

                </div>


                <div class="report-actions">

                    <button
                        type="button"
                        class="primary-button"
                        id="downloadReportButton"
                    >
                        Download Report ↓
                    </button>

                </div>

            </div>

        `;


        const downloadButton =
            document.getElementById(
                "downloadReportButton"
            );


        if (downloadButton) {

            downloadButton.addEventListener(
                "click",
                downloadReport
            );

        }

    }


    /* =====================================================
       18. DOWNLOAD REPORT

       Browser TXT report.
       No backend required.
    ===================================================== */

    function downloadReport() {

        if (!lastScanData) {

            showMessage(
                "Please run a security scan first."
            );

            return;

        }


        const data =
            lastScanData;


        const decision =
            data.agents?.decision || {};


        const security =
            data.agents?.url_security || {};


        const specialists =
            data.agents?.specialists || [];


        const vt =
            security.evidence?.virustotal || {};


        const us =
            security.evidence?.urlscan || {};


        let report = "";


        report +=
            "========================================\n";

        report +=
            "        SWARMSENTRIAI SECURITY REPORT\n";

        report +=
            "========================================\n\n";


        report +=
            `Generated: ${new Date().toLocaleString()}\n\n`;


        report +=
            "SCAN INFORMATION\n";

        report +=
            "----------------------------------------\n";

        report +=
            `URL: ${data.url || "N/A"}\n`;

        report +=
            `Verdict: ${
                decision.verdict || "N/A"
            }\n`;

        report +=
            `Risk Score: ${
                decision.risk_score ?? "N/A"
            }/100\n\n`;


        report +=
            "EXPLANATION\n";

        report +=
            "----------------------------------------\n";

        report +=
            `${
                decision.explanation ||
                "No explanation returned."
            }\n\n`;


        report +=
            "SPECIALIST RESULTS\n";

        report +=
            "----------------------------------------\n";


        specialists.forEach(agent => {

            report +=
                `Agent: ${
                    agent.agent || "N/A"
                }\n`;

            report +=
                `Risk Score: ${
                    agent.risk_score ?? "N/A"
                }/100\n`;

            report +=
                `Severity: ${
                    agent.severity || "N/A"
                }\n`;

            report +=
                `Reasoning: ${
                    agent.reasoning ||
                    "N/A"
                }\n\n`;

        });


        report +=
            "VIRUSTOTAL\n";

        report +=
            "----------------------------------------\n";

        report +=
            `Malicious: ${
                vt.malicious ?? "N/A"
            }\n`;

        report +=
            `Suspicious: ${
                vt.suspicious ?? "N/A"
            }\n`;

        report +=
            `Harmless: ${
                vt.harmless ?? "N/A"
            }\n`;

        report +=
            `Undetected: ${
                vt.undetected ?? "N/A"
            }\n`;

        report +=
            `Reputation: ${
                vt.reputation ?? "N/A"
            }\n\n`;


        report +=
            "URLSCAN\n";

        report +=
            "----------------------------------------\n";

        report +=
            `Domain: ${
                us.page_domain || "N/A"
            }\n`;

        report +=
            `IP Address: ${
                us.page_ip || "N/A"
            }\n`;

        report +=
            `HTTP Status: ${
                us.page_status || "N/A"
            }\n`;

        report +=
            `Country: ${
                us.page_country || "N/A"
            }\n`;

        report +=
            `Malicious: ${
                us.malicious ?? "N/A"
            }\n\n`;


        report +=
            "========================================\n";

        report +=
            "          END OF REPORT\n";

        report +=
            "========================================\n";


        const blob =
            new Blob(
                [report],
                {
                    type: "text/plain;charset=utf-8"
                }
            );


        const downloadURL =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            downloadURL;


        link.download =
            "SwarmSentriAI-Security-Report.txt";


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(
            downloadURL
        );

    }


    /* =====================================================
       19. SCAN FUNCTION
    ===================================================== */

    async function runScan() {

        if (!urlInput) {

            showMessage(
                "URL input not found."
            );

            return;

        }


        const url =
            urlInput.value.trim();


        if (!url) {

            urlInput.focus();

            showMessage(
                "Please enter a URL first."
            );

            return;

        }


        /* Validate URL */

        try {

            new URL(url);

        }

        catch {

            showMessage(
                "Please enter a valid URL.\n\nExample:\nhttps://example.com"
            );

            return;

        }


        /* Reset */

        resetAgents();

        activeAgent = null;


        if (result) {

            result.classList.add(
                "hidden"
            );

        }


        if (scanBtn) {

            scanBtn.disabled = true;

            scanBtn.innerHTML =
                "SCANNING...";

        }


        setStatus(
            "SWARM ACTIVE..."
        );


        /* Start animation */

        const animation =
            animatePipeline();


        try {

            /* Backend API */

            const response =
                await fetch(
                    "/api/scan",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            url: url
                        })

                    }
                );


            const data =
                await response.json();


            await animation;


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Scan failed."
                );

            }


            /* Save scan */

            lastScanData = data;


            /* Decision */

            const decision =
                data.agents?.decision || {};


            const verdictText =
                String(
                    decision.verdict ||
                    "ALLOW"
                ).toUpperCase();


            if (verdict) {

                verdict.textContent =
                    `${decision.emoji || "🛡️"} ${verdictText}`;

                verdict.className =
                    `verdict ${verdictText.toLowerCase()}`;

            }


            if (explanation) {

                explanation.textContent =
                    decision.explanation ||
                    "No diagnostic explanation returned.";

            }


            /* Risk */

            renderRisk(
                decision.risk_score
            );


            /* URL */

            if (scannedUrl) {

                scannedUrl.textContent =
                    data.url || url;

            }


            /* Time */

            if (resultTime) {

                resultTime.textContent =
                    new Date().toLocaleTimeString();

            }


            /* Specialists */

            renderSpecialists(
                data.agents?.specialists || []
            );


            /* Threat intelligence */

            const security =
                data.agents?.url_security ||
                {};


            renderVirusTotal(
                security.evidence
            );


            renderURLScan(
                security.evidence
            );


            /* Show result */

            if (result) {

                result.classList.remove(
                    "hidden"
                );


                result.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /* Create/update report */

            renderReport(
                data
            );


            setStatus(
                "SCAN COMPLETE"
            );


            console.log(
                "Scan completed:",
                data
            );

        }

        catch (error) {

            activeAgent = null;

            setStatus(
                "SCAN ERROR"
            );


            console.error(
                "Scan error:",
                error
            );


            showMessage(
                error.message ||
                "Something went wrong."
            );

        }

        finally {

            if (scanBtn) {

                scanBtn.disabled =
                    false;

                scanBtn.innerHTML =
                    "SCAN URL";

            }

        }

    }


    /* =====================================================
       20. SCAN BUTTON
    ===================================================== */

    if (scanBtn) {

        scanBtn.addEventListener(
            "click",
            runScan
        );

    }


    /* =====================================================
       21. ENTER KEY
    ===================================================== */

    if (urlInput) {

        urlInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    runScan();

                }

            }
        );

    }


    /* =====================================================
       22. FAQ
    ===================================================== */

    faqItems.forEach(item => {

        item.addEventListener(
            "toggle",
            () => {

                if (item.open) {

                    const summary =
                        item.querySelector(
                            "summary"
                        );


                    if (summary) {

                        console.log(
                            "FAQ opened:",
                            summary.textContent.trim()
                        );

                    }

                }

            }
        );

    });


    /* =====================================================
       23. FEEDBACK FORM
    ===================================================== */

    if (feedbackForm) {

        feedbackForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                showMessage(
                    "Thank you for your feedback!"
                );


                feedbackForm.reset();

            }
        );

    }


    /* =====================================================
       24. GET STARTED BUTTON
    ===================================================== */

    const getStartedButton =
        document.querySelector(
            ".header-actions button"
        );


    if (getStartedButton) {

        getStartedButton.addEventListener(
            "click",
            () => {

                const swarm =
                    document.querySelector(
                        "#swarm"
                    );


                if (swarm) {

                    swarm.scrollIntoView({
                        behavior: "smooth"
                    });

                }


                if (urlInput) {

                    setTimeout(
                        () => {
                            urlInput.focus();
                        },
                        600
                    );

                }

            }
        );

    }


    /* =====================================================
       25. PAGE LOAD
    ===================================================== */

    window.addEventListener(
        "load",
        () => {

            console.log(
                "SwarmSentriAI page fully loaded."
            );

        }
    );

});
/* =========================================================
   SCROLL REVEAL ANIMATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

});