import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Ensure your Dashboard.css is linked

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/');
    } else {
      setUser(currentUser);
      // Load all patients and incidents for KPI calculations
      const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
      const storedIncidents = JSON.parse(localStorage.getItem('incidents')) || [];
      setPatients(storedPatients);
      setIncidents(storedIncidents);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // --- KPI Calculation Logic ---

  // Total Revenue
  const totalRevenue = incidents.reduce((sum, incident) => sum + (parseFloat(incident.cost) || 0), 0);

  // Treatment Status (Completed vs. Unknown/Pending)
  const completedTreatments = incidents.filter(i => i.status?.toLowerCase() === 'completed').length;
  const unknownTreatments = incidents.filter(i => i.status?.toLowerCase() !== 'completed').length;

  // Next 10 Appointments
  const now = new Date();
  const upcomingAppointments = incidents
    .filter(i => i.appointmentDate && new Date(i.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10); // Get next 10

  // Top Patients by Revenue
  const patientRevenueMap = incidents.reduce((acc, incident) => {
    acc[incident.patientId] = (acc[incident.patientId] || 0) + (parseFloat(incident.cost) || 0);
    return acc;
  }, {});

  const topPatients = Object.entries(patientRevenueMap)
    .map(([patientId, revenue]) => {
      const patient = patients.find(p => p.id === patientId);
      return {
        name: patient ? patient.name : `Patient ${patientId}`, // Fallback if patient not found
        revenue: revenue
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5 patients

  // Recent Activity (Last 5 Completed Treatments)
  const recentCompletedTreatments = incidents
    .filter(i => i.status?.toLowerCase() === 'completed' && i.appointmentDate)
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)) // Sort descending
    .slice(0, 5);


  return (
    <div className="dashboard-container">
      <div className="main-dashboard-card p-6"> {/* Using a new class for the main card */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="welcome-title text-blue-800">
              Welcome, <span className="text-blue-600">{user?.email}</span>!
            </h1>
            <p className="role-text text-lg text-gray-600 mt-2">
              Logged in as: <strong>{user?.role}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium shadow-sm"
          >
            🔓 Logout
          </button>
        </div>

        {/* Admin Controls */}
        {user?.role === 'Admin' && (
          <div className="control-group-section admin-controls-section">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Admin Controls</h2>
            {/* Changed from grid to flex-col to stack buttons vertically */}
            <div className="flex flex-col gap-3"> {/* 'gap-3' adds space between stacked items */}
                <button
                onClick={() => navigate('/patients')}
                className="control-button bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl"
                >
                👨‍⚕️ Manage Patients
                </button>

                <button
                onClick={() => navigate('/calendar')}
                className="control-button bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl"
                >
                🗓️ Appointment Calendar
                </button>
            </div>
          </div>
        )}

        {/* Patient Controls */}
        {user?.role === 'Patient' && (
          <div className="control-group-section patient-controls-section">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Patient Controls</h2>
            <div className="grid gap-4">
              <button
                onClick={() => navigate('/my-profile')}
                className="control-button bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl"
              >
                🧾 View My Appointments
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Dashboard KPIs Section (Unboxed) --- */}
      {user?.role === 'Admin' && (
        <div className="dashboard-kpis-section mt-8 p-6"> {/* Added padding to the section itself */}
          <h2 className="kpi-title text-2xl font-bold mb-6">Dental Center Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Reduced gap */}
            {/* Total Revenue KPI */}
            <div className="kpi-item revenue-kpi p-3"> {/* Smaller padding here too */}
              <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
              <p className="revenue-value text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>

            {/* Treatment Status KPI */}
            <div className="kpi-item treatment-status-kpi p-3">
              <h3 className="text-lg font-semibold mb-1">Treatment Status</h3>
              <ul className="list-none p-0 m-0">
                <li className="flex justify-between items-center mb-0.5">
                  <span>Completed:</span>
                  <span className="font-semibold text-green-600">{completedTreatments}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Unknown/Pending:</span>
                  <span className="font-semibold text-yellow-600">{unknownTreatments}</span>
                </li>
              </ul>
            </div>

            {/* Next 10 Appointments KPI */}
            <div className="kpi-item appointment-kpi p-3 md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-1">Next {upcomingAppointments.length} Appointments</h3>
              {upcomingAppointments.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {upcomingAppointments.map(appt => (
                    <li key={appt.id}>
                      <strong>{appt.title}</strong> for {patients.find(p => p.id === appt.patientId)?.name || `ID: ${appt.patientId}`}
                      <br />
                      <span className="text-xs text-gray-600">
                        {new Date(appt.appointmentDate).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No upcoming appointments.</p>
              )}
            </div>

            {/* Top Patients by Revenue KPI */}
            <div className="kpi-item top-patients-kpi p-3 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-1">Top Patients (by Revenue)</h3>
              {topPatients.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {topPatients.map((patient, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{patient.name}</span>
                      <span className="font-semibold">₹{patient.revenue.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No patient revenue data.</p>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="kpi-item recent-activity-kpi mt-4 p-3"> {/* New class and padding */}
            <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
            <h4 className="text-lg font-semibold mb-1">Last 5 Completed Treatments</h4>
            {recentCompletedTreatments.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {recentCompletedTreatments.map(incident => (
                  <li key={incident.id}>
                    <strong>{incident.title}</strong> for {patients.find(p => p.id === incident.patientId)?.name || `ID: ${incident.patientId}`}
                    <br />
                    <span className="text-xs text-gray-600">
                      Completed on: {new Date(incident.appointmentDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No recent completed treatments.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;