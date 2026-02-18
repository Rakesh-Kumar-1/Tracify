# Tracify – Landing Page & Android Dashboard (Public Repository)

This repository contains the **public modules** of the Tracify project:

- **Tracify Landing Page** → Full-stack website with secure registration  
- **Tracify Dashboard** → Android dashboard app (source code only)

**Note:** The ATS APK remains private and is not included here.

---

1. Tracify Landing Page (Full-Stack)

A modern, production-ready landing page built with a glassmorphism UI, secure credential system, and user onboarding workflow.

---

## Tech Stack (Landing Page)

### **Frontend**
- React (Vite)
- Vanilla CSS (Glassmorphism UI)
- Fetch API for backend communication

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- bcrypt (password hashing)

---

## **Backend Setup**

cd Tracifylandingpage/server
npm install

**Create .env**:

MONGO_URI=mongodb://localhost:27017/tracify
PORT=5000

**Run backend**:
node server.js

Backend URL: http://localhost:5000

---

## **Frontend Setup**

cd Tracifylandingpage/client
npm install
npm run dev

Frontend URL: http://localhost:5173 

----

**Landing Page Features**

-Secure user registration

-Live photo capture

-Encrypted password creation

-Backend validation

-User profile

-Restricted ATS APK download (after registration only)

---

## ** 2. Tracify Dashboard (Android App)**

-An Android dashboard application for registered Tracify users.

-APK is not included here — only the source code.

---

##**Tech Stack (Android App)**

-Java / Kotlin

-Android SDK

-XML UI

-Gradle Build System

---

##**Build Instructions**

Open in Android Studio:
File --> Open -->TracifyDashboard/

Build:
Build → Make Project

Run:
Run → Run App

---

##**Repository Structure**

tracify-public/
│
├── Tracifylandingpage/
│ ├── client/ → React frontend
│ └── server/ → Node.js backend
│
└── TracifyDashboard/ → Android App Source Code
├── app/
└── gradle/
---

**Build**:

-npm run build

-Deploy dist/ folder.

-Security Notes

-ATS APK is not included publicly

-APK download allowed only for verified users

-All passwords hashed with bcrypt

-Backend authorization required

**Contribution**

Pull requests are welcome.
For major changes, open an issue first.

**Author**

Rakesh Kumar
GitHub: https://github.com/Rakesh
