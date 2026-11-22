# NammaYatra 🚌

**A Full-Stack Bus Ticket Booking Application**

NammaYatra is a full-stack bus booking application designed to simplify the journey from searching for buses to booking seats. Passengers can search for journeys, check seat availability, book tickets, and manage their bookings. Administrators can manage buses and schedule journeys through a dedicated admin interface.

The project is built using **Java, Spring Boot, Spring Security, JWT, React, and MySQL**, with the frontend and backend deployed separately.

## 🌐 Live Application

- **Frontend:** https://namma-yatra-3m1a.vercel.app
- **Backend:** https://nammayatra-backend.onrender.com
- **GitHub Repository:** https://github.com/TameemMubarak/NammaYatra

> Note: The backend is hosted on Render. If the service is idle, its first request may take some time to respond.

## ✨ Features

### Passenger Features
- User registration and login.
- JWT-based authentication.
- Search for available journeys.
- View journey details and seat availability.
- Select seats and create bookings.
- View booking confirmation.
- Access booking history.
- Cancel existing bookings.
- Manage passenger profile.

### Admin Features
- Role-based admin access.
- Add and view buses.
- Update bus details.
- Deactivate buses.
- Create and manage journeys.
- Schedule journeys using the available bus information.

### Security
- Spring Security for application-level access control.
- JWT-based authentication.
- BCrypt password hashing.
- Role-based authorization for passenger and admin operations.
- Protected frontend routes.
- CORS configuration for frontend-backend communication.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Backend | Java 17, Spring Boot |
| Backend Security | Spring Security, JWT |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL 8 / TiDB Cloud |
| Frontend | React 19, JavaScript |
| Styling | Tailwind CSS |
| Build Tool | Maven |
| Frontend Build Tool | Vite |
| HTTP Client | Axios |
| Routing | React Router |
| Icons | Lucide React |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |
| Database Hosting | TiDB Cloud |

## 🏗️ Application Architecture

NammaYatra follows a client-server architecture.

```text
                 PASSENGER / ADMIN
                         |
                         v
                  React Frontend
                    (Vercel)
                         |
                         | REST API Requests
                         | JWT Authorization
                         v
                Spring Boot Backend
                     (Render)
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
          Security    Services   Controllers
             |           |           |
             +-----------+-----------+
                         |
                         v
                  Spring Data JPA
                         |
                         v
                  MySQL Database
                   (TiDB Cloud)
```

The frontend communicates with the backend through REST APIs. The backend handles authentication, authorization, business logic, booking operations, and database interactions.

## 📁 Project Structure

```text
NammaYatra/
│
├── backend/
│   ├── src/main/java/com/nammayatra/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── enums/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── BackendApplication.java
│   │
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
├── docs/
├── .gitignore
├── LICENSE
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the application locally.

### Prerequisites

Install the following:

- Java 17 or later
- Maven
- Node.js and npm
- MySQL 8 or a compatible MySQL database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/TameemMubarak/NammaYatra.git

cd NammaYatra
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your local Spring Boot database connection and JWT secret. Create a MySQL database named:

```sql
CREATE DATABASE nammayatra_db;
```

Set the appropriate database URL, username, password, and JWT configuration in your local Spring Boot configuration.

Run the backend:

```bash
mvn spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd NammaYatra/frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## ☁️ Deployment

The application is deployed using separate hosting services for the frontend, backend, and database.

| Component | Hosting Platform |
|---|---|
| React Frontend | Vercel |
| Spring Boot Backend | Render |
| MySQL-Compatible Database | TiDB Cloud |

The backend is containerized using Docker and deployed on Render. Environment variables are used to configure production database credentials, JWT secrets, admin account details, and CORS settings.

The frontend connects to the deployed backend through its configured API base URL.

**Important:** Never commit database passwords, JWT secrets, API keys, or other credentials to GitHub.

## 🔮 Planned Enhancements

- AI-powered travel companion for destination discovery and trip planning.
- Personalized travel recommendations based on user preferences, budget, and interests.
- AI-assisted itinerary generation.
- Travel information discovery through external web search.
- Integration between AI travel recommendations and actual NammaYatra journey availability.

These enhancements are planned for future development and are not part of the current implemented feature set.

## 🎯 Project Objective

The objective of NammaYatra is to build a practical full-stack application while gaining hands-on experience with:

- Java and Spring Boot application development.
- REST API design and implementation.
- Spring Security and JWT authentication.
- Role-based access control.
- Entity relationships and database persistence using JPA.
- React component-based frontend development.
- Frontend-backend integration.
- Cloud deployment and environment configuration.

## 📄 License

This project is distributed under the license specified in the `LICENSE` file.


