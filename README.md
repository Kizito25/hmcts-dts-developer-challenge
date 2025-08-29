# Caseworker Tasks API (Laravel 11x + MySQL)

A lightweight REST API for creating, listing, retrieving, updating status, and deleting caseworker tasks. Built with **Laravel 11.x** and **MySQL**, tested with **PHPUnit/Pest**, and designed to be consumed by a **React** frontend.

## Live Links

#### Backend: [hmcts-dts-developer-challenge-main-ara28v.laravel.cloud](hmcts-dts-developer-challenge-main-ara28v.laravel.cloud)

#### Frontend: [https://taaskr.netlify.app/](https://taaskr.netlify.app/)

---

## Table of Contents

1. [Tech Stack](#tech-stack)  
2. [Requirements](#requirements)  
3. [Quick Start](#quick-start)  
4. [Configuration](#configuration)  
5. [Database](#database)  
6. [Run the API](#run-the-api)  
7. [API Conventions](#api-conventions)  
8. [Endpoints](#endpoints)  
9. [Validation Rules](#validation-rules)  
10. [Error Handling (Laravel 11)](#error-handling-laravel-11)  
11. [CORS](#cors)  
12. [Testing](#testing)  
13. [Project Structure](#project-structure)

---

## Tech Stack

- **Framework:** Laravel **11.x**
- **Database:** MySQL (InnoDB)
- **Language:** PHP 8.2+
- **Testing:** PHPUnit/Pest
- **Serialization:** Laravel API Resources (default **`data`** wrapper)
- **Validation:** Form Requests
- **Time:** Store & return **UTC**, format **ISO-8601** (e.g. `2025-08-30T12:38:00+00:00`)
- **Frontend** React frontend found in the 'frontend' branch of this repo

---

## Requirements

- PHP 8.2+  
- Composer 2.x  
- MySQL 8+ (or MariaDB equivalent)  
- Node.js (only for frontend/dev tooling, not required for the API itself)

---

## Quick Start (Installation)

1. Fresh Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure the database in **.env**, then run migrations:

```bash
php artisan migrate
```

Serve the API:

```bash
php artisan serve
# → http://127.0.0.1:8000
```

2. Using Docker Compose

Make sure that your docker desktop is up and running

 Run the below command to fire up Docker using sails

```bash
./vendor/bin/sail up 
```

Run Database Migrations

```bash
./vendor/bin/sail artisan migrate
```

Seed Database (Optional)

```bash
./vendor/bin/sail artisan db:seed
```

---

## Configuration

### Environment (.env)

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=caseworker
DB_USERNAME=your_user
DB_PASSWORD=your_pass
```

### CORS (development)

Make sure your React dev origin (e.g. `http://localhost:5173`) is allowed in **config/cors.php** (see [CORS](#cors)).

---

## Database

### Schema (`tasks` table)

| Column      | Type      | Notes                                        |
|-------------|-----------|----------------------------------------------|
| id          | BIGINT PK | Auto-increment                               |
| title       | VARCHAR   | Required                                     |
| description | TEXT NULL | Optional                                     |
| status      | ENUM      | `TODO`, `IN_PROGRESS`, `DONE`     |
| due_date      | DATETIME  | Store in UTC                                 |
| created_at  | TIMESTAMP | Auto                                         |
| updated_at  | TIMESTAMP | Auto                                         |

### Status Enum

- PHP Backed Enum: `App\Enums\TaskStatus`  
- Values: `TODO`, `IN_PROGRESS`, `DONE`

---

## Run the API

```bash
php artisan serve
# → http://127.0.0.1:8000
```

Base path for endpoints: **`/api`**

---

## API Conventions

- **Content-Type:** `application/json`
- **Wrapper:** Responses use Laravel Resource wrapper `{ "data": … }` (collections also include `links`/`meta` for pagination).
- **Dates:** ISO-8601 UTC strings (e.g. `2025-08-30T12:38:00+00:00`).
- **Errors (validation):** `422` with shape:

  ```json
  {
    "message": "The given data was invalid.",
    "errors": { "field": ["message"] }
  }
  ```

---

## Endpoints

### 1) Create Task

**POST** `/api/tasks`

**Body**

```json
{
  "title": "Call client re: safeguarding",
  "description": "Confirm documents received",
  "status": "IN_PROGRESS",   // optional (default: TODO)
  "due_date": "2025-09-05T09:00:00Z"
}
```

**201 Created**

```json
{
  "data": {
    "id": 1,
    "title": "Call client re: safeguarding",
    "description": "Confirm documents received",
    "status": "IN_PROGRESS",
    "due_date": "2025-09-05T09:00:00+00:00",
    "is_overdue": false,
    "created_at": "2025-08-29T10:12:00+00:00",
    "updated_at": "2025-08-29T10:12:00+00:00"
  }
}
```

**422 Unprocessable Entity**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "due_date": ["The due date field is required."]
  }
}
```

---

### 2) List Tasks

**GET** `/api/tasks`

**Query params**

- `status`: `TODO|IN_PROGRESS|DONE` (optional)
- `overdue`: `true|false` (optional; `due_date < now` and `status != DONE`)
- `sort`: `due_date|created_at` (default: `due_date`)
- `direction`: `asc|desc` (default: `asc`)
- `per_page`: `1..100` (default: `15`)

**200 OK**

```json
{
  "data": [
    { "id": 1, "title": "…", "status": "TODO", "due_date": "…", "is_overdue": false, "created_at": "…", "updated_at": "…" }
  ],
  "links": { "first": "…", "last": "…", "prev": null, "next": "…" },
  "meta": { "current_page": 1, "from": 1, "last_page": 3, "path": "…", "per_page": 15, "to": 15, "total": 33 }
}
```

---

### 3) Retrieve Task by ID

**GET** `/api/tasks/{id}`

**200 OK**

```json
{
  "data": {
    "id": 1,
    "title": "Call client re: safeguarding",
    "description": "Confirm documents received",
    "status": "IN_PROGRESS",
    "due_date": "2025-09-05T09:00:00+00:00",
    "is_overdue": false,
    "created_at": "2025-08-29T10:12:00+00:00",
    "updated_at": "2025-08-29T10:12:00+00:00"
  }
}
```

**404 Not Found**

```json
{ "message": "Resource not found" }
```

---

### 4) Update Task Status

**PATCH** `/api/tasks/{id}/status`

**Body**

```json
{ "status": "DONE" }
```

**200 OK**

```json
{
  "data": {
    "id": 1,
    "title": "Call client re: safeguarding",
    "description": "Confirm documents received",
    "status": "DONE",
    "due_date": "2025-09-05T09:00:00+00:00",
    "is_overdue": false,
    "created_at": "2025-08-29T10:12:00+00:00",
    "updated_at": "2025-08-29T12:45:00+00:00"
  }
}
```

**422 Unprocessable Entity**

```json
{
  "message": "The given data was invalid.",
  "errors": { "status": ["The selected status is invalid."] }
}
```

---

### 5) Delete Task

**DELETE** `/api/tasks/{id}`

**204 No Content** (empty body)

**404 Not Found**

```json
{ "message": "Resource not found" }
```

---

## Validation Rules

- **Store Task** (`POST /api/tasks`)
  - `title`: required, string, max:255
  - `description`: nullable, string
  - `status`: optional, must be enum (`TODO`, `IN_PROGRESS`, `DONE`)
  - `due_date`: required, date/ISO-8601

- **Update Status** (`PATCH /api/tasks/{id}/status`)
  - `status`: required, enum (`TODO`, `IN_PROGRESS`, `DONE`)

---

## Error Handling (Laravel 11)

Exception handling is configured in **`bootstrap/app.php`** using `withExceptions()`:

```php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {
        // Force JSON for API routes
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });

        // Standard JSON shape for 422 validation
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });
    })
    ->create();
```

**404 handling** for missing models/routes should return:

```json
{ "message": "Resource not found" }
```

---

## CORS

**config/cors.php** (development defaults)

```php
return [
  'paths' => ['api/*', 'sanctum/csrf-cookie'],
  'allowed_methods' => ['*'],
  'allowed_origins' => [
    'http://localhost:5173', // Vite
  ],
  'allowed_headers' => ['*'],
  'exposed_headers' => [],
  'max_age' => 0,
  'supports_credentials' => false,
];
```

Apply changes:

```bash
php artisan optimize:clear
```

---

## Testing

Use Laravel’s test runner (PHPUnit/Pest). Default test DB can be **SQLite in-memory** via `.env.testing`:

**.env.testing**

```env
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

Run tests:

```bash
php artisan test
# or using sails 
./vendor/bin/sail artisan test
# or a specific class:
php artisan test --filter=TaskTest
# or using sails 
./vendor/bin/sail artisan test-TaskTest
```

---

## Project Structure

```
app/
  Enums/TaskStatus.php
  Http/
    Controllers/Api/TaskController.php
    Requests/StoreTaskRequest.php
    Requests/UpdateTaskStatusRequest.php
    Resources/TaskResource.php
  Models/Task.php
bootstrap/app.php           # JSON exception handling for API
config/cors.php
database/
  migrations/2025_08_21_232808_create_tasks_table.php
  factories/TaskFactory.php
routes/api.php
tests/Feature/TaskTest.php
```

---

## cURL Examples - IMPORTANT

```bash
# Create
curl -s -X POST http://localhost:8000/api/tasks   -H "Content-Type: application/json"   -d '{"title":"Safeguarding call","description":"Confirm docs","due_date":"2025-09-05T09:00:00Z"}'

# List (overdue)
curl -s "http://localhost:8000/api/tasks?overdue=true&per_page=20"

# Retrieve by ID
curl -s http://localhost:8000/api/tasks/1

# Update status
curl -s -X PATCH http://localhost:8000/api/tasks/1/status   -H "Content-Type: application/json"   -d '{"status":"DONE"}'

# Delete
curl -s -X DELETE http://localhost:8000/api/tasks/1 -i
```

---

Happy Coding ⚡️