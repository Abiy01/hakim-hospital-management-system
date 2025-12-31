import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config/api";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    rejectedAppointments: 0,
    totalMessages: 0,
    recentAppointments: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/dashboard/stats`,
        { withCredentials: true }
      );
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch appointments
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/appointment/getall`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }

      // Fetch dashboard statistics
      fetchStats();
    };
    
    fetchData();
    
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
      // Refresh stats after update
      fetchStats();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/appointment/delete/${appointmentId}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      // Refresh stats after delete
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Welcome to the Hakim Hospital Management System. Here you can manage 
                appointments, doctors, patients, and monitor the overall operations of 
                the hospital. Use the dashboard to access real-time statistics and 
                administrative tools.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{stats.totalAppointments}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{stats.totalDoctors}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteAppointment(appointment._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          {}
        </div>
      </section>
    </>
  );
};

export default Dashboard;