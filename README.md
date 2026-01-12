# Policy-Based Access Control (PBAC) System

An enterprise-grade, production-ready authorization system built with **Java 17** and **Spring Boot 3**, implementing dynamic policy-driven access control with runtime evaluation, caching, and comprehensive audit logging.

## 🏗️ Architecture Overview

### Clean Layered Architecture

```
┌─────────────────────────────────────────────────┐
│         REST API Controllers (HTTP)             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│    Security Filters (JWT, Authorization)       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│      Application Services (Business Logic)     │
├─────────────────────────────────────────────────┤
│ • AuthenticationService                        │
│ • PolicyService                                │
│ • AuditService                                 │
│ • UserService                                  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│        Domain Layer (Entities & Logic)         │
├─────────────────────────────────────────────────┤
│ • PolicyEvaluationEngine                       │
│ • Condition Evaluation                         │
│ • Authorization Context Model                  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│    Infrastructure (DB, Cache, Security)        │
├─────────────────────────────────────────────────┤
│ • JPA Repositories                             │
│ • Redis Caching                                │
│ • JWT Token Provider                           │
└─────────────────────────────────────────────────┘
```

## 🔐 Key Features

### 1. **JWT-Based Authentication**
- Secure signup/login with BCrypt password hashing
- Access and refresh token generation
- Token validation and user context extraction

### 2. **Dynamic Policy Management**
- CRUD operations on authorization policies
- JSON-based policy definition with flexible subject, resource, and action attributes
- Priority-based policy evaluation
- Policy caching with Redis for high performance

### 3. **Advanced Policy Evaluation Engine**
- **Strategy Pattern**: Pluggable evaluation strategies for different policy types
- **Chain of Responsibility**: Condition evaluation chains
- **Builder Pattern**: Policy object construction
- Runtime evaluation of multiple policies
- DENY-overrides-ALLOW conflict resolution strategy
- Default deny if no policies match

### 4. **Spring Security Integration**
- JWT authentication filter for token extraction
- Authorization filter intercepts protected endpoints
- Policy evaluation before controller execution
- Centralized exception handling

### 5. **Immutable Audit Logging**
- Append-only audit trail for compliance
- Detailed logging of all authorization decisions
- Request context capture for debugging
- Queryable by user, resource, action, timestamp

### 6. **Separation of Concerns**
- **Controllers**: HTTP request handling and routing
- **Services**: Business logic and orchestration
- **Repositories**: Data access abstraction
- **Mappers**: DTO/Entity conversion
- **Engines**: Domain-specific evaluation logic

## 📦 Project Structure

```
src/main/java/com/enterprise/pbac/
├── api/
│   ├── controller/           # REST endpoints
│   ├── dto/                  # Data Transfer Objects
│   └── exception/            # Global exception handling
├── application/
│   ├── service/              # Application services
│   └── exception/            # Custom exceptions
├── domain/
│   ├── entity/               # JPA entities
│   ├── enums/                # Domain enums
│   └── engine/               # Policy evaluation engine
│       ├── condition/        # Condition interfaces and implementations
│       ├── strategy/         # Evaluation strategies
│       └── model/            # Evaluation context and results
├── infrastructure/
│   ├── repository/           # JPA repositories
│   ├── mapper/               # DTO mappers
│   ├── cache/                # Redis caching
│   ├── config/               # Spring configuration
│   └── security/             # Security components
└── PbacSystemApplication.java
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- PostgreSQL 12+
- Redis 6.0+
- Maven 3.8+

### Setup

1. **Clone and Install**
```bash
git clone <repository>
cd pbac-system
mvn clean install
```

2. **Configure Database**
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pbac_db
    username: postgres
    password: postgres
```

3. **Configure JWT Secret**
```bash
export JWT_SECRET="your-production-secret-key-min-32-chars"
```

4. **Run the Application**
```bash
mvn spring-boot:run
```

Application starts on `http://localhost:8080`

## 🔑 API Endpoints

### Authentication

**Sign Up**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Refresh Token**
```bash
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

### Policy Management

**Create Policy**
```bash
POST /api/policies
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Admin Resource Access",
  "description": "Allow admin users to access sensitive resources",
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

**Get Policy**
```bash
GET /api/policies/{policyId}
Authorization: Bearer <access_token>
```

**Update Policy**
```bash
PUT /api/policies/{policyId}
Authorization: Bearer <access_token>
```

