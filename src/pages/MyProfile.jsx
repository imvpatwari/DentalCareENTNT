import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyProfile.css'; // Add this line

const MyProfile = () => {
  const [, setUser] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [myIncidents, setMyIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Patient') {
      navigate('/');
    } else {
      setUser(currentUser);

      // Get patient data
      const patients = JSON.parse(localStorage.getItem('patients')) || [];
      const patient = patients.find(p => p.id === currentUser.patientId);
      setPatientData(patient);

      // Get patient's incidents
      const allIncidents = JSON.parse(localStorage.getItem('incidents')) || [];
      const userIncidents = allIncidents.filter(i => i.patientId === currentUser.patientId);
      setMyIncidents(userIncidents);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    // Apply the new CSS classes
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            🔓 Logout
          </button>
        </div>

        {patientData ? (
          <div className="personal-details-section section-spacing"> {/* Added section-spacing */}
            <h2 className="section-title">Personal Details</h2>
            <div className="details-list"> {/* Added details-list */}
              <p><strong>Name:</strong> {patientData.name}</p>
              <p><strong>DOB:</strong> {patientData.dob}</p>
              <p><strong>Contact:</strong> {patientData.contact}</p>
              <p><strong>Health Info:</strong> {patientData.healthInfo}</p>
            </div>
          </div>
        ) : (
          <p className="no-data-message section-spacing">Unable to load patient data.</p>
        )}

        <div>
          <h2 className="section-title">My Appointments</h2>
          <div className="appointments-list"> {/* Added appointments-list */}
            {myIncidents.length > 0 ? (
              myIncidents.map(incident => (
                <div key={incident.id} className="appointment-item">
                  <h3 className="appointment-title">{incident.title}</h3>
                  <p className="text-sm">{incident.description}</p>
                  <p><strong>Date:</strong> {new Date(incident.appointmentDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> {incident.status}</p>
                  <p><strong>Cost:</strong> ₹{incident.cost}</p>
                  <p><strong>Comments:</strong> {incident.comments}</p>
                  <p><strong>Next Date:</strong> {incident.nextDate ? new Date(incident.nextDate).toLocaleString() : 'N/A'}</p>

                  <div className="mt-2">
                    <strong>Files:</strong>
                    {incident.files?.length ? (
                      <ul className="file-list"> {/* Added file-list */}
                        {incident.files.map((f, i) => (
                          <li key={i}>
                            <a href={f.url} target="_blank" rel="noreferrer" className="file-link">
                              {f.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data-message">No files uploaded.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-message">No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;