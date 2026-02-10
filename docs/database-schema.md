# Database Schema

## Tables

### vendors
Stores vendor information and configuration.

```sql
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- supplier, service_provider, partner
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, inactive, suspended
  integration_type VARCHAR(50) NOT NULL, -- api, ftp, webhook, file
  config JSONB,
  api_key VARCHAR(255),
  api_secret TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products
Product catalog information.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vendor_id, sku)
);
```

### inventory
Inventory levels and stock information.

```sql
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  vendor_id INTEGER REFERENCES vendors(id),
  quantity INTEGER DEFAULT 0,
  reserved INTEGER DEFAULT 0,
  available INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### pricing
Pricing information and history.

```sql
CREATE TABLE pricing (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  vendor_id INTEGER REFERENCES vendors(id),
  unit_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  contract_price DECIMAL(10,2),
  effective_from TIMESTAMP,
  effective_to TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### orders
Purchase orders and order information.

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  expected_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### order_items
Order line items.

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sync_logs
Synchronization operation logs.

```sql
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  sync_type VARCHAR(50) NOT NULL, -- inventory, pricing, order, catalog
  status VARCHAR(50) NOT NULL, -- success, failed, partial
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sync_jobs
Scheduled and queued sync jobs.

```sql
CREATE TABLE sync_jobs (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id),
  sync_type VARCHAR(50) NOT NULL,
  schedule_type VARCHAR(50), -- manual, scheduled, event
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
  priority INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### audit_logs
Audit trail for all operations.

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  action VARCHAR(50) NOT NULL, -- create, update, delete, sync
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_type ON vendors(type);
CREATE INDEX idx_products_vendor_sku ON products(vendor_id, sku);
CREATE INDEX idx_inventory_vendor ON inventory(vendor_id);
CREATE INDEX idx_orders_vendor_status ON orders(vendor_id, status);
CREATE INDEX idx_sync_logs_vendor_type ON sync_logs(vendor_id, sync_type);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```


