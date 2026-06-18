
# Support Ticket & SLA Tracking System 
 Clone the repository
 
Quick start (clean clone)
 
1. Database
Create the database and load schema + seed data:

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sla CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Apply schema and seed (run from repo root)
mysql -u root -p sla < database/schema.sql
mysql -u root -p sla < database/seed.sql


(Frontend)

A  frontend for a Support Ticketing system with SLA tracking

It connects to a Node.js + MySQL backend and provides ticket management, SLA monitoring, dashboard analytics, and agent assignment features.

## Tech Stack

- React 18
- Vite
- React Router v6
- Axios
- Plain CSS (no UI libraries)

---

## Features

### Dashboard
- Tickets by status
- Tickets by priority
- SLA breached count
- SLA at-risk count
- Recent breached tickets overview

### Ticket Management
- Create new tickets
- View ticket list with filters
- Search tickets by subject
- Pagination support
- View full ticket details

### Ticket Details
- Ticket information (subject, description, status, priority)
- Assign agent
- Change ticket status
- Add comments
- SLA timeline view

### SLA Tracking
- On Track / At Risk / Breached states
- Visual SLA badges
- Highlight breached and at-risk tickets
- Real-time SLA state calculation on frontend



## Project Structure    

src/
api/ # API layer (Axios client + endpoints)
components/ # Reusable UI components
hooks/ # Custom React hooks
pages/ # Route pages
utils/ # Helper functions (SLA logic, formatting)
App.tsx
main.tsx

---

## Getting Started

###


cd client
npm install

Create a .env.local file:

VITE_API_BASE_URL=http://localhost:3000

For production:

VITE_API_BASE_URL=http://localhost:3000

npm run dev

http://localhost:3001


# Backend

A production-ready REST API for managing support tickets with automated SLA tracking and priority escalation.

## Technology Stack

- Node.js
- Express
- MySQL
- node-cron
- Joi validation



## Features

- Create and manage support tickets
- Assign agents to tickets
- Add comments to tickets
- SLA tracking with warning and breach detection
- Automatic priority escalation
- Dashboard statistics
- Pagination and filtering
- Validation for all endpoints

## SLA Rules

- Urgent: 2 hours
- High: 8 hours  
- Medium: 24 hours
- Low: 72 hours



## Getting Started

1. cd server
2. Copy `.env.example` to `.env` and update with your database credentials
3. Run `npm install`
4. Run the schema.sql file to create the database and tables
5. Start the server: `npm start` or `npm run dev` for development

## API Endpoints

### Tickets

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - List tickets with pagination and filters
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id/status` - Update ticket status
- `PUT /api/tickets/:id/assign` - Assign agent to ticket
- `POST /api/tickets/:id/comments` - Add comment to ticket

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities


Cron Job
The SLA tracking cron job runs every 5 minutes and handles:

Warning detection (80% SLA consumed)

Breach detection (100% SLA consumed)

Priority escalation

Duplicate event prevention

