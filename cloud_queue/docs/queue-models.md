# Queue Models Documentation

## Queue Types

### Standard Queue
Basic queue with FIFO or non-FIFO ordering.

**Characteristics:**
- Simple message ordering
- No priority support
- Standard delivery guarantees
- Best for: Simple task processing

### Priority Queue
Queue with priority-based message ordering.

**Characteristics:**
- Multiple priority levels (1-10)
- High-priority messages processed first
- Priority can be set per message
- Best for: Mixed priority workloads

### Delay Queue
Queue with scheduled message delivery.

**Characteristics:**
- Messages delayed until specified time
- Time-based activation
- Supports absolute and relative delays
- Best for: Scheduled tasks, reminders

### FIFO Queue
First-In-First-Out queue with strict ordering.

**Characteristics:**
- Strict message ordering
- Exactly-once delivery
- Message groups and deduplication
- Best for: Ordered processing

## Message Attributes

### Standard Attributes
- **MessageId**: Unique message identifier
- **Body**: Message content
- **Attributes**: Custom metadata
- **Timestamp**: Creation timestamp
- **Priority**: Message priority (for priority queues)

### Delivery Attributes
- **VisibilityTimeout**: Time message is hidden after delivery
- **ReceiveCount**: Number of times message received
- **MaxReceiveCount**: Maximum receive attempts before DLQ
- **DelaySeconds**: Delay before message becomes available

## Queue Configuration

### Basic Configuration
```json
{
  "name": "my-queue",
  "type": "standard",
  "fifo": false,
  "maxMessageSize": 262144,
  "messageRetentionPeriod": 345600,
  "visibilityTimeout": 30,
  "receiveMessageWaitTime": 0
}
```

### Priority Queue Configuration
```json
{
  "name": "priority-queue",
  "type": "priority",
  "maxPriority": 10,
  "defaultPriority": 5
}
```

### Delay Queue Configuration
```json
{
  "name": "delay-queue",
  "type": "delay",
  "maxDelay": 900,
  "defaultDelay": 0
}
```

## Delivery Modes

### At-Least-Once
- Message may be delivered multiple times
- Higher throughput
- Requires idempotent processing
- Default mode

### Exactly-Once
- Message delivered exactly once
- Lower throughput
- Requires FIFO queue
- More complex implementation

## Best Practices

1. **Choose Right Queue Type** - Select based on use case
2. **Set Appropriate Timeouts** - Balance between reliability and performance
3. **Use DLQ** - Handle failed messages gracefully
4. **Monitor Metrics** - Track queue depth and latency
5. **Scale Workers** - Scale consumers based on queue depth


