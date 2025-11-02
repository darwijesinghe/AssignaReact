# React Task Manager App

A simple full-stack task management application built with a **.NET API** and **React frontend**, secured with **JWT authentication** and **role-based authorization**. The project is fully containerized using Docker, so it can be run locally with a single command.

## Features

- User registration, normal login, Google OAuth login, password reset, token refresh  
- SQL Server database (via EF Core)  
- JWT Authentication + Role-based Authorization (`team-lead`, `team-member`)  
- Task CRUD with priority and status tracking  
- Team lead can assign tasks, edit, delete, and send reminder emails  
- Members can view tasks, update status, and add notes  
- Tasks categorized by priority, pending / completed state  
- File-based logging using **NLog**
- Fully containerized using Docker (`API`, `Client`, `MSSQL`)  

## Tech Stack

### Backend (API)
- .NET Core 3.1 Web API
- C#
- Entity Framework Core (SQL Server)
- JWT Authentication + Role-based Authorization
- Dockerized

### Frontend (Client)
- React (CRA)
- Fetch for API calls
- React Hooks & Context APIs
- Google OAuth Login Integration
- Dockerized

### Database
- Microsoft SQL Server (running as a Docker container)

## Running the App with Docker

### Prerequisite
- Install **Docker Desktop**

### Run the whole project
From the project root folder where `docker-compose.yml` is located, run:

```bash
docker-compose up --build
```

## Access the app

| Service               | URL                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------ |
| Frontend (React)      | [http://localhost:3000](http://localhost:3000)                                       |
| Backend API (Swagger) | [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html) |

## Environment Variables
Before running the app, create a `.env` file next to your `docker-compose.yml` and add these values.

```env
# Database
DB_PASSWORD=YOUR_DB_PASSWORD_HERE

# JWT Config
JWT_SECRET=YOUR_RANDOM_JWT_SECRET_HERE
JWT_AUDIENCE=http://localhost:8080
JWT_ISSUER=http://localhost:8080

# Email Config (used for task reminder emails)
MAIL_USERNAME=YOUR_EMAIL_ADDRESS_HERE
MAIL_PASSWORD=YOUR_EMAIL_APP_PASSWORD_HERE
PORT=587
SERVER=smtp.gmail.com

# Frontend Config
REACT_APP_API_URL=http://localhost:8080

# Google Authentication
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

## Support

Darshana Wijesinghe  
Email address - [dar.mail.work@gmail.com](mailto:dar.mail.work@gmail.com)  
Linkedin - [darwijesinghe](https://www.linkedin.com/in/darwijesinghe/)  
GitHub - [darwijesinghe](https://github.com/darwijesinghe)

## License

This project is licensed under the terms of the **MIT** license.