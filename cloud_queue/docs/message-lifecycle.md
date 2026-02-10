# Message Lifecycle Documentation

## Message States

### 1. Pending
Message is in queue waiting to be consumed.

**Transitions:**
- Pending → Visible (when delay expires)
- Pending → Deleted (if queue is purged)

### 2. Visible
Message is available for consumption.

**Transitions:**
- Visible → In-Flight (when received by consumer)
- Visible → Deleted (if queue is purged)

### 3. In-Flight
Message has been received by a consumer but not yet acknowledged.

**Transitions:**
- In-Flight → Processed (when acknowledged)
- In-Flight → Visible (if visibility timeout expires)
- In-Flight → DLQ (if max receive count exceeded)

### 4. Processed
Message has been successfully processed and acknowledged.

**Transitions:**
- Processed → Archived (after retention period)

### 5. DLQ (Dead Letter Queue)
Message has failed processing multiple times.

**Transitions:**
- DLQ → Retry (manual retry)
- DLQ → Deleted (manual deletion)

## Lifecycle Flow

```
┌─────────┐
│ Pending │
└────┬────┘
     │ (delay expires)
     ▼
┌─────────┐
│ Visible │
└────┬────┘
     │ (received)
     ▼
┌───────────┐
│ In-Flight │
└────┬──────┘
     │
     ├─── (acknowledged) ───► ┌──────────┐
     │                        │ Processed│
     │                        └──────────┘
     │
     ├─── (timeout) ─────────► ┌─────────┐
     │                        │ Visible │
     │                        └─────────┘
     │
     └─── (max retries) ─────► ┌─────┐
                               │ DLQ │
                               └─────┘
```

## Visibility Timeout

### Purpose
Prevents other consumers from receiving the same message while it's being processed.

### Behavior
- Message becomes invisible when received
- Returns to visible state if not acknowledged within timeout
- Default: 30 seconds
- Configurable per queue and per message

### Best Practices
- Set timeout based on expected processing time
- Extend timeout for long-running tasks
- Use ChangeMessageVisibility API to extend timeout

## Message Acknowledgment

### Acknowledgment Types

#### Explicit Acknowledgment
Consumer must explicitly acknowledge message after processing.

#### Automatic Acknowledgment
Message automatically acknowledged after visibility timeout.

### Acknowledgment Flow
1. Consumer receives message
2. Message becomes in-flight
3. Consumer processes message
4. Consumer sends acknowledgment
5. Message marked as processed

## Dead Letter Queue

### When Messages Move to DLQ
- Max receive count exceeded
- Message processing fails repeatedly
- Manual move by administrator

### DLQ Configuration
```json
{
  "maxReceiveCount": 3,
  "dlqName": "my-dlq",
  "dlqRetentionPeriod": 345600
}
```

### DLQ Management
- Review failed messages
- Retry messages manually
- Analyze failure patterns
- Update processing logic

## Retry Strategy

### Exponential Backoff
- Initial delay: 1 second
- Max delay: 300 seconds
- Backoff multiplier: 2

### Retry Configuration
```json
{
  "maxRetries": 3,
  "initialDelay": 1000,
  "maxDelay": 300000,
  "backoffMultiplier": 2
}
```

## Best Practices

1. **Set Appropriate Timeouts** - Match processing time
2. **Handle Failures Gracefully** - Use DLQ for failed messages
3. **Monitor Message Age** - Track message lifecycle
4. **Use Batch Operations** - Improve throughput
5. **Implement Idempotency** - Handle duplicate messages


