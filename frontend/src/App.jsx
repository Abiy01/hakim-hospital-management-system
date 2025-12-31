import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import DoctorDashboard from "./Pages/DoctorDashboard";
import Profile from "./Pages/Profile";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import { API_URL } from "./config/api";
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to fetch patient first
        try {
          const response = await axios.get(
            `${API_URL}/api/v1/user/patient/me`,
            {
              withCredentials: true,
            }
          );
          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (patientError) {
          // If patient fails, try doctor
          try {
            const response = await axios.get(
              `${API_URL}/api/v1/user/doctor/me`,
              {
                withCredentials: true,
              }
            );
            setIsAuthenticated(true);
            setUser(response.data.user);
          } catch (doctorError) {
            // If doctor fails, try admin
            try {
              const response = await axios.get(
                `${API_URL}/api/v1/user/admin/me`,
                {
                  withCredentials: true,
                }
              );
              setIsAuthenticated(true);
              setUser(response.data.user);
            } catch (adminError) {
              setIsAuthenticated(false);
              setUser({});
            }
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;