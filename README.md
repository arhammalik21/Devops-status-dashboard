# 🚀 DevOps Status Dashboard

A cloud-based **Flask web dashboard** that automatically builds, containers, and deploys via **GitHub Actions → Docker Hub → AWS EC2**.

## 🧰 Tech Stack
- Python (Flask)
- Docker
- GitHub Actions (CI/CD)
- AWS EC2 (Deployment)
- Linux / Bash

## ⚙️ Features
- Automated CI/CD pipeline (build → push → deploy)
- Containerized app with version tagging
- Real-time display of fake CPU & memory usage, app version, build status
- Zero-downtime deployment
- Optional HTTPS setup with Nginx + Certbot

## 🧪 Run Locally
```bash
git clone https://github.com/arhammalik21/Devops-status-dashboard.git
cd devops-status-dashboard
docker build -t devops-dashboard .
docker run -p 5000:5000 devops-dashboard
