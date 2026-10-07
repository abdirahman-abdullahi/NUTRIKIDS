# NutriKids

NutriKids is a web-based nutrition management application designed to help parents, caregivers, and health professionals monitor and manage children's nutrition.

The application provides tools for managing child profiles, nutrition information, meal plans, and health-related metrics through a user-friendly web interface.

## Features

* User authentication and account management
* Child profile management
* Nutrition information and recommendations
* Meal planning
* Child health and nutrition metrics
* Image/file uploads
* Responsive React-based user interface
* REST API backend
* MySQL database integration

## Technology Stack

### Frontend

* React 18
* React Router
* Sass
* React Scripts

### Backend

* Node.js
* Express.js
* MySQL
* JWT authentication
* bcryptjs
* Multer
* Nodemailer
* Google APIs

### Development & Testing

* Jest
* Supertest
* npm
* Git & GitHub

## Project Structure

```text
NUTRIKIDS/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── tests/
│   ├── utilities/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MySQL
* Git

### 1. Clone the repository

```bash
git clone https://github.com/abdirahman-abdullahi/NUTRIKIDS.git
cd NUTRIKIDS
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another Terminal window, or return to the project root and run:

```bash
cd backend
npm install
```

## Environment Variables

The backend uses environment variables for database credentials and other sensitive configuration.

Create a `.env` file inside the `backend` directory:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=5000
JWT_SECRET=your_jwt_secret
```

Do not commit your `.env` file to GitHub.

The repository already includes `.gitignore` rules to prevent environment files and other sensitive or generated files from being committed.

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
node server.js
```

The backend API will start on the configured port.

### Start the Frontend

From the `frontend` directory:

```bash
npm start
```

The React development server will start and open the application in your browser.

## Testing

Backend tests can be run with:

```bash
cd backend
npm test
```

Individual Jest test files are located in:

```text
backend/tests/
```

## Security

Sensitive configuration such as database credentials, API keys, and JWT secrets should be stored in environment variables.

Never commit the `backend/.env` file or other files containing private credentials to GitHub.

## Future Improvements

Possible future improvements include:

* Production deployment
* Improved nutrition analytics
* Additional health metrics
* Mobile application support
* Automated meal recommendations
* Expanded testing coverage
* Improved accessibility
* CI/CD integration

## Author

**Abdirahman Abdullahi**

GitHub: [@abdirahman-abdullahi](https://github.com/abdirahman-abdullahi)

## License

This project was developed as a school/academic project.