**Delete Policy**
```bash
DELETE /api/policies/{policyId}
Authorization: Bearer <access_token>
```

**List Policies**
```bash
GET /api/policies
Authorization: Bearer <access_token>
```

### Authorization

**Check Authorization**
```bash
POST /api/authorization/check
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "resource": "database",
  "action": "READ",
  "context": {
    "ipAddress": "192.168.1.1"
  }
}
```

### Audit

**Get User Audit Logs**
```bash
GET /api/audit/user/{userId}?page=0&size=10
Authorization: Bearer <access_token>
```

**Get Denied Authorizations**
```bash
GET /api/audit/denied?page=0&size=10
Authorization: Bearer <access_token>
```

## 🔄 Authorization Flow

```
1. User Request
   ↓
2. JwtAuthenticationFilter
   → Extract and validate JWT token
   → Set user context (userId, email)
   ↓
3. AuthorizationFilter
   → Extract resource and action from request
   → Build AuthorizationContext
   ↓
4. PolicyEvaluationEngine
   → Fetch applicable policies (cached)
   → Evaluate DENY policies first
   → Evaluate ALLOW policies
   → Default to DENY
   ↓
5. AuditService
   → Log authorization decision
   → Store in audit trail
   ↓
6. Response
   → Allow or deny with reason
```

## 📋 Policy Definition Format

```json
{
  "name": "Policy Name",
  "effect": "ALLOW|DENY",
  "priority": 0,
  "subject": {
    "role": "admin|user|*",
    "department": "engineering|sales|*"
  },
  "resource": "database|files|api",
  "action": "READ|WRITE|DELETE|*",
  "conditions": {
    "timeRange": {
      "start": "HH:MM",
      "end": "HH:MM"
    },
    "ipRange": "192.168.1.0/24"
  }
}
```

## 🎯 Design Patterns Used

1. **Strategy Pattern**: `PolicyEvaluationStrategy` for pluggable evaluation logic
2. **Chain of Responsibility**: `Condition` interface for condition evaluation chains
3. **Builder Pattern**: `AuthorizationContext` and `PolicyEvaluationResult` builders
4. **Repository Pattern**: Data access abstraction with Spring Data JPA
5. **DTO Pattern**: Separation of internal entities from API contracts
6. **Mapper Pattern**: Clean conversion between entities and DTOs

## 🔒 Security Features

- **Password Security**: BCrypt hashing with salt
- **Token Security**: HS512 JWT signing with rotation support
- **SQL Injection Prevention**: Parameterized queries via JPA
- **XSS Prevention**: Proper JSON encoding in responses
- **CSRF Protection**: Stateless authentication (no cookies)
- **Audit Trail**: Immutable logging for compliance

## 📊 Database Schema Highlights

- **Users**: User accounts with email uniqueness
- **User Attributes**: Flexible key-value store for custom attributes
- **Policies**: Authorization rules with JSON-based definitions
- **Audit Logs**: Immutable append-only authorization log
- **Indexes**: Optimized for policy evaluation and audit queries

## ⚡ Performance Optimizations

- **Redis Caching**: Policy cache with TTL-based invalidation
- **Batch Processing**: Efficient policy evaluation
- **Connection Pooling**: HikariCP with optimized parameters
- **Database Indexes**: Strategic indexes on hot query paths
- **Lazy Loading**: Optimized entity relationships

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn clean test jacoco:report
```

## 📝 Configuration

See `application.yml` for:
- Database connection pooling
- Redis caching parameters
- JWT token expiration
- Logging levels
- Spring JPA settings

## 🚀 Production Deployment

1. Set strong JWT secret
2. Use PostgreSQL connection pooling
3. Enable Redis cluster for high availability
4. Configure HTTPS/TLS
5. Set up centralized logging
6. Enable monitoring and alerting
7. Implement rate limiting

## 📚 Further Enhancements

- [ ] OAuth2/OIDC integration
- [ ] Multi-factor authentication
- [ ] Role-based access control (RBAC)
- [ ] Attribute-based access control (ABAC)
- [ ] Policy versioning and rollback
- [ ] GraphQL API
- [ ] Metrics and monitoring endpoints
- [ ] Policy simulation and testing

## 📄 License

Enterprise Commercial License

## 👨‍💼 Support

For issues and feature requests, create an issue in the repository.

---

**Built with enterprise-grade practices for production readiness.**
