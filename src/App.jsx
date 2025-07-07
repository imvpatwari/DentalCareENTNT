import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useEffect } from 'react';
import { initializeLocalStorage } from './utils/initData';
import PatientIncidents from './pages/PatientIncidents';
import Patients from './pages/Patients';
import CalendarView from './pages/CalendarView';
import MyProfile from './pages/MyProfile';

function App() {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients/:patientId/incidents" element={<PatientIncidents />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/my-profile" element={<MyProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
