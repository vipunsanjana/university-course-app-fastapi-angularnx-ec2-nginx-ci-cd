# 🎓 University Degree Recommendation & Organization Management App

![Fullstack](https://img.shields.io/badge/Fullstack-FastAPI%20%2B%20Angular-blue?style=for-the-badge&logo=fastapi&logoColor=white)

---

## Overview

This repository contains a **fullstack application** designed to:

- Help Sri Lankan A/L students find university degree programs based on their Z-score, stream, and district (**FastAPI backend**).
- Provide a modern, scalable **Angular Nx frontend** for enterprise organization management.

Both backend and frontend are containerized using Docker and orchestrated with NGINX as a reverse proxy and load balancer for production-ready deployment.

---

## 🚀 Features

### Backend - University Degree Recommendation API

- **Live Google Sheets Integration** for real-time degree data
- **Smart filtering** by Z-score, subject stream, and district
- Supports recommendations including **nearby districts**
- **CORS enabled** for frontend integration
- **Swagger UI** interactive API docs at `/docs`
- Health monitoring endpoint `/health`
- Caching to minimize Google Sheets API calls
- Comprehensive error handling & structured logging
- Configured via environment variables for security
- Built with **FastAPI**, **Pandas**, and **gspread**

### Frontend - Organization Management App

- Built with **Angular 17+** using **Nx 18+** monorepo tooling
- Modular architecture with reusable UI components
- Modern Angular standalone components and TypeScript 5+
- Integrated testing with **Jest** and **Cypress**
- Pre-configured CI/CD workflows for easy deployment
- Dockerized for scalable container deployment
- Nx Cloud enabled for build caching and distributed task execution
- Consistent code style enforced by ESLint

---

## 📦 Technologies Used

| Backend                                | Frontend                              | DevOps                          |
|--------------------------------------|-------------------------------------|--------------------------------|
| FastAPI 0.110+                       | Angular 17+                         | Docker 24+                     |
| Python 3.10+                        | Nx 18+                             | NGINX (reverse proxy & load balancer) |
| Pandas 2.2+                        | TypeScript 5+                      | GitHub Actions (CI/CD)         |
| gspread 6.0+                       | Jest 29+, Cypress 13+              | Self-hosted Runners            |
| Uvicorn 0.29+                     | Webpack 5+                        | Docker Hub                    |
| python-dotenv 1.0+                  | ESLint                            |                                |

---

## 🔧 Setup & Deployment

1. **Clone the repository**

2. **Configure your environment secrets**  
   - Add your backend `.env` variables securely in GitHub Secrets (e.g., Google Sheets credentials)  
   - Add your Docker Hub credentials as secrets for CI/CD login

3. **Build & Push Docker Images** (via GitHub Actions)  
   The workflow builds backend, frontend, and custom NGINX images, then pushes to Docker Hub.

4. **Deploy to your EC2 Self-hosted Runner**  
   - Pull the latest Docker images  
   - Stop old containers  
   - Run backend replicas and frontend container  
   - Run custom NGINX container for reverse proxy and load balancing

---

## 🧑‍💻 Developer

**Vipun Sajana**  
Former Intern Software Engineer  
WSO2 Cloud Security Operations Center  

---
