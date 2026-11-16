# Car Value API

A REST API built with **NestJS** that estimates the market value of a used car from price reports submitted by users. Reports are reviewed by admins, and only approved reports count toward an estimate.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?logo=typeorm&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

## Features

- **Authentication:** sign up, sign in and sign out with cookie-based sessions. Passwords are hashed with salted `scrypt`.
- **Price reports:** signed-in users submit what they paid for a car (make, model, year, mileage, location, price).
- **Admin approval:** an admin guard protects the endpoint that approves or rejects reports.
- **Estimates:** the estimate averages approved reports for the same make and model, of a similar year and location, giving priority to cars with similar mileage.
- **Clean responses:** a custom `@Serialize()` interceptor uses DTOs to control exactly which fields leave the API (for example, password hashes are never returned).
- **Validation:** a global `ValidationPipe` with whitelisting and `class-validator` DTOs.
- **Per-environment config:** `@nestjs/config` loads `.env.development` or `.env.test`, each with its own SQLite database.

## Architecture

```
src/
├── users/          # Users module: auth service, current-user middleware, interceptor and decorator
├── reports/        # Reports module: create, approve and estimate
├── guards/         # AuthGuard and AdminGuard
└── interceptors/   # Serialize interceptor (DTO-based response shaping)
test/               # End-to-end tests (Supertest)
```

## API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Create an account and start a session |
| `POST` | `/auth/signin` | Public | Sign in |
| `POST` | `/auth/signout` | Public | End the session |
| `GET` | `/auth/whoami` | Signed in | Return the current user |
| `POST` | `/reports` | Signed in | Submit a price report |
| `PATCH` | `/reports/:id` | Admin | Approve or reject a report |
| `GET` | `/reports?make=&model=&year=&mileage=&lng=&lat=` | Public | Get a price estimate |

Sample requests are in `src/users/requests.http` and `src/reports/requests.http` (VS Code REST Client).

## Getting started

```bash
npm install
npm run start:dev      # http://localhost:3000
```

## Tests

```bash
npm test               # unit tests (services and controllers, with mocked dependencies)
npm run test:e2e       # end-to-end tests against a separate test database
npm run test:cov       # coverage report
```
