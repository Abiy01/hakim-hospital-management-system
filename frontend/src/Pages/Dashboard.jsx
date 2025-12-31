import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../main";
import { API_URL } from "../config/api";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import ProfileSection from "../components/ProfileSection";

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    rejectedAppointments: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/appointment/patient/myappointments`,
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

    if (isAuthenticated && user?.role === "Patient") {
      fetchAppointments();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "Patient") {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="patient-dashboard form-component">
      <div className="container">
        <div className="dashboard-header">
          <h2>My Dashboard</h2>
          <p>Welcome, {user.firstName} {user.lastName}</p>
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
                      <span className="label">Doctor:</span>{" "}
                      <span className="value">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </span>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>You don't have any appointments yet.</p>
              <a href="/appointment" className="btn-primary">Book an Appointment</a>
            </div>
          )}
        </div>
          </>
        )}

        {activeTab === "profile" && (
          <ProfileSection userRole="Patient" />
        )}
      </div>
    </section>
  );
};

export default Dashboard;

