# Comprehensive Project Explanation

This document explains the architecture, design decisions, and code flow of "Project Connect".

## 1. Architecture Overview

This is a **distributed system** composed of three distinct parts that communicate over HTTP.

```mermaid
graph TD
    User[User Browser]
    Nginx[Nginx Gateway (Port 80)]
    React[React Frontend (Internal)]
    Spring[Spring Boot Auth Service (Internal)]
    DotNet[ASP.NET Core Project Service (Internal)]
    DB_Auth[(Auth SQLite DB)]
    DB_Proj[(Project SQLite DB)]

    User <-->|HTTP| Nginx
    Nginx <-->|/| React
    Nginx <-->|/auth| Spring
    Nginx <-->|/api/projects| DotNet
    Spring <--> DB_Auth
    DotNet <--> DB_Proj
```

### Key Concept: Separation of Concerns
*   **Spring Boot** deals *only* with **Identity** (Who are you?). It knows nothing about projects.
*   **ASP.NET Core** deals *only* with **Business Logic** (What are you doing?). It trusts the ID provided by Spring Boot.
*   **React** stays stateless and simply presents the data.

---

## 2. Service Breakdown

### 🌐 API Gateway (Nginx)
*   **Location**: `nginx.conf`
*   **Role**: The "Traffic Cop" & Single Entry Point.
*   **Port**: `80` (Public).
*   **How it works**:
    *   Receives all requests from the browser.
    *   Routes `/` to the React Container.
    *   Routes `/auth/*` to the Spring Boot Container.
    *   Routes `/api/projects/*` to the ASP.NET Core Container.

### 🛡️ Auth Service (Spring Boot)
*   **Location**: `/Auth-service`
*   **Role**: The "Security Guard".
*   **Database**: `users.db` (Stores Email, Password Hash, Role).
*   **Key Dependencies**:
    *   `Spring Security`: Handles password hashing (BCrypt) and request filtering.
    *   `JJWT`: Library to generate standard JSON Web Tokens.
*   **How it works**:
    1.  User sends Email/Password to `/auth/login`.
    2.  Spring verifies hash against DB.
    3.  If valid, it signs a JWT using a **Secret Key**.
    4.  This token is returned to React.

### 💼 Project Service (ASP.NET Core)
*   **Location**: `/Project-service`
*   **Role**: The "Worker".
*   **Database**: `projects.db` (Stores Projects, Tasks).
*   **Key Dependencies**:
    *   `Entity Framework Core`: ORM for database access.
    *   `JwtBearer`: Middleware to validate tokens.
*   **How it works**:
    1.  React sends a request (e.g., `GET /projects`) with Header `Authorization: Bearer <TOKEN>`.
    2.  ASP.NET intercepts the request.
    3.  It checks the signature of the token using the **SAME Secret Key** as Spring Boot.
    4.  If valid, it extracts the `userId` from the token claims.
    5.  The Controller uses that `userId` to filter the database (`WHERE p.UserId == currentUserId`).

### 🎨 Frontend (React)
*   **Location**: `/frontend`
*   **Role**: The "Face".
*   **Key Dependencies**:
    *   `React Router`: Handles navigation (Dashboard, Login, Details).
    *   `Axios`: Makes HTTP requests.
    *   `Framer Motion`: Handles animations.
*   **State Management**:
    *   `AuthContext`: Keeps track of whether you are logged in (checking `localStorage`).

---

## 3. The Authentication Flow (Step-by-Step)

75. 1.  **Signup**:
76.     *   You enter `test@test.com`.
77.     *   React calls `POST http://localhost/auth/register`.
78.     *   Spring Boot saves you to `users.db`.
79. 
80. 2.  **Login**:
81.     *   You enter credentials.
82.     *   React calls `POST http://localhost/auth/login`.
83.     *   Spring Boot returns a token: `eyJhbGcj...`
84.     *   React saves this to `localStorage`.
85. 
86. 3.  **Accessing Dashboard**:
87.     *   React reads the token from storage.
88.     *   React calls `GET http://localhost/api/projects`.
89.     *   It attaches the token header.
90.     *   ASP.NET validates it and returns *your* projects.

## 4. Why this approach?

*   **Scalability**: You can scale the Project Service independently from the Auth Service.
*   **Polyglot**: You proved you can make Java and C# talk to each other using standard protocols (HTTP/JWT).
*   **Security**: Passwords never leave the Auth Service's database. The Project Service never sees a password, only a transient token.
*   **Containerization**: The entire stack runs in Docker, ensuring "Production Parity" (it works on your machine exactly as it would on a server).

## 5. Folder Structure

*   `Auth-service/`: Java backend code.
    *   `src/main/java/.../model`: Database entities.
    *   `src/main/java/.../controller`: API Endpoints.
*   `Project-service/`: C# backend code.
    *   `Controllers/`: API Endpoints.
    *   `Models/`: Database entities.
    *   `Data/`: Database context configuration.
*   `frontend/`: Javascript frontend code.
    *   `src/pages/`: Full screen views.
    *   `src/components/`: Reusable parts.
    *   `src/services/`: API connection logic.
    *   `src/context/`: Global state (User session).
*   `docker-compose.yml`: Orchestration config.
*   `nginx.conf`: Gateway config.
