# Task Forge

<p align="center">
  <img src="./assets/logo.png" alt="Task Forge Logo" width="200"/>
</p>

<p align="center">
  <strong>Advanced task and workflow management platform with automation, analytics, and collaboration features</strong>
</p>

---



<p align="center">
  <img src="./assets/dashboard.png" alt="Dashboard View" width="800"/>
  <br/>
  <em>Main Dashboard - Track all your tasks at a glance</em>
</p>

<p align="center">
  <img src="./assets/kanban-board.png" alt="Kanban Board" width="800"/>
  <br/>
  <em>Kanban Board - Visualize your workflow</em>
</p>

<p align="center">
  <img src="./assets/analytics.png" alt="Analytics Dashboard" width="800"/>
  <br/>
  <em>Analytics - Gain insights into productivity</em>
</p>

---

## 🚀 Features

### 1. 👥 User & Access Management
<img src="./assets/icons/user-management.png" alt="User Management" width="40" align="left"/>

- Secure authentication (Email, OAuth, SSO)
- Role-based access control (Admin, Manager, User)
- Team and workspace creation
- Permission-based task visibility

<br/>

### 2. 📋 Task & Workflow Management
<img src="./assets/icons/task-management.png" alt="Task Management" width="40" align="left"/>

- Task creation with priority, deadlines, tags, and dependencies
- Kanban, List, and Timeline views
- Subtasks, checklists, and recurring tasks
- Custom workflow stages

<br/>

### 3. 💬 Collaboration & Communication
<img src="./assets/icons/collaboration.png" alt="Collaboration" width="40" align="left"/>

- Task-level comments and mentions
- Real-time task updates
- Activity timeline per task and project
- File attachments and inline previews

<br/>

### 4. ⚡ Automation & Rules Engine
<img src="./assets/icons/automation.png" alt="Automation" width="40" align="left"/>

- Rule-based task automation
- Auto-status updates and notifications
- SLA and deadline enforcement
- Conditional task triggers

<br/>

### 5. 📊 Progress Tracking & Analytics
<img src="./assets/icons/analytics.png" alt="Analytics" width="40" align="left"/>

- Task completion and productivity dashboards
- Workload distribution insights
- Bottleneck and delay detection
- Exportable analytics reports

<br/>

### 6. ⏱️ Time Tracking & Performance
<img src="./assets/icons/time-tracking.png" alt="Time Tracking" width="40" align="left"/>

- Manual and automated time tracking
- Task-level effort reports
- Performance comparison across users and teams
- Productivity trend analysis

<br/>

### 7. 🔔 Notifications & Alerts
<img src="./assets/icons/notifications.png" alt="Notifications" width="40" align="left"/>

- In-app, email, and push notifications
- Smart reminders and escalations
- Custom notification preferences

<br/>

### 8. 📜 Versioning & Audit Trail
<img src="./assets/icons/audit.png" alt="Audit Trail" width="40" align="left"/>

- Task change history
- Comment and file version tracking
- Full audit logs for compliance

<br/>

### 9. 🔌 Integrations & API Layer
<img src="./assets/icons/integrations.png" alt="Integrations" width="40" align="left"/>

- REST API for third-party integration
- Calendar and communication tool integration
- Webhooks and automation triggers

<br/>

### 10. 🔒 Security & Reliability
<img src="./assets/icons/security.png" alt="Security" width="40" align="left"/>

- Encrypted data storage and communication
- Session management and token security
- Backup, recovery, and failover mechanisms

<br/>

---

## 🏗️ Architecture

<p align="center">
  <img src="./assets/architecture.png" alt="System Architecture" width="800"/>
  <br/>
  <em>High-level system architecture</em>
</p>

---

## 📁 Project Structure

```
task-forge/
├── README.md
├── .env
├── .gitignore
├── package.json
├── docker-compose.yml
├── assets/                    # Images and icons for README
│   ├── logo.png
│   ├── dashboard.png
│   ├── kanban-board.png
│   ├── analytics.png
│   ├── architecture.png
│   ├── tech-stack.png
│   └── icons/
│       ├── user-management.png
│       ├── task-management.png
│       ├── collaboration.png
│       ├── automation.png
│       ├── analytics.png
│       ├── time-tracking.png
│       ├── notifications.png
│       ├── audit.png
│       ├── integrations.png
│       └── security.png
├── docs/
├── config/
├── src/
├── frontend/
└── scripts/
```

---

## 🛠️ Technology Stack

<p align="center">
  <img src="./assets/tech-stack.png" alt="Technology Stack" width="700"/>
</p>

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Bull Queue
- **Authentication**: JWT, OAuth2
- **Real-time**: WebSocket (Socket.io)
- **Testing**: Jest, Supertest

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start services**
   ```bash
   # Using Docker Compose
   docker-compose up -d
   
   # Or manually
   npm run dev
   ```

---



## 👤 Creator

- 💼 **Created by**: Kshama Mishra

---

<p align="center">
  Created by Kshama Mishra
</p>
