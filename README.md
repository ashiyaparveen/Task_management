# TaskManage - Task Management Web Application

TaskManage is a simple, responsive, and beautiful Task Management Web Application built for a technical assessment. It features a highly aesthetic, modern, and light-themed user interface coupled with secure real-time backend integrations powered by Google Firebase.

---

## 1. Project Overview

TaskFlow is engineered to be an extremely clean and highly usable application where users can login securely via Google Authentication, create personal workflow tasks, and update task statuses instantly in real-time. It adopts a modular, component-driven design layout focused on:
* **Simplicity**: No bloated enterprise workflows, just pure personal task tracking.
* **Premium Usability**: Fast transitions, visual status changes, elegant loading states, and custom responsive layouts.
* **Clean Architecture**: Functional components with custom hooks that segregate UI presentation from real-time database operations.

---

## 2. Features

* **Google Identity Provider**: Secure login and session persistence on reload using Firebase Google Authentication.
* **Real-time Task Tracking**: Direct in-memory sorted view of tasks associated strictly with the logged-in user.
* **Instant Status Updates**: Update task progress (`Planned` ➔ `In Progress` ➔ `Complete`) immediately via interactive dropdown selectors.
* **Color-Coded Status Badges**: Visual indicators utilizing smooth tailwind border accents.
* **Dynamic Analytics Counters**: Header cards showing a quick breakdown of your workload counts.
* **Responsive Multi-Column Dashboard**: Tailored desktop columns transitioning smoothly to fluid stacked cards on mobile devices.
* **Elegant Empty State**: Clean and motivational empty slate layout when a user has zero tasks.

---

## 3. Tech Stack

* **Frontend Framework**: [React (Vite)](https://react.dev/)
* **CSS & Utility Engine**: [Tailwind CSS](https://tailwindcss.com/)
* **Icon Suite**: [Lucide React](https://lucide.dev/)
* **Backend Database & Storage**: [Google Cloud Firestore](https://firebase.google.com/docs/firestore)
* **User Authentication**: [Firebase Google Auth Provider](https://firebase.google.com/docs/auth)

---

## 4. Setup Instructions

To get TaskFlow up and running locally, ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

1. **Clone or Open the Project Workspace**:
   Navigate into the directory where the source code is located:
   ```bash
   cd e:/kovai
   ```

2. **Install Dependencies**:
   Install all node dependencies configured in `package.json` (including firebase, tailwindcss, lucide-react, and build plugins):
   ```bash
   npm install
   ```

3. **Set Up the Environment File**:
   Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert your active Firebase project credentials (see the section below).

---

## 5. Firebase Setup

To authenticate users and sync data, configure a Firebase project using these steps:

1. **Create a Firebase Project**:
   * Visit the [Firebase Console](https://console.firebase.google.com/).
   * Click **Add Project** and follow the instructions to create a new project.

2. **Enable Google Authentication**:
   * Navigate to the **Build** menu in the sidebar and select **Authentication**.
   * Click **Get Started**, choose the **Sign-in method** tab, and select **Google**.
   * Toggle to **Enable**, choose your project support email, and click **Save**.

3. **Create a Cloud Firestore Database**:
   * Navigate to **Firestore Database** in the Build menu.
   * Click **Create Database**.
   * Choose your preferred database location and start in **Test Mode** (or Production Mode).
   * Go to the **Rules** tab and overwrite the security rules to restrict users to only access their own tasks:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /tasks/{taskId} {
           allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
           allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
         }
       }
     }
     ```
   * Click **Publish**.

4. **Register Your Web App**:
   * Return to the Project Overview home.
   * Click the web icon (`</>`) to register a new Web App.
   * Give your app a nickname (e.g., `TaskFlow`), and click **Register app**.
   * Copy the configuration values provided inside the `firebaseConfig` object and add them to your `.env` file.

---

## 6. Environment Variables

Create a `.env` file in the root directory. Below is the schema required:

```properties
# Firebase Configuration Configuration
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

---

## 7. How to Run Locally

Once dependencies are installed and the `.env` configuration contains active Firebase keys, run the local development server:

```bash
npm run dev
```

The app will start instantly, usually mapping to `http://localhost:5173`. Open this URL in your web browser.

To verify that the application compiles perfectly for a production build, run:
```bash
npm run build
```

---

## 8. Deployment Instructions (Vercel)

TaskFlow is optimized to be hosting-ready and is fully compatible with [Vercel](https://vercel.com/) deployment.

### Deploying via Vercel CLI (Quickest)
1. Install Vercel globally:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment setup from your project directory:
   ```bash
   vercel
   ```
   Follow the prompts to link your Vercel account.
3. **CRITICAL STEP**: Add your production Environment Variables on Vercel. Go to the project settings dashboard on Vercel, select **Environment Variables**, and input the keys:
   * `VITE_FIREBASE_API_KEY`
   * `VITE_FIREBASE_AUTH_DOMAIN`
   * `VITE_FIREBASE_PROJECT_ID`
   * `VITE_FIREBASE_STORAGE_BUCKET`
   * `VITE_FIREBASE_MESSAGING_SENDER_ID`
   * `VITE_FIREBASE_APP_ID`
4. Deploy the live build:
   ```bash
   vercel --prod
   ```

---

## 9. Assumptions Made

* **Google Identity Prerequisite**: Users are assumed to have a Google account to access and utilize the application.
* **Active Internet Access**: An active network connection is required at all times to perform real-time reads and writes with Cloud Firestore.
* **Authentication Exclusivity**: Each user only sees their own tasks. This is strictly enforced via Firestore query filters on `userId == user.uid` and guaranteed at the database level by Firestore Security Rules.
* **Default Task Status**: Newly created tasks are automatically set to the status **Planned** as the initial baseline.

---

## 10. Known Limitations

* **No Offline Sync Support**: Changes made while offline will not immediately synchronize. A connection is necessary.
* **No Task Deletion**: As specified in the requirements to prevent feature creep, there is no option to delete existing tasks.
* **No Advanced Task Filtering**: Tasks are displayed in a clean, chronological list (newest first) without filtering by category, search strings, or priority.
* **No Native Notifications**: Push notifications or reminder bells are excluded to preserve simplicity.

---

## 11. AI Usage Summary

* **AI Tooling**: Developed using the **CHATGPT**.
* **How AI Assisted**:
  1. Provided full project initialization configurations.
  2. Scaffolding design of components (`Spinner.jsx`, `TaskCard.jsx`, `TaskForm.jsx`) using precise, responsive Tailwind styling.
  3. Structured standard global state providers (`AuthContext.jsx`) and hook abstractions (`useTasks.js`) to decouple Firestore and authentication from presentation.
  4. Programmed conditional, guard-routed App navigation (`App.jsx`).
* **Manual Adjustments**: None required. Scaffolding is fully functional and ready for runtime ingestion of environment parameters.
