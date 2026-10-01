# Campus Roster — Student Management System

## Overview
Full-stack CRUD application for managing students and courses. React talks to a Spring Boot REST API that stores data in an H2 database. No authentication, no mock data.

## Features
- Student and Course CRUD with validation
- Search students by name (backend query) and filter by course, both combinable
- Delete confirmation modal, loading / empty / error states, toast messages
- Responsive dark UI (sidebar on desktop, menu on mobile, table becomes cards on phones)

## Tech Stack
Java 17, Spring Boot 3.3, Spring Data JPA, Jakarta Validation, H2, Maven, Lombok (entities only) · React 18, Vite, Axios, React Router, plain CSS

## Project Structure
```
campus-roster/
├── backend/src/main/java/com/example/studentmanagement/
│   ├── controller/   REST endpoints
│   ├── service/      business rules
│   ├── repository/   Spring Data JPA
│   ├── entity/       Student, Course
│   ├── dto/          StudentRequest, StudentResponse, ErrorResponse
│   ├── exception/    custom exceptions + @RestControllerAdvice
│   └── config/       CORS + seed data
└── frontend/src/
    ├── api/          Axios layer (client, studentApi, courseApi)
    ├── components/   Modal, ConfirmDialog, forms, StatusMessage
    └── pages/        StudentsPage, CoursesPage
```

## Backend Setup
Requires JDK 17 and Maven.
```
cd backend
mvn spring-boot:run
```
Runs at http://localhost:8080

## Frontend Setup
Requires Node 18+.
```
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173. Set `VITE_API_URL` to change the API address.

## Database
H2 in-memory database, tables created by Hibernate (`ddl-auto=update`). Data survives browser refreshes and lasts until the backend stops; sample courses and students are seeded on each start.
Console: http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:studentdb`, user `sa`, empty password.
To keep data across restarts use `jdbc:h2:file:./data/studentdb` in `application.properties`.

## API Endpoints
| Method | URL | Description |
|---|---|---|
| GET | /api/students | All students (optional `name`, `courseId`) |
| GET | /api/students/search?name=&courseId= | Search by name, optional course |
| GET | /api/students/{id} | One student |
| POST | /api/students | Create (201) |
| PUT | /api/students/{id} | Update |
| DELETE | /api/students/{id} | Delete (204) |
| GET | /api/courses | All courses |
| GET | /api/courses/{id} | One course |
| POST | /api/courses | Create (201) |
| PUT | /api/courses/{id} | Update |
| DELETE | /api/courses/{id} | Delete (409 if students still use it) |

## Validation
- Student: name required, email required and valid, age 16–60, course required, email unique
- Course: name required, duration 1–60 months

## Error Handling
`GlobalExceptionHandler` returns JSON like `{"message":"Student not found","status":404,"timestamp":"..."}`. Validation errors (400) add an `errors` map with one message per field. Also handled: 409 conflict, malformed request (400), unexpected errors (500).

## How Frontend Connects to Backend
`src/api/client.js` creates one Axios instance with base URL `http://localhost:8080/api`. `studentApi.js` and `courseApi.js` wrap each endpoint. Pages call these functions, track loading/error state, and show server messages. `CorsConfig` allows the Vite origin `http://localhost:5173`.

## Future Improvements
Pagination, unit and integration tests, Swagger/OpenAPI, persistent database (MySQL/PostgreSQL), Docker.

## Screenshots
_Add screenshots here._

## Likely Interview Questions
1. Why use DTOs for students but the entity directly for courses? (Student has a relationship; Course is flat.)
2. What does `@ManyToOne` do and where is the foreign key stored?
3. How does `@Valid` trigger validation and how do errors reach `@RestControllerAdvice`?
4. Why is the search done in the backend query instead of filtering in React?
5. What does `(:courseId IS NULL OR s.course.id = :courseId)` do?
6. What is CORS and why was it needed here?
7. Why return 201 for POST and 204 for DELETE?
8. Why block deleting a course that has students? (409 Conflict)
9. Why is the search debounced by 300 ms?
10. What is H2 in-memory mode and what does `ddl-auto=update` do?
11. What do `useEffect` and `useCallback` do in `StudentsPage`?
12. How would you add JWT or pagination later?
