# 🚀 Prowider Mini Lead Distribution System

A full-stack lead allocation and provider distribution platform inspired by real-world marketplace systems like Prowider.

The system allows customers to submit service enquiries, automatically distributes leads to providers using predefined business rules, maintains fair provider rotation, prevents duplicate leads, and updates provider dashboards in real time.

Built using Next.js, Prisma, PostgreSQL, and Server-Sent Events (SSE), the application focuses heavily on backend engineering correctness, concurrency handling, allocation fairness, realtime synchronization, and database consistency.

---

# 🌐 Live Demo

https://prowider-mini-lead-system-black.vercel.app/?utm_source=chatgpt.com

---

# 📂 GitHub Repository

(https://github.com/Jharwal77/prowider-mini-lead-system)

---

# ✨ Features

## 📝 Public Customer Lead Submission
- Customer enquiry form
- Service selection
- Lead persistence in PostgreSQL
- Automatic provider allocation

---

## 🚫 Duplicate Lead Prevention
- Same phone number cannot create duplicate lead for same service
- Enforced at database level
- Prisma composite unique constraint

---

## ⚙️ Automatic Lead Distribution
- Exactly 3 providers assigned per lead
- Mandatory provider assignment rules
- Persistent round-robin allocation
- Fair provider rotation
- Quota-aware assignment system

---

## 🔄 Fair Allocation Logic
- Persistent allocation state stored in database
- No random assignment
- Prevents provider favoritism
- Rotation survives server restart

---

## 📊 Provider Dashboard
- Remaining quota tracking
- Assigned leads list
- Lead count per provider
- Live database data

---

## ⚡ Real-Time Dashboard Updates
- Implemented using Server-Sent Events (SSE)
- Automatic dashboard refresh
- No manual page reload required

---

## 🔐 Webhook Idempotency
- Duplicate webhook prevention
- Idempotency key validation
- Safe quota reset simulation

---

## 🧪 System Testing Tools
Dedicated testing panel for:
- duplicate lead testing
- concurrency testing
- webhook testing

---

# 🛠️ Tech Stack

## Frontend
- Next.js 16
- React 19
- Tailwind CSS

## Backend
- Next.js Route Handlers
- Prisma ORM

## Database
- PostgreSQL (Neon)

## Realtime Communication
- Server-Sent Events (SSE)

---

# 📁 Project Structure

```txt
prowider-mini-lead-system/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── services/
│   │   │   ├── sse/
│   │   │   └── webhook/
│   │   │
│   │   ├── dashboard/
│   │   ├── request-service/
│   │   └── test-tools/
│   │
│   └── lib/
│       └── sse.js
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── eslint.config.mjs
└── postcss.config.mjs
```

---

# ⚙️ Business Rules

## Mandatory Provider Rules

| Service | Mandatory Providers |
|---|---|
| Service 1 | Provider 1 |
| Service 2 | Provider 5 |
| Service 3 | Provider 1 and Provider 4 |

Each lead must be assigned to exactly 3 providers.

---

# 🔄 Fair Distribution Pools

## Service 1
- Provider 2
- Provider 3
- Provider 4

## Service 2
- Provider 6
- Provider 7
- Provider 8

## Service 3
- Provider 2
- Provider 3
- Provider 5
- Provider 6
- Provider 7
- Provider 8

---

# 🧠 Allocation Algorithm

The system uses a persistent round-robin allocation strategy.

## Allocation Flow

1. Create lead
2. Assign mandatory providers
3. Check provider quotas
4. Rotate through provider pool
5. Persist allocation index
6. Broadcast realtime dashboard update

This ensures:
- fair distribution
- deterministic behavior
- no repeated favoritism
- quota-safe allocation

---

# 🔐 Duplicate Prevention

Duplicate leads are prevented using Prisma composite unique constraints.

## Prisma Constraint

```prisma
@@unique([phone, serviceId])
```

This guarantees:
- database-level protection
- concurrency safety
- reliable duplicate prevention

---

# ⚡ Concurrency Handling

The system was designed to behave correctly under simultaneous requests.

Implemented using:
- Prisma transactions
- atomic database operations
- persistent allocation state
- database constraints

This prevents:
- race conditions
- inconsistent allocation
- duplicate assignments
- quota overflow

---

# 📡 Real-Time Updates

Realtime provider dashboard synchronization is implemented using SSE.

## Technologies Used
- EventSource API
- ReadableStream
- custom publish/subscribe system

Dashboard updates automatically whenever:
- new lead is submitted
- provider assignment occurs

---

# 🔔 Webhook Idempotency

Webhook requests are protected using idempotency keys.

## Flow

1. Receive webhook request
2. Check existing idempotency key
3. Ignore duplicate events
4. Reset quotas only once

Implemented using:
- WebhookEvent database table
- Prisma unique validation

---

# 🗄️ Database Design

## Main Tables

| Table | Purpose |
|---|---|
| Service | Stores available services |
| Provider | Stores provider data |
| Lead | Stores customer enquiries |
| LeadAssignment | Maps leads to providers |
| AllocationState | Stores round-robin state |
| WebhookEvent | Stores processed webhook events |

---

# 🔗 API Routes

| Route | Purpose |
|---|---|
| `/api/services` | Fetch available services |
| `/api/leads` | Create lead and assign providers |
| `/api/dashboard` | Fetch provider dashboard data |
| `/api/sse` | Realtime event stream |
| `/api/webhook/reset-quota` | Reset provider quotas |

---

# 🌐 Application Routes

| Route | Description |
|---|---|
| `/request-service` | Public customer form |
| `/dashboard` | Provider dashboard |
| `/test-tools` | System testing panel |

---

# 🧪 Testing Features

The application includes dedicated testing tools for:

## Duplicate Lead Testing
Validates:
- database uniqueness constraints
- duplicate prevention logic

---

## Concurrent Request Testing
Validates:
- transaction safety
- allocation consistency
- concurrency handling

---

## Webhook Idempotency Testing
Validates:
- webhook safety
- duplicate event prevention
- quota reset protection

---

# ⚙️ Environment Variables

Create a `.env` file in project root:

```env
DATABASE_URL="your_postgresql_connection_string"
```

---

# 🚀 Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Jharwal77/prowider-mini-lead-system
cd prowider-mini-lead-system
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Generate Prisma Client

```bash
npx prisma generate
```

---

## 4. Run Database Migration

```bash
npx prisma migrate dev
```

---

## 5. Seed Database

```bash
node prisma/seed.js
```

This inserts:
- services
- providers
- allocation state

---

## 6. Start Development Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:3000
```

---

# 🧪 System Testing

## Test Duplicate Prevention

Open:
```txt
/test-tools
```

Click:
```txt
Test Duplicate Prevention
```

Expected:
- duplicate lead blocked
- database unique constraint triggered

---

## Test Concurrent Requests

Click:
```txt
Test Concurrent Requests
```

Expected:
- multiple simultaneous leads processed correctly
- no race conditions
- fair allocation maintained

---

## Test Webhook Idempotency

Click:
```txt
Test Webhook Idempotency
```

Expected:
- first webhook resets quotas
- repeated webhook ignored safely

---

## Test Real-Time Dashboard

1. Open `/dashboard`
2. Open `/request-service`
3. Submit new lead

Expected:
- dashboard updates automatically without refresh

---

# 📌 Engineering Focus

This project intentionally prioritizes:
- backend correctness
- allocation reliability
- database consistency
- concurrency safety
- realtime synchronization
- production-style architecture

The implementation focuses on engineering quality over advanced UI styling.

---

# 🚀 Future Improvements

Potential future enhancements:
- provider authentication
- admin analytics dashboard
- automatic monthly quota scheduler
- websocket scaling
- retry queues
- provider ranking system
- advanced allocation algorithms
- audit logging
- rate limiting

---

# 🌍 Deployment

## Frontend
- Vercel

## Database
- Neon PostgreSQL

---

# 👨‍💻 Author

Rahul Meena
Full Stack Developer

