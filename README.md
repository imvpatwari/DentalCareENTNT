# Dental Care Management Dashboard

**Deployed Application:** [https://dental-care-entnt-g1ce.vercel.app/]
**GitHub Repository:** [https://github.com/imvpatwari/DentalCareENTNT.git]

## Project Overview

This project is a web-based Dental Care Management Dashboard designed to streamline operations for a dental clinic. It provides interfaces for both administrators and patients, allowing for patient management, appointment scheduling, incident tracking, and personal profile viewing.

## Key Features

### Admin View
* **User Authentication:** Secure login for admin users.
* **Dashboard Overview:** Key Performance Indicators (KPIs) like Total Revenue, Treatment Status, Upcoming Appointments, and Top Patients.
* **Patient Management:** Add, view, edit, and delete patient records.
* **Incident Tracking:** Record and manage dental incidents (treatments, diagnoses) for each patient, including cost, status, and associated files.
* **Appointment Calendar:** View and manage appointments using an interactive calendar.

### Patient View
* **User Authentication:** Secure login for patient users.
* **My Profile:** View personal information and a list of their past and upcoming incidents/appointments.

## Technologies Used

* **Frontend:** React.js (with Vite for fast development)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **Date Handling:** `date-fns`, `react-datepicker`
* **State Management:** React's `useState` and `useEffect` hooks
* **Data Storage:** Local Storage (for simplicity in this demonstration)

## Setup and Local Development

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/imvpatwari/DentalCareENTNT.git]
    cd DentalCareENTNT # Or whatever your project folder is named
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or if you use yarn
    # yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173/` (or a similar port).

## Project Architecture

The application follows a standard React component-based architecture:

* **`src/`:** Contains all the application source code.
    * **`src/pages/`:** Houses the main views/components for each route (e.g., `Login.jsx`, `Dashboard.jsx`, `Patients.jsx`, `CalendarView.jsx`, `MyProfile.jsx`, `PatientIncidents.jsx`).
    * **`src/components/` (if any):** For smaller, reusable UI components (though this project might embed some directly within pages for simplicity).
    * **`src/styles/`:** Contains CSS files, primarily `Dashboard.css`, `Login.css`, and `Patients.css` for custom styling beyond Tailwind. `index.css` imports Tailwind.
    * **`src/utils/`:** Utility functions, such as `initializeLocalStorage.js` for populating mock data.
    * **`App.jsx`:** The main application component, handling routing.
    * **`main.jsx`:** Entry point for the React application.

**Data Flow:**
* User data, patient data, and incident data are stored and retrieved directly from the browser's `localStorage` for persistent data across sessions without a backend.
* Authentication is handled by checking mock user credentials against `localStorage`.

## Technical Decisions and Rationale

* **React with Vite:** Chosen for rapid development, hot module reloading, and efficient bundling.
* **Tailwind CSS:** Selected for its utility-first approach, enabling fast UI development and responsive design without writing extensive custom CSS. It allows for quick iteration and consistent styling.
* **Local Storage for Data:** For the scope of this project, `localStorage` provides a simple, immediate way to persist data between sessions without needing a backend server, allowing for a fully functional frontend demonstration.
* **Modular Component Structure:** Breaking the UI into pages and components (though some are combined for brevity) promotes reusability and maintainability.
* **`date-fns` and `react-datepicker`:** Standard, lightweight, and efficient libraries for date manipulation and calendar UI, respectively, chosen for their reliability and ease of use.
* **Role-Based Access Control (Basic):** Implemented simple role-based redirection to demonstrate different user experiences (Admin vs. Patient).

## Known Issues or Limitations

* **No Backend Integration:** Data is persisted in `localStorage` only. This means data is client-side and not shared across devices or users (other than through a single browser instance). A real-world application would require a backend (Node.js, Python, etc.) and a database.
* **Basic Authentication:** Authentication is very basic, using hardcoded mock users in `localStorage`. There's no password hashing, token management, or secure user registration.
* **File Uploads:** Files are stored as `Blob` URLs in `localStorage`, which are temporary and not persistent across browser restarts or different browsers. A real application would require cloud storage (e.g., AWS S3, Cloudinary).
* **Limited Error Handling/Validation:** While some basic form validation is present, robust error handling and comprehensive input validation are not fully implemented across all forms.
* **UI/UX Refinements:** Some UI elements could be further refined for better responsiveness and user experience on various screen sizes.

---