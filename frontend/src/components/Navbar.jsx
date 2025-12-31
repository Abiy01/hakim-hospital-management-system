import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { API_URL } from "../config/api";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);

  const handleLogout = async () => {
    // Try patient logout first, then doctor logout, then admin logout
    try {
    await axios
      .get(`${API_URL}/api/v1/user/patient/logout`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(false);
        })
        .catch(() => {
          // If patient logout fails, try doctor logout
          axios
            .get(`${API_URL}/api/v1/user/doctor/logout`, {
              withCredentials: true,
            })
            .then((res) => {
              toast.success(res.data.message);
              setIsAuthenticated(false);
            })
            .catch(() => {
              // If doctor logout fails, try admin logout
              axios
                .get(`${API_URL}/api/v1/user/admin/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
                  toast.error(err.response?.data?.message || "Logout failed");
                  setIsAuthenticated(false);
                });
            });
      });
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <span className="logo-text">Hakim</span>
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
            {isAuthenticated && user?.role === "Patient" && (
              <Link to={"/dashboard"} onClick={() => setShow(!show)}>
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "Doctor" && (
              <Link to={"/doctor-dashboard"} onClick={() => setShow(!show)}>
                Doctor Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "Admin" && (
              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShow(!show)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Admin Dashboard
              </a>
            )}
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>
              LOGIN
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;