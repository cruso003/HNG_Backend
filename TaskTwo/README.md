# Backend Stage 2 Task: User Authentication & Organisation

This project implements user authentication and organisation management using NodeJs with Express Framework. It connects to a PostgreSQL database, provides endpoints for user registration, login, and organisation operations.

## Requirements

- Connect application to PostgreSQL database.
- Implement User and Organisation models with specified properties.
- Implement endpoints for user registration, login, and organisation management.
- Ensure validation for all fields with appropriate error responses.
- Securely hash passwords before storing.
- Use JWT for authentication and authorization.

## Endpoints

### User Registration

**Endpoint:**

```
POST /auth/register
```

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

**Failed Registration Response:**

```json
{
  "status": "Bad request",
  "message": "Registration unsuccessful",
  "statusCode": 400
}
```

### User Login

**Endpoint:**

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Successful Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJh...",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

**Failed Login Response:**

```json
{
  "status": "Bad request",
  "message": "Authentication failed",
  "statusCode": 401
}
```

### Organisation Operations

**Get User Record**

```
GET /api/users/:id
```

**Get All User's Organisations**

```
GET /api/organisations
```

**Get Single Organisation**

```
GET /api/organisations/:orgId
```

**Create Organisation**

```
POST /api/organisations
```

**Add User to Organisation**

```
POST /api/organisations/:orgId/users
```

## Unit Testing

Write unit tests to cover:

- Token generation and expiration.
- Organisation data access restrictions.
- Endpoint validations and responses.

## End-to-End Testing

Perform end-to-end tests for the `/auth/register` endpoint to cover:

- Successful user registration with default organisation creation.
- Validation errors for missing fields.
- Duplicate email or userID errors.

## Directory Structure

```
├── TaskTwo/
|   |__ config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── tests/

```