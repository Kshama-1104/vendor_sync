# Event Models Documentation

## Event Structure

### Basic Event
```json
{
  "id": "event-id",
  "topic": "topic-name",
  "partition": 0,
  "timestamp": "2024-01-01T00:00:00Z",
  "key": "event-key",
  "value": {
    "field1": "value1",
    "field2": "value2"
  },
  "headers": {
    "source": "application",
    "version": "1.0"
  }
}
```

## Event Types

### Structured Events
- JSON schema validation
- Type-safe event handling
- Schema evolution support

### Semi-Structured Events
- Flexible schema
- Dynamic field support
- Schema inference

## Event Metadata

### Headers
- Source application
- Event version
- Correlation ID
- Trace ID
- Custom headers

### Timestamps
- Event creation time
- Ingestion time
- Processing time
- Consumption time

## Event Keys

### Key Types
- String keys
- Numeric keys
- Composite keys
- Null keys (round-robin)

### Key Usage
- Partition routing
- Event ordering
- Deduplication
- Grouping

## Best Practices

1. **Use Keys** - Use meaningful keys for partitioning
2. **Schema Validation** - Validate events against schema
3. **Headers** - Include metadata in headers
4. **Timestamps** - Use consistent timestamp format
5. **Idempotency** - Design idempotent event processing


