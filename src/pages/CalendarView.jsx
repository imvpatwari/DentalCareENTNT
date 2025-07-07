import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isSameDay } from 'date-fns';
import DatePicker from 'react-datepicker'; // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import '../styles/CalendarView.css'; // Your custom styles for the container and list

const CalendarView = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date

  useEffect(() => {
    // Role-based access control: Only Admin can view calendar
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Admin') {
      navigate('/');
    }

    // Load appointments (incidents) from localStorage
    const data = JSON.parse(localStorage.getItem('incidents')) || [];
    setAppointments(data);
  }, [navigate]);

  // Helper function to get appointments for a specific day
  const getAppointmentsForDay = (day) => {
    if (!day) return []; // Handle case where no date is selected
    return appointments.filter((a) =>
      isSameDay(parseISO(a.appointmentDate), day)
    );
  };

  const dailyAppointments = getAppointmentsForDay(selectedDate); // Appointments for the currently selected date

  return (
    <div className="calendar-container p-6">
      <h2 className="calendar-title text-2xl font-bold mb-6">Appointment Calendar</h2>

      {/* Date Picker Component */}
      <div className="flex justify-center mb-8">
        <div className="date-picker-wrapper">
          <label htmlFor="appointment-date-picker" className="sr-only">Select Date</label>
          <DatePicker
            id="appointment-date-picker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="PPP" // Formats the date nicely (e.g., "Jun 28, 2025")
            className="custom-datepicker-input" // Apply custom styling to the input field
            placeholderText="Select an appointment date"
            isClearable
            showPopperArrow={false} // Optional: hides the arrow on the popover
          />
        </div>
      </div>

      {/* Appointments List for Selected Date */}
      {selectedDate && (
        <div className="appointment-list-section mt-8 p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">
            Appointments on {format(selectedDate, 'PPP')}
          </h3>
          <ul className="space-y-3">
            {dailyAppointments.length > 0 ? (
              dailyAppointments.map((a) => (
                <li key={a.id} className="border p-3 rounded-lg shadow-sm bg-gray-50">
                  <p><strong>Title:</strong> {a.title}</p>
                  <p><strong>Description:</strong> {a.description}</p>
                  <p><strong>Time:</strong> {format(parseISO(a.appointmentDate), 'p')}</p>
                  <p><strong>Status:</strong> <span className="font-semibold text-blue-700">{a.status}</span></p>
                  {a.comments && <p><strong>Comments:</strong> {a.comments}</p>}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No appointments scheduled for this date.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarView;