# 🚀 Full-Stack Project

This is a personal project focused on learning and implementing modern full-stack web development.  
Currently, the backend is the main focus, built using [NestJS](https://nestjs.com) with robust user authentication and email workflows.


##  🐳 Run the project (Docker)

```bash
docker  compose  up  --build
```

- Backend: http://localhost:3000

- Adminer (DB UI): http://localhost:8080

> Make sure to set up .env files

## 📁 Project Structure

-  `/` - Docker setup and global configuration
-  `/backend` - NestJS API with authentication and user management
-  `/frontend` - (planned) web client interface

## 📌 Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL 15
- **Authentication**: JWT + Email confirmation + single-use tokens (JTI)
- **Token Registry & Lockouts**: Redis
- **DevOps**: Docker + Docker Compose
- **Admin Tools**: Adminer (PostgreSQL)

## 🔑 Auth Features

- User registration and login with JWT sessions
- Email confirmation (on signup and when changing email)
- Password reset (with single-use links)
- Revert email change
- Account lockout after multiple failed login attempts
- Unlock account via email link
- Redis token invalidation via jti

## 🧪 Local Development Tools

Even though Docker runs everything, the following commands can be useful for local-only tasks:

### ✅ Lint

```bash
npm run lint         # Auto-fix issues
npm run lint:check   # Check only
```

### 🧪 Test

```bash
npm run test
```

## 🗂️ To do List
- Move these endpoints from `/users` to `/auth`:

`/request-confirmation-email`
`/request-password-reset`
`/request-unlock`
`/reset-password-after-revert`

- Roles and permissions
- Add audit logs (user deletions, email changes, etc.)
- Implement frontend in `/frontend`

## 🙋‍♂️ Author

Made by me `@benlox`
