# StockFlow – Inventory Management

A multi-tenant SaaS MVP built with Next.js (App Router), MongoDB, and Mongoose following strict engineering discipline.

## Features
- **Multi-Tenant Architecture**: Complete data isolation using `organizationId`.
- **Authentication**: Custom JWT-based authentication via HTTP-only cookies.
- **Inventory Management**: Full CRUD for products with low stock triggers.
- **Dynamic Dashboard**: Activity summary combined with immediate action alerts.
- **Global Settings**: Configure default thresholds at the organization level.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Environment Setup (Deployment)

For production deployment (e.g., Vercel, Render), ensure the following environment variables are securely set:

- `MONGODB_URI`: Production MongoDB connection string.
- `JWT_SECRET`: A strong, randomly generated secret used for payload signing.

## Architecture Guidelines

- Each organization commands exactly one User (MVP restriction).
- Cross-tenant data isolation is robustly enforced through `/lib/auth.ts > requireOrganization()` for all subsequent APIs.
