import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PatientIncidents.css'; // Import the new CSS file

const PatientIncidents = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', comments: '', appointmentDate: '',
    cost: '', status: '', nextDate: '', files: []
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Admin') navigate('/');

    const allIncidents = JSON.parse(localStorage.getItem('incidents')) || [];
    const patientIncidents = allIncidents.filter(i => i.patientId === patientId);
    setIncidents(patientIncidents);
  }, [navigate, patientId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      const fileArray = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setFormData(prev => ({ ...prev, files: fileArray }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedIncidents = JSON.parse(localStorage.getItem('incidents')) || [];
    if (editId) {
      const idx = updatedIncidents.findIndex(i => i.id === editId);
      // Ensure existing files are preserved if new ones aren't selected
      const currentFiles = updatedIncidents[idx].files || [];
      const newFiles = formData.files.length > 0 ? formData.files : currentFiles;

      updatedIncidents[idx] = {
        ...updatedIncidents[idx],
        ...formData,
        files: newFiles // Use new files if present, otherwise keep existing
      };
    } else {
      updatedIncidents.push({
        id: 'i' + Date.now(),
        patientId,
        ...formData
      });
    }
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
    setIncidents(updatedIncidents.filter(i => i.patientId === patientId));
    setFormData({ title: '', description: '', comments: '', appointmentDate: '', cost: '', status: '', nextDate: '', files: [] });
    setEditId(null);
  };

  const handleEdit = (incident) => {
    // Defensive check: ensure all fields are strings or arrays,
    // defaulting to empty string/array if incident property is null/undefined
    setFormData({
      title: incident.title || '',
      description: incident.description || '',
      comments: incident.comments || '',
      appointmentDate: incident.appointmentDate || '',
      cost: incident.cost || '',
      status: incident.status || '',
      nextDate: incident.nextDate || '',
      files: incident.files || [] // Ensure files is an array
    });
    setEditId(incident.id);
  };

  const handleDelete = (id) => {
    const updated = JSON.parse(localStorage.getItem('incidents')).filter(i => i.id !== id);
    localStorage.setItem('incidents', JSON.stringify(updated));
    setIncidents(updated.filter(i => i.patientId === patientId));
  };

  return (
    <div className="patient-incidents-container">
      <h2 className="incidents-header">Incidents for Patient ID: {patientId}</h2>

      <form onSubmit={handleSubmit} className="incident-form">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="form-input" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="form-textarea"></textarea>
        <input type="text" name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} className="form-input" />
        <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} className="form-input" />
        <input type="number" name="cost" placeholder="Cost" value={formData.cost} onChange={handleChange} className="form-input" />
        <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange} className="form-input" />
        <input type="datetime-local" name="nextDate" placeholder="Next Date" value={formData.nextDate} onChange={handleChange} className="form-input" />
        <input type="file" name="files" onChange={handleChange} multiple className="form-input form-file-input" />
        <button className="submit-button">{editId ? 'Update' : 'Add'} Incident</button>
      </form>

      <div className="incidents-list">
        {incidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <h3>{incident.title}</h3>
            <p>{incident.description}</p>
            <p><strong>Comments:</strong> {incident.comments}</p>
            <p><strong>Cost:</strong> ₹{incident.cost}</p>
            <p><strong>Status:</strong> {incident.status}</p>
            <p><strong>Appointment:</strong> {new Date(incident.appointmentDate).toLocaleString()}</p>
            <div className="incident-files">
              <strong>Files:</strong>
              {incident.files?.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
              ))}
            </div>
            <div className="incident-actions">
              <button onClick={() => handleEdit(incident)} className="action-button edit-button">Edit</button>
              <button onClick={() => handleDelete(incident.id)} className="action-button delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientIncidents;