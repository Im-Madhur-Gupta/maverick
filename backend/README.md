# Memecoin Maverick Backend

REST API for creating, and managing AI agents that automate memecoin trading based on market and social insights.

## Tech Stack

- TypeScript
- NestJS
- PostgreSQL
- PrismaORM
- Docker

## API Documentation

The API is documented with Swagger and can be accessed at:
[https://maverick-backend.onrender.com/api](https://maverick-backend.onrender.com/api)

## Setting Up the Project Locally

### 1. Install dependencies

```bash
yarn
```

### 2. Setup environment variables

The application requires specific environment variables to function. Use the `.env.example` file as a reference to set up your `.env` file.

**Required Environment Variables:**

- `DATABASE_URL`: URL of the PostgreSQL database
- `FERE_API_KEY`: API key from FereAI (can be obtained from [FereAI Docs](https://docs.fereai.xyz/docs/api/api_access))
- `FERE_USER_ID`: User ID from FereAI
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key for AI inference
- `JWT_SECRET`: Secret key for JWT token generation and validation

### 3. Run the application locally

```bash
# Development mode
yarn start:dev
```

---

Feel free to contribute and raise issues if you encounter any problems!
