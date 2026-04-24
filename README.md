# 🚀 DevOps Status Dashboard

A flagship **Flask web dashboard** that monitors **real-time system metrics** (CPU, RAM, Disk, Network) and automatically deploys via **GitHub Actions → Docker Hub → AWS EC2**.

![Python](https://img.shields.io/badge/Python-Flask-blue?logo=python)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions)
![AWS](https://img.shields.io/badge/Deploy-AWS_EC2-FF9900?logo=amazon-aws)

## 🧰 Tech Stack
| Technology | Role |
|---|---|
| **Python (Flask)** | Web framework & API |
| **psutil** | Real-time system telemetry (CPU, RAM, Disk, Network) |
| **Vanilla JS** | Live gauge animations & Sparkline charts |
| **CSS3** | Premium Glassmorphism UI |

## ⚙️ Features
- 📊 **Live System Metrics** — Monitor your actual CPU, RAM, and Disk usage.
- 📈 **Trend Sparklines** — See historical data for the last 60 seconds.
- 🔄 **Auto-refresh** — Dashboard polls `/api/status` every 3 seconds.
- 🕵️ **Process Table** — See which apps are using the most CPU right now.
- 🐳 **Docker Ready** — Includes a Dockerfile for when you're ready to containerize.
- 🤖 **CI/CD Ready** — Pre-configured pipeline for AWS EC2 (stored in `workflows_backup/`).

## 🚀 Quick Start (Run Locally)

Monitor your own computer's performance in seconds:

```bash
# 1. Clone the repository
git clone https://github.com/arhammalik21/Devops-status-dashboard.git
cd Devops-status-dashboard

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the dashboard
python app.py
```
**Open [http://localhost:5000](http://localhost:5000) in your browser.**

```bash
# Or run with Docker
docker build -t devops-dashboard .
docker run -p 5000:5000 devops-dashboard
```

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `APP_VERSION` | `2.0.0` | Displayed version number |
| `BUILD_NUMBER` | `local-dev` | CI build number |
| `ENVIRONMENT` | `development` | Environment badge color |
| `DEPLOY_TIME` | Current time | Last deployment timestamp |
| `PORT` | `5000` | Server port |

## 📡 API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | Dashboard UI |
| `GET /api/status` | JSON metrics (CPU, memory, build info, etc.) |
| `GET /health` | Health check for load balancers |

## ☁️ Advanced: Deployment Roadmap

When you are ready to take this project to the cloud, follow these steps:

1.  **Dockerize**: Run `docker build -t devops-dashboard .` to test the container locally.
2.  **Docker Hub**: Push your image to Docker Hub so it can be accessed from anywhere.
3.  **AWS EC2**: Spin up a Linux server and run your container there.
4.  **CI/CD**: Move `workflows_backup/deploy.yml.bak` back to `.github/workflows/deploy.yml` and add your **GitHub Secrets** to enable automatic deployments.

## 📁 Project Structure

```
├── app.py                     # Flask application
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Container definition
├── .dockerignore              # Docker build exclusions
├── .github/workflows/
│   └── deploy.yml             # CI/CD pipeline
├── templates/
│   └── dashboard.html         # Dashboard UI
└── static/
    ├── css/style.css          # Styles & design system
    └── js/dashboard.js        # Live-update logic
```
