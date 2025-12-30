# Project Connect

A modern, multi-tenant Project Management CRM built with a microservices architecture.

## 🚀 Tech Stack

*   **Authentication Service**: Spring Boot (Java 21) + SQLite
*   **Project Service**: ASP.NET Core 8 (C#) + SQLite
*   **Frontend**: React + Vite + Framer Motion (Glassmorphism UI)

## ✨ Features

*   **Secure Authentication**: JWT-based login/signup handled by Spring Boot.
*   **Data Isolation**: Users can only see and manage their own projects.
*   **Modern UI**: Beautiful glassmorphism design with smooth animations.
*   **REST API**: Clean communication between services.

## 🛠️ How to Run

### 1. Auth Service (Spring Boot)
```bash
cd Auth-service
./mvnw spring-boot:run
```
*Runs on http://localhost:8080*

### 2. Project Service (ASP.NET Core)
```bash
cd Project-service/Project-service
dotnet run
```
*Runs on http://localhost:5259*

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*
