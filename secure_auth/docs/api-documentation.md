# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <access-token>
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Body: {
  "email": "string",
  "password": "string",
  "name": "string"
}
```

#### Login
```
POST /auth/login
Body: {
  "email": "string",
  "password": "string"
}
```

#### Logout
```
POST /auth/logout
Headers: Authorization: Bearer <token>
```

#### Refresh Token
```
POST /auth/refresh
Body: {
  "refreshToken": "string"
}
```

#### Verify MFA
```
POST /auth/mfa/verify
Body: {
  "code": "string",
  "token": "string"
}
```

### Users

#### Get Current User
```
GET /users/me
Headers: Authorization: Bearer <token>
```

#### Update User
```
PUT /users/me
Headers: Authorization: Bearer <token>
Body: { ... }
```

#### Change Password
```
POST /users/me/password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Sessions

#### Get Active Sessions
```
GET /sessions
Headers: Authorization: Bearer <token>
```

#### Revoke Session
```
DELETE /sessions/:sessionId
Headers: Authorization: Bearer <token>
```

### OAuth

#### Initiate OAuth
```
GET /oauth/:provider
Query: ?redirect_uri=...
```

#### OAuth Callback
```
GET /oauth/:provider/callback
Query: ?code=...&state=...
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error


