#  Welcome

This is a personal project to learn modern full-stack web development.

I'm currently focusing on the **backend**, using [NestJS](https://nestjs.com), with a base user system in progress.

##  Run the project (Docker)

```bash
docker  compose  up  --build
```

- Backend: http://localhost:3000

- Adminer (DB UI): http://localhost:8080

##  Project Structure

-  `/` - Docker setup and global configuration
-  `/backend` - NestJS API with authentication and user management
-  `/frontend` - (planned) web client interface

##  To do List

- Generate tokens with jti (unique ID)
- Save in Redis when it's used
- Check that it isn't already in Redis before accepting token 


- Forgot password (send recovery email)
- Block account after multiple failed attempts
- Roles and permissions

##  Stack (so far)

- Backend: NestJs, TypeScrypt
- Database: PostgreSQL 15
- Auth: JWT, Email confirmation
- DevOps: Docker + Docker Compose
- Admin: Adminer (for managing PostgreSQL)
