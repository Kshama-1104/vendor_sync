# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All endpoints (except auth endpoints) require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
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
Response: {
  "token": "string",
  "refreshToken": "string",
  "user": { ... }
}
```

#### Refresh Token
```
POST /auth/refresh
Body: {
  "refreshToken": "string"
}
```

### Users

#### Get Current User
```
GET /users/me
```

#### Update Profile
```
PUT /users/me
Body: {
  "name": "string",
  "avatar": "string"
}
```

### Tasks

#### Get All Tasks
```
GET /tasks
Query: ?workspaceId=123&status=pending&assigneeId=456&page=1&limit=10
```

#### Get Task by ID
```
GET /tasks/:id
```

#### Create Task
```
POST /tasks
Body: {
  "title": "string",
  "description": "string",
  "priority": "low|medium|high|urgent",
  "dueDate": "ISO8601",
  "assigneeId": "number",
  "workspaceId": "number",
  "tags": ["string"],
  "dependencies": [number]
}
```

#### Update Task
```
PUT /tasks/:id
Body: { ... }
```

#### Update Task Status
```
PATCH /tasks/:id/status
Body: {
  "status": "todo|in-progress|review|done"
}
```

#### Add Comment
```
POST /tasks/:id/comments
Body: {
  "content": "string",
  "mentions": [number]
}
```

#### Add Attachment
```
POST /tasks/:id/attachments
Content-Type: multipart/form-data
Body: file
```

### Workflows

#### Get All Workflows
```
GET /workflows
Query: ?workspaceId=123
```

#### Create Workflow
```
POST /workflows
Body: {
  "name": "string",
  "description": "string",
  "workspaceId": "number",
  "stages": [...],
  "rules": [...]
}
```

#### Execute Workflow
```
POST /workflows/:id/execute
Body: {
  "taskId": "number",
  "context": { ... }
}
```

### Analytics

#### Get Dashboard
```
GET /analytics/dashboard
Query: ?workspaceId=123&period=7d|30d|90d
```

#### Get Task Analytics
```
GET /analytics/tasks
Query: ?workspaceId=123&startDate=...&endDate=...
```

#### Get User Performance
```
GET /analytics/users/:userId
Query: ?period=30d
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
- `500` - Internal Server Error

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authenticated: 1000 requests per 15 minutes per user


