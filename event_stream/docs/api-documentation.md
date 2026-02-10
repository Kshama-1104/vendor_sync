# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All endpoints require authentication via JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Endpoints

### Topics

#### Create Topic
```
POST /topics
Body: {
  "name": "string",
  "partitions": "number",
  "replicationFactor": "number",
  "retentionMs": "number"
}
```

#### Get Topic
```
GET /topics/:name
```

#### List Topics
```
GET /topics
```

#### Delete Topic
```
DELETE /topics/:name
```

### Events

#### Produce Event
```
POST /topics/:topicName/events
Body: {
  "key": "string",
  "value": {},
  "headers": {}
}
```

#### Produce Batch
```
POST /topics/:topicName/events/batch
Body: {
  "events": [...]
}
```

#### Consume Events
```
GET /topics/:topicName/events
Query: ?consumerGroup=...&partition=...&offset=...
```

### Consumer Groups

#### Create Consumer Group
```
POST /consumer-groups
Body: {
  "name": "string",
  "topics": ["string"]
}
```

#### Get Consumer Group
```
GET /consumer-groups/:name
```

#### Commit Offset
```
POST /consumer-groups/:name/offsets
Body: {
  "topic": "string",
  "partition": "number",
  "offset": "number"
}
```

### Metrics

#### Get Topic Metrics
```
GET /metrics/topics/:topicName
```

#### Get Consumer Metrics
```
GET /metrics/consumers/:consumerGroup
```

#### Get System Metrics
```
GET /metrics/system
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


