# 🚀 DevOps Status Dashboard

A flagship **Flask web dashboard** that monitors **real-time system metrics** (CPU, RAM, Disk, Network) and automatically deploys via **GitHub Actions → Docker Hub → AWS EC2**.

![Python](https://img.shields.io/badge/Python-Flask-blue?logo=python)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions)
![AWS](https://img.shields.io/badge/Deploy-AWS_EC2-FF9900?logo=amazon-aws)

## 🧰 Tech Stack

| Technology | Role |
|---|---|
| **Python (Flask)** | Web framework serving the dashboard & API |
| **psutil** | Real-time system monitoring (CPU, Memory, Disk, Network) |
| **Docker** | Containerizes the app for portable deployment |
| **GitHub Actions** | CI/CD pipeline — build, push, deploy on every push |
| **AWS EC2** | Production hosting via SSH deployment |
| **Linux / Bash** | Deployment scripts & server management |

## ⚙️ Features

- 📊 **Real System Metrics** — Live CPU, RAM, Disk, and Network usage via `psutil`
- 📈 **Sparkline History** — Visual trend charts for every metric
- 🔄 **Auto-refresh** — Dashboard polls `/api/status` every 3 seconds
- 🕵️ **Process Explorer** — Monitor top processes by CPU and Memory usage
- 🐳 **Fully Containerized** — Multi-stage Docker image with health checks & Gunicorn
- 🚀 **Automated CI/CD** — Push to `main` → build → push to Docker Hub → deploy to EC2
- 📋 **Pipeline History** — View recent CI/CD runs with status indicators
- 🏗️ **Architecture Diagram** — Visual flow from Git push to live app
- 🌙 **Premium Dark UI** — Glassmorphism design with animated particles

## 🧪 Run Locally

```bash
# Clone and run with Python
git clone https://github.com/arhammalik21/Devops-status-dashboard.git
cd Devops-status-dashboard
pip install -r requirements.txt
python app.py
# Open http://localhost:5000
```

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

## 🏗️ CI/CD Pipeline

```
Git Push → GitHub Actions → Docker Build → Docker Hub → SSH Deploy → AWS EC2
```

The pipeline (`.github/workflows/deploy.yml`) requires these **GitHub Secrets**:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `EC2_HOST` | EC2 instance public IP |
| `EC2_USER` | SSH username (usually `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key for EC2 |

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
