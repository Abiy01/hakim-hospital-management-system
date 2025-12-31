import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { API_URL } from "../config/api";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import ProfileSection from "../components/ProfileSection";

const DoctorDashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    rejectedAppointments: 0,
  });

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/appointment/doctor/myappointments`,
        { withCredentials: true }
      );
      setAppointments(data.appointments || []);
      
      // Calculate stats
      const total = data.appointments?.length || 0;
      const pending = data.appointments?.filter(apt => apt.status === "Pending").length || 0;
      const accepted = data.appointments?.filter(apt => apt.status === "Accepted").length || 0;
      const rejected = data.appointments?.filter(apt => apt.status === "Rejected").length || 0;
      
      setStats({
        totalAppointments: total,
        pendingAppointments: pending,
        acceptedAppointments: accepted,
        rejectedAppointments: rejected,
      });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "Doctor") {
      fetchAppointments();
    }
  }, [isAuthenticated, user]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/appointment/doctor/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment status");
      console.error("Failed to update appointment status:", error);
    }
  };

  if (!isAuthenticated || user?.role !== "Doctor") {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="doctor-dashboard form-component">
      <div className="container">
        <div className="dashboard-header">
          <h2>Doctor Dashboard</h2>
          <p>Welcome, Dr. {user.firstName} {user.lastName}</p>
          {user.doctorDepartment && (
            <p className="department-badge">Department: {user.doctorDepartment}</p>
          )}
        </div>

        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab-button ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
          <button
            className={`dashboard-tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {activeTab === "appointments" && (
          <>
            <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <p>Total Appointments</p>
            <h3>{stats.totalAppointments}</h3>
          </div>
          <div className="stat-card stat-card-pending">
            <p>Pending</p>
            <h3>{stats.pendingAppointments}</h3>
          </div>
          <div className="stat-card stat-card-accepted">
            <p>Accepted</p>
            <h3>{stats.acceptedAppointments}</h3>
          </div>
          <div className="stat-card stat-card-rejected">
            <p>Rejected</p>
            <h3>{stats.rejectedAppointments}</h3>
          </div>
        </div>

        <div className="appointments-section">
          <h4>My Appointments</h4>
          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <h5>{appointment.department}</h5>
                    <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p>
                      <span className="label">Patient:</span>{" "}
                      <span className="value">
                        {appointment.firstName} {appointment.lastName}
                      </span>
                    </p>
                    <p>
                      <span className="label">Email:</span>{" "}
                      <span className="value">{appointment.email}</span>
                    </p>
                    <p>
                      <span className="label">Phone:</span>{" "}
                      <span className="value">{appointment.phone}</span>
                    </p>
                    <p>
                      <span className="label">Date:</span>{" "}
                      <span className="value">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <span className="label">Time:</span>{" "}
                      <span className="value">
                        {new Date(appointment.appointment_date).toLocaleTimeString()}
                      </span>
                    </p>
                    <p>
                      <span className="label">Address:</span>{" "}
                      <span className="value">{appointment.address}</span>
                    </p>
                    <p>
                      <span className="label">Visited:</span>{" "}
                      <span className="value">
                        {appointment.hasVisited ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </span>
                    </p>
                    <p>
                      <span className="label">Gender:</span>{" "}
                      <span className="value">{appointment.gender}</span>
                    </p>
                    <p>
                      <span className="label">NIC:</span>{" "}
                      <span className="value">{appointment.nic}</span>
                    </p>
                  </div>
                  {appointment.status === "Pending" && (
                    <div className="appointment-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleStatusUpdate(appointment._id, "Accepted")}
                      >
                        Accept Appointment
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleStatusUpdate(appointment._id, "Rejected")}
                      >
                        Reject Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>You don't have any appointments yet.</p>
            </div>
          )}
        </div>
          </>
        )}

        {activeTab === "profile" && (
          <ProfileSection userRole="Doctor" />
        )}
      </div>
    </section>
  );
};

export default DoctorDashboard;

