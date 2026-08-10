# 🔐 Policy-Based Access Control (PBAC) System

> A full-stack authorization platform with a Java 17 / Spring Boot backend and Next.js / TypeScript frontend, implementing JWT authentication, dynamic policy evaluation, Redis caching, PostgreSQL persistence, and audit logging.

[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?logo=springsecurity\&logoColor=white)](https://spring.io/projects/spring-security)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis\&logoColor=white)](https://redis.io/)
[![Maven](https://img.shields.io/badge/Maven-C71A36?logo=apachemaven\&logoColor=white)](https://maven.apache.org/)

---

## 📌 Overview

Traditional role-based authorization can become difficult to maintain when access decisions depend on multiple factors such as:

* User role
* Department
* Resource
* Action
* Time
* IP address
* Policy priority

This project implements a **Policy-Based Access Control (PBAC)** system where authorization decisions are determined dynamically from configurable policies and request context.

The system separates **authentication, authorization, policy evaluation, business logic, data access, caching, and audit logging** into dedicated layers.

---

# 🎯 Key Features

### 🔑 JWT Authentication

* User registration and login
* BCrypt password hashing
* Access and refresh tokens
* JWT validation
* User context extraction
* Stateless authentication

### 📋 Dynamic Policy Management

* Create, read, update and delete policies
* JSON-based policy definitions
* Configurable subjects, resources and actions
* Policy priorities
* Runtime policy evaluation

### 🧠 Policy Evaluation Engine

The authorization engine supports:

* Multiple policy evaluation strategies
* Runtime condition evaluation
* Priority-based policies
* `DENY` overrides `ALLOW`
* Default-deny authorization
* Context-aware access decisions

### ⚡ Redis Caching

Policies can be cached using Redis to reduce repeated database lookups during authorization.

### 📝 Audit Logging

Every authorization decision can be recorded with:

* User
* Resource
* Action
* Decision
* Timestamp
* Request context

The audit trail is designed as an append-only record for traceability.

### 🛡️ Spring Security Integration

Authorization is integrated into the request lifecycle through security filters before protected controller execution.

---

## 🏗️ Full-Stack Architecture

```text
┌─────────────────────────────────────┐
│       Next.js / TypeScript          │
│          Frontend UI                │
└──────────────────┬──────────────────┘
                   │
                   │ REST API
                   ▼
┌─────────────────────────────────────┐
│       Java 17 / Spring Boot         │
│          Backend API                │
├─────────────────────────────────────┤
│ Spring Security + JWT               │
│ Policy Evaluation Engine            │
│ Business Services                   │
│ Audit Logging                       │
└───────────────┬─────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │    Redis     │
│ Persistence  │  │    Cache     │
└──────────────┘  └──────────────┘
```
---

# 🔄 Authorization Flow

```text
User Request
     ↓
JWT Authentication
     ↓
Extract User Context
     ↓
Authorization Filter
     ↓
Build Authorization Context
     ↓
Fetch Applicable Policies
     ↓
Redis Cache / PostgreSQL
     ↓
Policy Evaluation Engine
     ↓
Evaluate DENY Policies
     ↓
Evaluate ALLOW Policies
     ↓
Default DENY if no policy matches
     ↓
Audit Authorization Decision
     ↓
ALLOW / DENY
```

---

# 🧩 Policy Model

Policies can define access using multiple attributes.

Example:

```json
{
  "name": "Admin Database Access",
  "effect": "ALLOW",
  "priority": 100,
  "subject": {
    "role": "admin",
    "department": "*"
  },
  "resource": "database",
  "action": "READ",
  "conditions": {
    "timeRange": {
      "start": "09:00",
      "end": "17:00"
    }
  }
}
```

This allows the system to make authorization decisions based on **who is requesting access, what they are accessing, what action they are performing, and under which conditions**.

---

# 🧠 Policy Evaluation Logic

```text
                    Incoming Request
                           │
                           ▼
                  Build Context
                           │
                           ▼
                  Find Applicable
                     Policies
                           │
                           ▼
                    DENY Policies?
                    /           \
                  YES            NO
                   │              │
                   ▼              ▼
                 DENY        Check ALLOW
                                  │
                           ┌──────┴──────┐
                           │             │
                         Match        No Match
                           │             │
                           ▼             ▼
                         ALLOW         DENY
```

The system follows a **deny-overrides-allow** strategy and defaults to deny when no applicable authorization policy grants access.

---

# 🛠️ Technology Stack

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* Spring Data JPA
* Maven

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS

### Security

* JWT
* BCrypt
* Stateless authentication
* Authorization filters

### Database & Caching

* PostgreSQL
* Redis
* HikariCP

### API

* REST APIs
* JSON
* DTO-based request/response architecture

### Architecture & Design

* Layered Architecture
* Strategy Pattern
* Chain of Responsibility
* Builder Pattern
* Repository Pattern
* DTO Pattern
* Mapper Pattern

---

# 📂 Project Structure

```text
src/main/java/com/enterprise/pbac/
│
├── api/
│   ├── controller/
│   ├── dto/
│   └── exception/
│
├── application/
│   ├── service/
│   └── exception/
│
├── domain/
│   ├── entity/
│   ├── enums/
│   └── engine/
│       ├── condition/
│       ├── strategy/
│       └── model/
│
├── infrastructure/
│   ├── repository/
│   ├── mapper/
│   ├── cache/
│   ├── config/
│   └── security/
│
└── PbacSystemApplication.java
```
---

### Why I prefer this

Your pinned card will now say:

**PBAC**  
> Full-stack policy-based access control system with Java/Spring Boot, Next.js/TypeScript, JWT, PostgreSQL and Redis.  
> 🔵 TypeScript

And the recruiter thinks:

> **"Oh, this is full-stack. Java backend + TypeScript frontend."**

That's actually a **better signal for Software Engineer roles**.

---

### One more thing I noticed

Your repository currently has **only 4 commits**, but the architecture is substantially more interesting than the commit count suggests. :contentReference[oaicite:1]{index=1}

So I'd make **one real improvement** before touching anything else: add a proper frontend/backend directory explanation and screenshots of the application.

**Don't manipulate the language detection. Keep TypeScript.** Your repo genuinely contains TypeScript, and your profile now looks more credible because of it.
---

# 🔌 REST API

## Authentication

### Sign Up

```http
POST /api/auth/signup
```

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Login

```http
POST /api/auth/login
```

### Refresh Token

```http
POST /api/auth/refresh
```

---

## Policy Management

```http
POST   /api/policies
GET    /api/policies
GET    /api/policies/{policyId}
PUT    /api/policies/{policyId}
DELETE /api/policies/{policyId}
```

---

## Authorization

```http
POST /api/authorization/check
```

Example:

```json
{
  "resource": "database",
  "action": "READ",
  "context": {
    "ipAddress": "192.168.1.1"
  }
}
```

---

## Audit

```http
GET /api/audit/user/{userId}
GET /api/audit/denied
```

---

# 🔒 Security Design

The project incorporates several security practices:

* BCrypt password hashing
* JWT-based authentication
* Access and refresh tokens
* Stateless authentication
* Parameterized database queries through JPA
* Centralized exception handling
* Authorization before protected controller execution
* Immutable audit logging
* Default-deny authorization

---

# 🧱 Design Patterns

| Pattern                 | Usage                                        |
| ----------------------- | -------------------------------------------- |
| Strategy                | Pluggable policy evaluation strategies       |
| Chain of Responsibility | Sequential condition evaluation              |
| Builder                 | Authorization context and evaluation results |
| Repository              | Database access abstraction                  |
| DTO                     | Separation of API contracts from entities    |
| Mapper                  | Entity ↔ DTO conversion                      |

These patterns help keep the authorization engine modular and allow new policy conditions or evaluation strategies to be introduced without tightly coupling them to the rest of the application.

---

# ⚡ Performance

The system incorporates several performance-oriented design decisions:

* Redis policy caching
* TTL-based cache invalidation
* Database indexing
* Connection pooling with HikariCP
* Lazy entity loading
* Efficient policy retrieval
* Separation of authorization evaluation from persistence logic

---

# 🧪 Testing

Run the test suite:

```bash
mvn test
```

Generate test coverage:

```bash
mvn clean test jacoco:report
```

---

# 🚀 Getting Started

## Prerequisites

* Java 17+
* Maven 3.8+
* PostgreSQL 12+
* Redis 6+

## Clone

```bash
git clone https://github.com/Raj140503/PBAC-Policy-Based-Access-Control.git

cd PBAC-Policy-Based-Access-Control
```

## Build

```bash
mvn clean install
```

## Configure PostgreSQL

Create a database:

```text
pbac_db
```

Configure the application datasource in `application.yml`.

## Configure JWT

Set a secure JWT secret through an environment variable:

```bash
export JWT_SECRET="your-secure-secret-key"
```

## Run

```bash
mvn spring-boot:run
```

The application starts on:

```text
http://localhost:8080
```

---

# 📊 Database Model

The system uses PostgreSQL for persistent storage of:

* Users
* User attributes
* Policies
* Authorization decisions
* Audit logs

Redis is used for policy caching to reduce repeated database access during authorization checks.

---

# 🎓 What This Project Demonstrates

This project demonstrates practical experience with:

* Backend application architecture
* Secure REST API development
* Authentication and authorization
* Spring Security
* JWT
* Policy-based access control
* Database design
* Redis caching
* Design patterns
* Clean separation of concerns
* API design
* Audit and compliance concepts
* Performance optimization
* Automated testing

---

# 🚀 Future Improvements

* OAuth2 / OpenID Connect integration
* Multi-factor authentication
* RBAC integration
* ABAC integration
* Policy versioning and rollback
* Policy simulation and testing
* Metrics and monitoring endpoints
* Rate limiting
* GraphQL API
* Centralized observability
* Containerized deployment

---

# 👨‍💻 Author

## Raj Patil

---


⭐ If you find this project useful, consider giving it a star.
