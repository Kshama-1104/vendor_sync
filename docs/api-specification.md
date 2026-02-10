# API Specification

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
  "name": "string",
  "role": "admin|vendor|user"
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

### Vendors

#### Get All Vendors
```
GET /vendors
Query: ?page=1&limit=10&status=active
```

#### Get Vendor by ID
```
GET /vendors/:id
```

#### Create Vendor
```
POST /vendors
Body: {
  "name": "string",
  "email": "string",
  "type": "supplier|service_provider|partner",
  "integrationType": "api|ftp|webhook|file",
  "config": { ... }
}
```

#### Update Vendor
```
PUT /vendors/:id
Body: { ... }
```

#### Delete Vendor
```
DELETE /vendors/:id
```

### Synchronization

#### Get Sync Status
```
GET /sync/status
Query: ?vendorId=123&type=inventory
```

#### Trigger Manual Sync
```
POST /sync/trigger
Body: {
  "vendorId": "number",
  "type": "inventory|pricing|order|all",
  "force": "boolean"
}
```

#### Get Sync History
```
GET /sync/history
Query: ?vendorId=123&startDate=2024-01-01&endDate=2024-12-31
```

#### Get Sync Logs
```
GET /sync/logs/:syncId
```

### Inventory

#### Get Inventory
```
GET /inventory
Query: ?vendorId=123&sku=ABC123&page=1&limit=10
```

#### Sync Inventory
```
POST /inventory/sync
Body: {
  "vendorId": "number",
  "products": [ ... ]
}
```

#### Update Inventory
```
PUT /inventory/:id
Body: {
  "quantity": "number",
  "reserved": "number"
}
```

### Orders

#### Get Orders
```
GET /orders
Query: ?vendorId=123&status=pending&page=1
```

#### Create Order
```
POST /orders
Body: {
  "vendorId": "number",
  "items": [ ... ],
  "expectedDelivery": "date"
}
```

#### Update Order Status
```
PATCH /orders/:id/status
Body: {
  "status": "pending|confirmed|shipped|delivered|cancelled"
}
```

### Analytics

#### Get Dashboard Data
```
GET /analytics/dashboard
Query: ?vendorId=123&period=7d|30d|90d
```

#### Get Sync Metrics
```
GET /analytics/sync-metrics
Query: ?vendorId=123&startDate=...&endDate=...
```

#### Get Vendor Performance
```
GET /analytics/vendor-performance/:vendorId
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


