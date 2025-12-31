# Scaling Project Connect: From Prototype to Production

This document outlines the roadmap to scale this multi-tenant system for thousands of users.

## 1. Database Upgrade (Critical)
**Current**: SQLite (Local file, hard to scale, locks easily).
**Upgrade**: **PostgreSQL** or **MySQL**.
*   **Why**: Supports concurrent writes, replication, and is production-standard.
*   **How**:
    *   Spin up a Postgres instance (Docker or Cloud SQL).
    *   Update Spring Boot (`application.properties`) and ASP.NET (`appsettings.json`) connection strings.
    *   Use `Flyway` (Java) and `EF Core Migrations` (C#) to manage schema changes.

## 2. Containerization (DevOps)
**Current**: Running manually via terminals.
**Upgrade**: **Docker** & **Docker Compose**.
*   **Why**: Guarantees "it works on my machine" works on the server. Easy deployment.
*   **How**:
    *   Create a `Dockerfile` for Auth-service, Project-service, and Frontend.
    *   Create a `docker-compose.yml` to spin up all 3 services + Postgres + Redis with one command.

## 3. Communication Pattern (Architecture)
**Current**: Synchronous HTTP calls (coupled).
**Upgrade**: **Async Messaging (RabbitMQ / Kafka)**.
*   **Why**: If Auth Service deletes a user, Project Service needs to know eventually, even if it's down.
*   **Example**:
    1.  User deletes account in Spring Boot.
    2.  Spring publishes `UserDeletedEvent` to RabbitMQ.
    3.  ASP.NET listens to `UserDeletedEvent` and deletes all user projects.

## 4. Performance (caching)
**Current**: DB query for every request.
**Upgrade**: **Redis Cache**.
*   **Auth Service**: Cache user details/tokens to avoid DB hits on `validateToken`.
*   **Project Service**: Cache "Get All Projects" for a user, invalidate only when they modify a project.

## 5. API Gateway
**Current**: Frontend calls ports `8080` and `5259` directly.
**Upgrade**: **API Gateway (Nginx / Ocelot / Spring Cloud Gateway)**.
*   **Why**: Frontend should only know `api.myapp.com`. The gateway routes `/auth` to Spring and `/projects` to ASP.NET.
*   **Bonus**: Centralized rate limiting, SSL termination, and logging.

## 6. Monitoring & Observability
**Upgrade**: **Prometheus & Grafana** + **OpenTelemetry**.
*   **Why**: You need to know when errors spike or latency increases.
*   **How**: Add Actuator (Spring) and HealthChecks (ASP.NET) to expose metrics.

## 7. Frontend Optimization
*   **CDN**: Serve static assets (JS/CSS) via Cloudflare/AWS CloudFront.
*   **State Management**: Move from `Context API` to **Redux Toolkit** or **TanStack Query** for better caching and background refetching.

---

## Recommended Phase 1 Roadmap
1.  [ ] Create Dockerfiles for all 3 apps.
2.  [ ] write `docker-compose.yml` to run them together.
3.  [ ] Switch SQLite to PostgreSQL containers in the compose file.
