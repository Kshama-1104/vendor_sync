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

### Flows

#### Get All Flows
```
GET /flows
Query: ?status=active&version=1.0.0&page=1&limit=10
```

#### Get Flow by ID
```
GET /flows/:id
```

#### Create Flow
```
POST /flows
Body: {
  "name": "string",
  "description": "string",
  "version": "string",
  "states": [...],
  "transitions": [...]
}
```

#### Update Flow
```
PUT /flows/:id
Body: { ... }
```

#### Execute Flow
```
POST /flows/:id/execute
Body: {
  "input": {},
  "context": {}
}
```

#### Get Flow Execution History
```
GET /flows/:id/executions
Query: ?startDate=...&endDate=...
```

### States

#### Get Flow States
```
GET /flows/:flowId/states
```

#### Get State by ID
```
GET /flows/:flowId/states/:stateId
```

#### Update State
```
PUT /flows/:flowId/states/:stateId
Body: { ... }
```

### Rules

#### Get Flow Rules
```
GET /flows/:flowId/rules
```

#### Create Rule
```
POST /flows/:flowId/rules
Body: {
  "name": "string",
  "condition": "string",
  "action": "string"
}
```

#### Update Rule
```
PUT /flows/:flowId/rules/:ruleId
Body: { ... }
```

### Monitoring

#### Get Flow Execution Status
```
GET /monitoring/executions/:executionId
```

#### Get Flow Metrics
```
GET /monitoring/metrics
Query: ?flowId=...&startDate=...&endDate=...
```

#### Get Flow Visualization
```
GET /monitoring/visualization/:flowId
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


