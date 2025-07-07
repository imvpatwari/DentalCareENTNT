import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient'); // Default role to Patient
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize mock data in localStorage if it doesn't exist
  useEffect(() => {
    const initializeLocalStorage = () => {
      const storedUsers = localStorage.getItem('users');
      const storedPatients = localStorage.getItem('patients');
      const storedIncidents = localStorage.getItem('incidents');

      // Only set if they don't exist to prevent overwriting
      if (!storedUsers) {
        const mockUsers = [
          { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
          { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' },
        ];
        localStorage.setItem('users', JSON.stringify(mockUsers));
      }

      if (!storedPatients) {
        const mockPatients = [
          {
            id: 'p1',
            name: 'John Doe',
            dob: '1990-05-10',
            contact: '1234567890',
            healthInfo: 'No allergies',
          },
        ];
        localStorage.setItem('patients', JSON.stringify(mockPatients));
      }

      if (!storedIncidents) {
        const mockIncidents = [
          {
            id: 'i1',
            patientId: 'p1',
            title: 'Toothache',
            description: 'Upper molar pain',
            comments: 'Sensitive to cold',
            appointmentDate: '2025-07-01T10:00:00', // Ensure dates are in the future for calendar view
            cost: 80,
            status: 'Completed',
            files: [
              // Placeholder for file data (e.g., base64 string)
              // In a real app, you'd store actual base64 or blob URLs here
              { name: 'invoice.pdf', url: 'data:application/pdf;base64,JVBERi0xLjQKB' },
              { name: 'xray.png', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA' }
            ],
          },
          {
            id: 'i2',
            patientId: 'p1',
            title: 'Dental Checkup',
            description: 'Routine checkup and cleaning',
            comments: 'No major issues, advise flossing',
            appointmentDate: '2025-07-15T14:30:00',
            cost: 120,
            status: 'Pending',
            files: [],
          },
          // Add more mock incidents for testing different statuses, costs, etc.
          {
            id: 'i3',
            patientId: 'p1',
            title: 'Filling Replacement',
            description: 'Replace old amalgam filling',
            comments: 'Patient sensitive to cold during procedure',
            appointmentDate: '2025-08-05T09:00:00',
            cost: 250,
            status: 'Scheduled',
            files: [],
          }
        ];
        localStorage.setItem('incidents', JSON.stringify(mockIncidents));
      }
    };

    initializeLocalStorage();
  }, []); // Empty dependency array means this runs once on component mount

  const handleLogin = () => {
    setError(''); // Clear previous errors
    const users = JSON.parse(localStorage.getItem('users'));

    if (!users || !Array.isArray(users)) {
      setError('No user data found. Mock data might not be initialized.');
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role // Added role check
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Navigate based on role
      if (user.role === 'Admin') {
        navigate('/dashboard'); // Admin dashboard route
      } else if (user.role === 'Patient') {
        // Patients should only see their own data, so pass their patientId
        navigate('/dashboard'); // Patient-specific dashboard/view route
      }
    } else {
      setError(`Invalid credentials for ${role} login. Please try again.`);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError(''); // Clear error when changing role

    // Optional: Pre-fill credentials for quick testing during development
    if (selectedRole === 'Admin') {
      setEmail('admin@entnt.in');
      setPassword('admin123');
    } else { // 'Patient'
      setEmail('john@entnt.in');
      setPassword('patient123');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">DENTAL CENTER!</h2>

        {error && (
          <div className="error-message" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="role-selection-container">
          <button
            className={`role-button ${role === 'Admin' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Admin')}
          >
            Login as Admin
          </button>
          <button
            className={`role-button ${role === 'Patient' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Patient')}
          >
            Login as Patient
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder={`Enter ${role.toLowerCase()} email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* This form-group specifically uses 'password-form-group' for a larger bottom margin */}
        <div className="form-group password-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder={`Enter ${role.toLowerCase()} password`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="login-button"
        >
          Login
        </button>

        <p className="footer-text">
          Need an account? <a href="#" className="footer-link">Contact your administrator.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;