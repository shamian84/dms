# 📂 Document Management System (Frontend)

This is the **frontend assignment** for a Document Management System (DMS).  
It is built using **React + Bootstrap**, with authentication, admin, file upload, and search features.

---

## Features

- **OTP-based Login**
  - Uses `/generateOTP` and `/validateOTP` APIs.
  - Mock mode available → if number not registered, use **OTP = `1234`** to log in.
- **Dashboard** – simple welcome page after login.
- **Admin Panel** – create static users (mock, no backend required).
- **File Upload** – upload PDF/Image with metadata (date, category, tags, remarks).
- **Search Page** – search for uploaded files (mock integration with backend).
- **Global Auth State** – managed with React Context API.
- **UI with Bootstrap** – responsive and minimal design.

---

## Tech Stack

- React 19
- React Router DOM
- Axios
- Bootstrap 5
- Context API (Auth management)

---

## 📂 Project Structure

document-management/
│── public/
│── src/
│ ├── api/
│ │ └── axios.js
│ ├── components/
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Dashboard.jsx
│ │ ├── AdminPage.jsx
│ │ ├── UploadPage.jsx
│ │ └── SearchPage.jsx
│ ├── App.js
│ ├── index.js
│ └── index.css
│── package.json
│── README.md
│── First.json (Postman API collection)
│── .gitignore

## Getting Started

### Clone the repo

```bash
git clone https://github.com/<your-username>/dms.git
cd dms

Install dependencies
npm install

Start the development server
npm start

--> Runs on http://localhost:3000

Login Guide

Enter any mobile number
If backend supports it → you’ll receive an OTP
If number is not registered, use mock mode:
OTP = 1234
A dummy token will be generated and stored


API Collection

The backend APIs are provided in First.json (Postman collection).
You can import this into Postman to test the endpoints like /generateOTP, /validateOTP, /saveDocumentEntry, etc.

Screenshots
[Login Page](./src/assets/screenshots/login.png)
[Dashboard](./src/assets/screenshots/dashboard.png)
[Upload Page](./src/assets/screenshots/upload.png)
[Search Page](./src/assets/screenshots/search.png)
[Admin Page](./src/assets/screenshots/admin.png)


Author

Developed with ❤️ by Shami Alam
Fresh Full Stack Developer (MERN, Python)
```
