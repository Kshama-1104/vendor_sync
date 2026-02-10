# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All endpoints require authentication via API key or JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```
or
```
X-API-Key: <your-api-key>
```

## Endpoints

### Queues

#### Create Queue
```
POST /queues
Body: {
  "name": "string",
  "type": "standard|priority|delay|fifo",
  "fifo": "boolean",
  "maxMessageSize": "number",
  "messageRetentionPeriod": "number",
  "visibilityTimeout": "number"
}
```

#### Get Queue
```
GET /queues/:name
```

#### List Queues
```
GET /queues
Query: ?prefix=my-queue&page=1&limit=10
```

#### Delete Queue
```
DELETE /queues/:name
```

#### Purge Queue
```
POST /queues/:name/purge
```

#### Pause Queue
```
POST /queues/:name/pause
```

#### Resume Queue
```
POST /queues/:name/resume
```

### Messages

#### Send Message
```
POST /queues/:queueName/messages
Body: {
  "body": "string|object",
  "attributes": {},
  "priority": "number",
  "delaySeconds": "number",
  "messageGroupId": "string"
}
```

#### Send Batch Messages
```
POST /queues/:queueName/messages/batch
Body: {
  "messages": [
    {
      "body": "string",
      "attributes": {}
    }
  ]
}
```

#### Receive Messages
```
GET /queues/:queueName/messages
Query: ?maxMessages=10&waitTimeSeconds=20&visibilityTimeout=30
```

#### Delete Message
```
DELETE /queues/:queueName/messages/:receiptHandle
```

#### Change Message Visibility
```
POST /queues/:queueName/messages/:receiptHandle/visibility
Body: {
  "visibilityTimeout": "number"
}
```

### Workers

#### Register Worker
```
POST /workers
Body: {
  "name": "string",
  "queues": ["string"],
  "concurrency": "number"
}
```

#### Get Worker Status
```
GET /workers/:id
```

#### List Workers
```
GET /workers
```

#### Scale Workers
```
POST /workers/scale
Body: {
  "queueName": "string",
  "targetCount": "number"
}
```

### Metrics

#### Get Queue Metrics
```
GET /metrics/queues/:queueName
Query: ?startDate=...&endDate=...
```

#### Get Worker Metrics
```
GET /metrics/workers
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


