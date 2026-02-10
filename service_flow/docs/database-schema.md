# Database Schema

## Tables

### services
Service request information.

```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  service_type VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'submitted',
  workflow_id INTEGER REFERENCES workflows(id),
  requester_id INTEGER REFERENCES users(id),
  assignee_id INTEGER REFERENCES users(id),
  current_stage_id VARCHAR(100),
  sla_id INTEGER REFERENCES slas(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### workflows
Workflow definitions.

```sql
CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stages JSONB NOT NULL,
  transitions JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### approvals
Approval requests and decisions.

```sql
CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id),
  workflow_stage_id VARCHAR(100),
  approver_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  comment TEXT,
  decision_at TIMESTAMP,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### slas
SLA definitions.

```sql
CREATE TABLE slas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  service_type VARCHAR(100),
  response_time INTEGER,
  resolution_time INTEGER,
  escalation_rules JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sla_tracking
SLA compliance tracking.

```sql
CREATE TABLE sla_tracking (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id),
  sla_id INTEGER REFERENCES slas(id),
  response_deadline TIMESTAMP,
  resolution_deadline TIMESTAMP,
  response_time INTEGER,
  resolution_time INTEGER,
  status VARCHAR(50),
  breached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### audit_logs
Audit trail.

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_workflow ON services(workflow_id);
CREATE INDEX idx_services_requester ON services(requester_id);
CREATE INDEX idx_approvals_service ON approvals(service_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_sla_tracking_service ON sla_tracking(service_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```


