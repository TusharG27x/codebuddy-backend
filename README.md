# 💻 CodeBuddy: AI-Powered Multi-Language Online IDE

> A full-stack, microservice-orchestrated remote code execution (RCE) environment featuring intelligent AI tutoring and algorithmic complexity analysis. Built for my Final Year B.Tech IT Capstone Project.

---

## 🚀 Overview

CodeBuddy is not just a text editor; it is a secure, scalable platform designed to help students learn programming. It features a React-based frontend Editor that securely proxies code execution requests through a Node.js backend to an isolated Linux sandbox. Furthermore, it integrates state-of-the-art LLMs to act as an intelligent tutor, providing contextual hints and mathematical efficiency breakdowns without giving away the final solution.

## ✨ Core Features

* **🌍 Multi-Language Remote Execution:** Securely compile and run **Python, JavaScript, Java, and C++** in isolated cloud containers.
* **⚡ Algorithmic Complexity Analyzer:** Custom AI prompt engineering parses user code to mathematically calculate and display Big O Time and Space complexity.
* **🤖 Intelligent AI Tutor:** Analyzes code for correctness and provides small, actionable stepping-stone hints to guide users without revealing the answer.
* **🔒 Secure API Gateway:** A Node.js backend proxy prevents credential leakage and ensures resource isolation so infinite loops don't crash the main server.
* **💾 Persistent State:** Real-time auto-saving of editor progress using LocalStorage, alongside MongoDB integration for long-term user data storage.

---

## 🏗️ System Architecture

CodeBuddy relies on a robust microservices architecture to ensure scalability and security:

1. **Client Layer (React/Vercel):** Manages UI state, Monaco Editor syntax highlighting, and dynamic API routing.
2. **API Gateway (Node.js/Express):** Handles JWT authentication, request validation, and secure proxying to third-party microservices.
3. **Execution Sandbox (JDoodle API):** Receives code payloads from the Node gateway and executes them in isolated, containerized Linux environments.
4. **Inference Engine (Google Gemini AI):** Receives strict, prompt-engineered context from the backend to act as a strict Computer Science evaluator.

---

## 🛠️ Tech Stack

**Frontend**
* React.js (Vite)
* Monaco Editor (VS Code Engine)
* React Bootstrap & Framer Motion (UI/UX)
* Axios

**Backend & Database**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for Authentication

**External Microservices**
* JDoodle Compiler API (Remote Code Execution)
* Google Gemini AI API (LLM Inference Engine)

---

## ⚙️ Local Installation & Setup

To run this project locally, you will need Node.js and a MongoDB instance running.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/TusharG27x/codebuddy-frontend
cd codebuddy
\`\`\`

### 2. Set up the Backend
\`\`\`bash
cd codebuddy-backend
npm install
\`\`\`
Create a `.env` file in the backend directory and add your secret keys:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
GEMINI_API_KEY=your_gemini_api_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Set up the Frontend
Open a new terminal window:
\`\`\`bash
cd codebuddy-frontend
npm install
npm run dev
\`\`\`

---

## 👨‍💻 Author

**Tushar Gajbhiye**
* B.Tech Information Technology
* Final Year Capstone Project
