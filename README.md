# CNP-Connect – Frontend

## 📌 Project Overview

CNP-Connect is an internal web application designed for public transportation companies.  
This repository contains the **frontend** of the application.  

The user interface is built with **React** and **TypeScript**, powered by **Vite** for development and build, and styled with **Tailwind CSS**.

---

## 📦 Parent Repository

This project is part of: https://github.com/peter-francois/cnp-connect-resources

---

## 🔁 Repository Origin & DevOps

This repository is a **mirror of the original GitLab repository** for the CNP-Connect project. It therefore reflects the state of the code originally developed on GitLab.

### 🐳 Containerization

A **Dockerfile** is present to containerize the frontend application.

### ⚙️ Nginx (Lightweight Image)

An **Nginx configuration** is provided and designed to work with the Dockerfile.  
It serves the frontend build via a minimal Nginx server to ensure a lighter and more performant Docker image.

### 🔃 CI/CD (GitLab)

The project integrates a **GitLab CI/CD pipeline** (`.gitlab-ci.yml`) that automatically builds the application and deploys it to a GitLab container registry.

---

## 🏗️ Frontend Architecture

The application follows a modular architecture based on:

- **Pages** (`/pages`): main views of the application  
- **Components** (`/components`): reusable UI elements (e.g., `PrimaryButton`, `PopUp`)  
- **Layouts** (`/layouts`): common structures for groups of pages (e.g., `DisconnectedLayout`)  
- **Router**: centralized navigation management via React Router  
- **Services & Hooks**: isolation of business logic and API calls (e.g., `useUserService`)  
- **Guards**: route protection based on authentication and roles  

---

## 🛠️ Tech Stack

| Tool                      | Usage                  |
| ------------------------- | ---------------------- |
| **React**                 | User Interface         |
| **TypeScript**            | Static Typing          |
| **Vite**                  | Build & Dev Server     |
| **Tailwind CSS**          | Styling                |
| **Axios**                 | HTTP Client            |
| **TanStack Query**        | Cache & Data Fetching  |
| **React Hook Form + Zod** | Form Validation        |

---

## 🔐 Frontend Security

### Authentication & Tokens

- **Access Token**: stored in `localStorage` and automatically sent via Axios  
- **Refresh Token**: stored in a secure `httpOnly` cookie  
- HTTPS is required in production  

### Form Validation

All forms use **React Hook Form + Zod** to validate data before sending it to the backend.

### Route Guards

Guards prevent access to certain pages based on:

- authentication status  
- user role (e.g., pages reserved for **Supervisors**)  

---

## 🌐 Data Access (API)

A centralized Axios client (`axiosClient`):

- automatically attaches the authentication token  
- manages token refresh  
- interprets HTTP status codes and redirects when necessary  

---

## 📁 Project Structure (Simplified)
```
src/
│── components/
│ ├── ui/ # Generic UI components (PrimaryButton, etc.)
│ └── features/ # Business-related components (User, Header, etc.)
│
│── pages/ # Application pages
│
│── layouts/ # Layouts (e.g., DisconnectedLayout)
│
│── router/ # Route configuration
│
│── api/ # API calls
│
│── hooks/ # Custom hooks (e.g., useUserService)
│
│── guards/ # Route protection
│
│── utils/
│ └── axiosClient.ts
```

---

## ⚙️ Configuration

An `.env.example` file is provided at the root of the project. It lists all required environment variables.

To use it:

```bash
cp .env.example .env
```

Then fill in the values according to your environment.

---

## 🚀 Run the project locally

``` bash
npm install
npm run dev
```

Then open: http://localhost:5173

---

## 🧪 E2E Tests (Cypress)

The project includes End-to-End tests using Cypress.  
Tests are located in the `cypress/` folder.  

To run them:
``` bash
npm run cy:open
```

---

## 📬 Contact

If you have any questions, suggestions, or would like to discuss the project, feel free to contact me:

Email: contact@peterfrancois.dev

LinkedIn: https://www.linkedin.com/in/peterfrancois/

GitHub: https://github.com/peter-francois/

Feel free to open an issue or submit a pull request if you’d like to contribute to the project.
