# Digital Portfolio System for Students

## Project Description
A comprehensive web application designed for students to create, manage, and share their digital portfolios. It allows students to showcase their work, track learning goals, earn badges, and receive feedback from teachers and peers. Teachers can review student portfolios and provide feedback, while administrators can manage users and system settings.

## Tech Stack
**Frontend**: React 18 + Vite + TailwindCSS + React Router v6
**Backend**: Node.js + Express.js
**Database**: MongoDB + Mongoose
**Auth**: JWT (JSON Web Tokens) + bcryptjs
**File Upload**: Multer (local storage /uploads folder)
**PDF Export**: jsPDF + html2canvas
**Extra**: Axios, React Hook Form, React Toastify, Lucide React icons

## Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd digital-portfolio
    ```

2.  **Backend Setup**:
    ```bash
    cd server
    npm install
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../client
    npm install
    ```

## How to Run
1.  **Backend (in `digital-portfolio/server` directory)**:
    ```bash
    npm run dev
    ```

2.  **Frontend (in `digital-portfolio/client` directory)**:
    ```bash
    npm run dev
    ```

## Environment Variables
Create a `.env` file in the `digital-portfolio/server` directory with the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/digital_portfolio
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

## API Endpoints
### AUTH ROUTES (`POST /api/auth/`)
-   `POST /register`
-   `POST /login`
-   `GET  /me` (Protected)

### PORTFOLIO ROUTES (Protected)
-   `POST   /api/portfolio/create`
-   `GET    /api/portfolio/mine`
-   `PUT    /api/portfolio/update`
-   `GET    /api/portfolio/public/:slug` (Public)
-   `GET    /api/portfolio/all` (Teacher/Admin only)

### WORK ROUTES (Protected)
-   `POST   /api/work/upload`
-   `GET    /api/work/list/:portfolioId`
-   `PUT    /api/work/update/:id`
-   `DELETE /api/work/delete/:id`

### REFLECTION ROUTES (Protected)
-   `POST   /api/reflection/add`
-   `GET    /api/reflection/work/:workId`
-   `PUT    /api/reflection/update/:id`

### GOAL ROUTES (Protected)
-   `POST   /api/goal/add`
-   `GET    /api/goal/list/:portfolioId`
-   `PUT    /api/goal/update/:id`
-   `DELETE /api/goal/delete/:id`

### BADGE ROUTES (Protected)
-   `POST   /api/badge/add`
-   `GET    /api/badge/list/:portfolioId`
-   `PUT    /api/badge/verify/:id` (Teacher only)
-   `DELETE /api/badge/delete/:id`

### FEEDBACK ROUTES (Protected)
-   `POST   /api/feedback/add`
-   `GET    /api/feedback/portfolio/:portfolioId`
-   `DELETE /api/feedback/delete/:id` (Author or Admin only)

## Features
-   **User Authentication**: Register, Login, JWT-based authentication.
-   **Role-Based Access Control**: Student, Teacher, Admin roles with specific permissions.
-   **Portfolio Management**: Students can create, edit, and share their portfolios.
-   **Work Samples**: Upload various file types (PDF, images, videos, code) with reflections.
-   **Learning Goals**: Set and track learning goals with progress indicators.
-   **Badges & Certificates**: Add and verify badges.
-   **Teacher Feedback**: Teachers can review student portfolios and provide feedback.
-   **PDF Export**: Export portfolios as professional PDF documents.
-   **Public Sharing**: Share portfolios via unique public links.
-   **Responsive Design**: Built with TailwindCSS for a mobile-first experience.

## Screenshots
(Placeholder for screenshots)
