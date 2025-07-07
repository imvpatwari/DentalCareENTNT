import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Patients.css'; // Import the CSS file

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '', dob: '', contact: '', healthInfo: ''
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Role-based access control
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Admin') {
      // If not an admin, redirect to login page
      navigate('/', { replace: true });
      return; // Stop execution of useEffect
    }

    // Load patients from localStorage
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatients(storedPatients);
  }, [navigate]); // Add navigate to dependency array

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.dob || !formData.contact || !formData.healthInfo) {
        alert('Please fill in all fields.');
        return;
    }

    let updatedPatients;
    if (editId) {
      // Update existing patient
      updatedPatients = patients.map(p =>
        p.id === editId ? { ...p, ...formData } : p
      );
      setEditId(null); // Exit edit mode
    } else {
      // Add new patient
      updatedPatients = [...patients, {
        id: 'p' + Date.now(), // Simple unique ID
        ...formData
      }];
    }
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setFormData({ name: '', dob: '', contact: '', healthInfo: '' }); // Clear form
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
        const updatedPatients = patients.filter(p => p.id !== id);
        setPatients(updatedPatients);
        localStorage.setItem('patients', JSON.stringify(updatedPatients));

        // Optional: Also delete incidents associated with this patient
        const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
        const updatedIncidents = incidents.filter(inc => inc.patientId !== id);
        localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
    }
  };

  const handleEdit = (patient) => {
    // Set form data to selected patient for editing
    setFormData(patient);
    setEditId(patient.id);
    // Optionally scroll to top to bring form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="patients-container">
      <h2 className="patients-title">Manage Patients</h2>

      <form onSubmit={handleSubmit} className="patient-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="form-input"
          required // HTML5 validation
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact"
          className="form-input"
          required
        />
        <input
          type="text"
          name="healthInfo"
          value={formData.healthInfo}
          onChange={handleChange}
          placeholder="Health Info"
          className="form-input"
          required
        />
        <button type="submit" className="form-button">
          {editId ? 'Update Patient' : 'Add Patient'}
        </button>
        {editId && (
            <button
                type="button" // Important: type="button" to prevent form submission
                onClick={() => {
                    setEditId(null);
                    setFormData({ name: '', dob: '', contact: '', healthInfo: '' });
                }}
                className="form-button" style={{ backgroundColor: '#6b7280' }} // A neutral color for cancel
            >
                Cancel Edit
            </button>
        )}
      </form>

      <div className="patients-list">
        {patients.length > 0 ? (
          patients.map(p => (
            <div key={p.id} className="patient-item">
              <div className="patient-info">
                <p><strong>{p.name}</strong> (DOB: {p.dob})</p>
                <p>Contact: {p.contact}</p>
                <p>Health Info: {p.healthInfo}</p>
              </div>
              <div className="patient-actions">
                <button onClick={() => handleEdit(p)} className="action-button edit-button">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="action-button delete-button">Delete</button>
                <button
                  onClick={() => navigate(`/patients/${p.id}/incidents`)}
                  className="action-button view-incidents-button"
                >
                  View Incidents
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No patients added yet. Add a new patient above.</p>
        )}
      </div>
    </div>
  );
};

export default Patients;