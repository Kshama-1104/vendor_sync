# Workflow Rules Documentation

## Overview

Task Forge includes a powerful workflow rules engine that enables automated task management based on configurable rules and conditions.

## Rule Structure

### Basic Rule Format

```json
{
  "name": "Auto-assign high priority tasks",
  "trigger": {
    "event": "task.created",
    "conditions": [
      {
        "field": "priority",
        "operator": "equals",
        "value": "high"
      }
    ]
  },
  "actions": [
    {
      "type": "assign",
      "target": "team_lead"
    },
    {
      "type": "notify",
      "recipients": ["assignee"],
      "template": "high_priority_assigned"
    }
  ]
}
```

## Trigger Types

### Event Triggers
- `task.created` - When a task is created
- `task.updated` - When a task is updated
- `task.status.changed` - When task status changes
- `task.due_date.approaching` - When due date is approaching
- `task.overdue` - When task becomes overdue

### Time Triggers
- `scheduled` - At a specific time
- `daily` - Daily at specified time
- `weekly` - Weekly on specified day

## Condition Operators

- `equals` - Field equals value
- `not_equals` - Field does not equal value
- `greater_than` - Field is greater than value
- `less_than` - Field is less than value
- `contains` - Field contains value
- `in` - Field is in array of values
- `not_in` - Field is not in array of values

## Action Types

### Task Actions
- `assign` - Assign task to user/team
- `update_status` - Change task status
- `set_priority` - Set task priority
- `add_tag` - Add tag to task
- `set_due_date` - Set due date

### Notification Actions
- `notify` - Send notification
- `email` - Send email
- `escalate` - Escalate to manager

### Workflow Actions
- `move_to_stage` - Move to workflow stage
- `trigger_workflow` - Trigger another workflow

## Examples

### Example 1: Auto-assign based on priority

```json
{
  "trigger": {
    "event": "task.created",
    "conditions": [
      {
        "field": "priority",
        "operator": "equals",
        "value": "urgent"
      }
    ]
  },
  "actions": [
    {
      "type": "assign",
      "target": "user_id_123"
    }
  ]
}
```

### Example 2: SLA enforcement

```json
{
  "trigger": {
    "event": "task.due_date.approaching",
    "conditions": [
      {
        "field": "hours_until_due",
        "operator": "less_than",
        "value": 24
      }
    ]
  },
  "actions": [
    {
      "type": "notify",
      "recipients": ["assignee", "manager"],
      "template": "due_date_reminder"
    }
  ]
}
```

### Example 3: Status automation

```json
{
  "trigger": {
    "event": "task.updated",
    "conditions": [
      {
        "field": "subtasks_completed",
        "operator": "equals",
        "value": "all"
      }
    ]
  },
  "actions": [
    {
      "type": "update_status",
      "value": "review"
    }
  ]
}
```

## Rule Evaluation

Rules are evaluated in order of priority. When a rule's conditions are met, its actions are executed. Multiple rules can be triggered for a single event.

## Best Practices

1. **Keep rules simple** - Complex rules are harder to maintain
2. **Test thoroughly** - Test rules in a safe environment first
3. **Document rules** - Add clear descriptions to rules
4. **Monitor performance** - Track rule execution and performance
5. **Review regularly** - Periodically review and optimize rules


