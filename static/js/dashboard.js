/**
 * DevOps Dashboard v2.1 — Robust & Flagship
 * Improved error handling, real system metrics, and fix for visibility.
 */
(() => {
    "use strict";
    const POLL = 3000;
    const CIRC = 326.73;
    const el = (id) => document.getElementById(id);

    // Defensive element accessor
    const getEl = (id) => {
        const element = el(id);
        if (!element) console.warn(`Element with ID "${id}" not found.`);
        return element;
    };

    const refs = {
        cpuRing: getEl("cpuRing"), cpuPercent: getEl("cpuPercent"),
        memRing: getEl("memRing"), memPercent: getEl("memPercent"),
        diskRing: getEl("diskRing"), diskPercent: getEl("diskPercent"),
        netRing: getEl("netRing"), netPercent: getEl("netPercent"),
        memDetail: getEl("memDetail"), diskDetail: getEl("diskDetail"), netDetail: getEl("netDetail"),
        appVersion: getEl("appVersion"), buildNumber: getEl("buildNumber"),
        buildStatus: getEl("buildStatus"), containerId: getEl("containerId"),
        deployTime: getEl("deployTime"), uptimeValue: getEl("uptimeValue"),
        envText: getEl("envText"), envBadge: getEl("envBadge"),
        requestsPerMin: getEl("requestsPerMin"), totalRequests: getEl("totalRequests"),
        responseTime: getEl("responseTime"), pipelineList: getEl("pipelineList"),
        liveIndicator: getEl("liveIndicator"), perCpuBars: getEl("perCpuBars"),
        coreCount: getEl("coreCount"), processBody: getEl("processBody"),
        siHostname: getEl("siHostname"), siOS: getEl("siOS"), siArch: getEl("siArch"),
        siPython: getEl("siPython"), siCores: getEl("siCores"), siMemory: getEl("siMemory"),
        siDisk: getEl("siDisk"), siIP: getEl("siIP"), siUptime: getEl("siUptime"),
        siNetSent: getEl("siNetSent"), siNetRecv: getEl("siNetRecv"), siMemAvail: getEl("siMemAvail"),
    };

    const sparklines = {
        cpu: getEl("cpuSparkline"), mem: getEl("memSparkline"),
        disk: getEl("diskSparkline"), net: getEl("netSparkline"),
    };

    function setGauge(ring, pEl, val) {
        if (ring) ring.style.strokeDashoffset = CIRC - (val / 100) * CIRC;
        if (pEl) animNum(pEl, val);
    }

    function animNum(target_el, target) {
        if (!target_el) return;
        const cur = parseFloat(target_el.textContent) || 0;
        const diff = target - cur;
        let step = 0;
        const t = setInterval(() => {
            step++;
            target_el.textContent = (cur + diff * (step / 15)).toFixed(1);
            if (step >= 15) { clearInterval(t); target_el.textContent = target.toFixed(1); }
        }, 30);
    }

    function gColor(v) {
        if (v < 50) return "var(--clr-success)";
        if (v < 75) return "var(--clr-warning)";
        return "var(--clr-danger)";
    }

    function gColorHex(v) {
        if (v < 50) return "#34d399";
        if (v < 75) return "#fbbf24";
        return "#f87171";
    }

    function drawSparkline(canvas, data, color) {
        if (!canvas || !data || data.length < 2) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        if (w === 0 || h === 0) return;
        
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const max = Math.max(...data, 1);
        const min = Math.min(...data, 0);
        const range = max - min || 1;
        const stepX = w / (data.length - 1);
        const pad = 3;

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color + "40");
        grad.addColorStop(1, color + "05");

        ctx.beginPath();
        ctx.moveTo(0, h);
        data.forEach((v, i) => {
            const x = i * stepX;
            const y = h - pad - ((v - min) / range) * (h - pad * 2);
            ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * stepX;
            const y = h - pad - ((v - min) / range) * (h - pad * 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = "round";
        ctx.stroke();
    }

    function renderPerCpu(perCpu) {
        if (refs.coreCount) refs.coreCount.textContent = perCpu.length + " cores";
        if (refs.perCpuBars) {
            refs.perCpuBars.innerHTML = perCpu.map((v, i) => `
                <div class="cpu-bar-item">
                    <span class="cpu-bar-label">C${i}</span>
                    <div class="cpu-bar-track">
                        <div class="cpu-bar-fill" style="width:${v}%;background:${gColorHex(v)}"></div>
                    </div>
                    <span class="cpu-bar-val">${v}%</span>
                </div>
            `).join("");
        }
    }

    function renderPipelines(h) {
        if (!refs.pipelineList) return;
        refs.pipelineList.innerHTML = h.map(p => `
            <div class="pipeline-row ${p.status === "failed" ? "pipeline-failed" : "pipeline-success"}">
                <div class="pipeline-id">${p.id}</div>
                <div class="pipeline-commit">${p.commit}</div>
                <div class="pipeline-branch">${p.branch || "main"}</div>
                <div class="pipeline-status"><span class="status-dot ${p.status}"></span>${p.status}</div>
                <div class="pipeline-duration">${p.duration}</div>
                <div class="pipeline-time">${p.time}</div>
            </div>`).join("");
    }

    function renderProcesses(procs) {
        if (!refs.processBody) return;
        refs.processBody.innerHTML = procs.map(p => {
            const statusClass = p.status === "running" ? "proc-running" : "proc-other";
            return `<tr>
                <td class="mono">${p.pid}</td>
                <td class="proc-name">${p.name}</td>
                <td style="color:${gColorHex(p.cpu)}">${p.cpu}%</td>
                <td>${p.memory}%</td>
                <td><span class="proc-badge ${statusClass}">${p.status}</span></td>
            </tr>`;
        }).join("");
    }

    function renderSysInfo(si) {
        if (refs.siHostname) refs.siHostname.textContent = si.hostname;
        if (refs.siOS) refs.siOS.textContent = si.os;
        if (refs.siArch) refs.siArch.textContent = si.architecture;
        if (refs.siPython) refs.siPython.textContent = si.python_version;
        if (refs.siCores) refs.siCores.textContent = `${si.cpu_cores_physical}P / ${si.cpu_cores_logical}L`;
        if (refs.siMemory) refs.siMemory.textContent = si.total_memory;
        if (refs.siDisk) refs.siDisk.textContent = si.total_disk;
        if (refs.siIP) refs.siIP.textContent = si.ip_address;
        if (refs.siUptime) refs.siUptime.textContent = si.system_uptime;
    }

    let first = true;
    async function fetchStatus() {
        try {
            const res = await fetch("/api/status");
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            const d = await res.json();

            // 1. Gauges
            try {
                setGauge(refs.cpuRing, refs.cpuPercent, d.cpu);
                if (refs.cpuRing) refs.cpuRing.style.stroke = gColor(d.cpu);
                setGauge(refs.memRing, refs.memPercent, d.memory);
                if (refs.memRing) refs.memRing.style.stroke = gColor(d.memory);
                setGauge(refs.diskRing, refs.diskPercent, d.disk);
                if (refs.diskRing) refs.diskRing.style.stroke = gColor(d.disk);
                setGauge(refs.netRing, refs.netPercent, d.network);
                if (refs.netRing) refs.netRing.style.stroke = "var(--clr-accent)";
            } catch (e) { console.error("Gauges error:", e); }

            // 2. Labels
            if (refs.memDetail) refs.memDetail.textContent = `${d.memory_used} / ${d.memory_total}`;
            if (refs.diskDetail) refs.diskDetail.textContent = `${d.disk_used} / ${d.disk_total}`;
            if (refs.netDetail) refs.netDetail.textContent = `↑ ${d.net_sent}  ↓ ${d.net_recv}`;

            // 3. Sparklines
            try {
                drawSparkline(sparklines.cpu, d.cpu_history, gColorHex(d.cpu));
                drawSparkline(sparklines.mem, d.mem_history, gColorHex(d.memory));
                drawSparkline(sparklines.disk, d.disk_history, gColorHex(d.disk));
                drawSparkline(sparklines.net, d.net_history, "#818cf8");
            } catch (e) { console.error("Sparkline error:", e); }

            // 4. Info Chips
            if (refs.appVersion) refs.appVersion.textContent = `v${d.app_version}`;
            if (refs.buildNumber) refs.buildNumber.textContent = `#${d.build_number}`;
            if (refs.containerId) refs.containerId.textContent = d.container_id;
            if (refs.deployTime) refs.deployTime.textContent = d.deploy_time;
            if (refs.uptimeValue) refs.uptimeValue.textContent = d.uptime;
            if (refs.envText) refs.envText.textContent = d.environment;
            if (refs.envBadge) refs.envBadge.className = "env-badge env-" + d.environment;
            if (refs.buildStatus) {
                refs.buildStatus.textContent = d.build_status;
                refs.buildStatus.className = "chip-value status-" + d.build_status;
            }

            // 5. Metrics
            if (refs.requestsPerMin) refs.requestsPerMin.textContent = d.requests_per_min.toLocaleString();
            if (refs.totalRequests) refs.totalRequests.textContent = d.total_requests.toLocaleString();
            if (refs.responseTime) refs.responseTime.textContent = d.response_time_ms + " ms";

            // 6. Extra Panels
            try {
                if (d.per_cpu) renderPerCpu(d.per_cpu);
                if (d.top_processes) renderProcesses(d.top_processes);
                if (d.system_info) {
                    renderSysInfo(d.system_info);
                    if (refs.siNetSent) refs.siNetSent.textContent = d.net_total_sent;
                    if (refs.siNetRecv) refs.siNetRecv.textContent = d.net_total_recv;
                    if (refs.siMemAvail) refs.siMemAvail.textContent = d.memory_available;
                }
                renderPipelines(d.pipeline_history);
            } catch (e) { console.error("Panels error:", e); }

            if (refs.liveIndicator) {
                refs.liveIndicator.classList.add("pulse");
                setTimeout(() => refs.liveIndicator.classList.remove("pulse"), 600);
            }

            if (first) {
                first = false;
                document.querySelectorAll(".gauge-card,.metric-card,.info-chip,.arch-node").forEach((el, i) => {
                    el.style.animationDelay = `${i * 0.06}s`;
                    el.classList.add("fade-in-up");
                });
            }
        } catch (e) {
            console.error("Critical Fetch Error:", e);
            if (refs.liveIndicator) {
                const label = refs.liveIndicator.querySelector("span:last-child");
                if (label) label.textContent = "OFFLINE";
                refs.liveIndicator.classList.add("offline");
            }
        }
    }

    function createParticles() {
        const c = el("bgParticles");
        if (!c) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.left = Math.random() * 100 + "%";
            p.style.top = Math.random() * 100 + "%";
            p.style.width = p.style.height = Math.random() * 4 + 1 + "px";
            p.style.animationDuration = Math.random() * 20 + 10 + "s";
            p.style.animationDelay = Math.random() * 10 + "s";
            c.appendChild(p);
        }
    }

    createParticles();
    fetchStatus();
    setInterval(fetchStatus, POLL);
})();
