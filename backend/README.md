# NestJS Backend

A backend project built with [NestJS](https://nestjs.com) using TypeScript. Includes ESLint, Prettier, and strict typing.

## Basic Commands

### Install dependencies

```bash
npm  install
```

### Start the server

```bash
npm  run  start:dev
```

### Linting (format and code quality)

```bash
npm  run  lint  # Auto-fix issues
npm  run  lint:check  # Only check without modifying files
```

### Run tests

```bash
npm  run  test
```

## JWT Payload Purposes

| `purpose`                     | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `session`                     | Main access token used for authenticated sessions  |
| `confirm-email`               | Used to confirm a user's email after registration  |
| `confirm-email-update`        | Used to confirm a newly requested email address    |
| `revert-email`                | Used to revert the email address to a previous one |
| `reset-password-after-revert` | Forces a password reset after an email reversion   |
