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

### Services

#### Get All Services
```
GET /services
Query: ?status=open&priority=high&page=1&limit=10
```

#### Get Service by ID
```
GET /services/:id
```

#### Create Service Request
```
POST /services
Body: {
  "title": "string",
  "description": "string",
  "serviceType": "string",
  "priority": "low|medium|high|urgent",
  "workflowId": "number",
  "requesterId": "number",
  "metadata": {}
}
```

#### Update Service
```
PUT /services/:id
Body: { ... }
```

#### Update Service Status
```
PATCH /services/:id/status
Body: {
  "status": "submitted|in-progress|pending-approval|completed|cancelled"
}
```

### Workflows

#### Get All Workflows
```
GET /workflows
Query: ?active=true
```

#### Create Workflow
```
POST /workflows
Body: {
  "name": "string",
  "description": "string",
  "stages": [...],
  "transitions": [...]
}
```

#### Execute Workflow
```
POST /workflows/:id/execute
Body: {
  "serviceId": "number",
  "context": {}
}
```

### Approvals

#### Get Pending Approvals
```
GET /approvals
Query: ?userId=123&status=pending
```

#### Approve Request
```
POST /approvals/:id/approve
Body: {
  "comment": "string"
}
```

#### Reject Request
```
POST /approvals/:id/reject
Body: {
  "comment": "string",
  "reason": "string"
}
```

### SLA

#### Get SLA Status
```
GET /sla/status
Query: ?serviceId=123
```

#### Get SLA Violations
```
GET /sla/violations
Query: ?startDate=...&endDate=...
```

### Analytics

#### Get Dashboard
```
GET /analytics/dashboard
Query: ?period=7d|30d|90d
```

#### Get Service Analytics
```
GET /analytics/services
Query: ?startDate=...&endDate=...
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


