import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { API_URL } from "../config/api";

const ProfileSection = ({ userRole }) => {
  const { user, setUser } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    doctorDepartment: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        nic: user.nic || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
        doctorDepartment: user.doctorDepartment || "",
      });
      setAvatarPreview(user.avatar?.url || user.docAvatar?.url || null);
    }
  }, [user]);

  const getProfileEndpoint = () => {
    if (userRole === "Patient") return "/api/v1/user/patient/profile";
    if (userRole === "Doctor") return "/api/v1/user/doctor/profile";
    return null;
  };

  const getPasswordEndpoint = () => {
    if (userRole === "Patient") return "/api/v1/user/patient/password";
    if (userRole === "Doctor") return "/api/v1/user/doctor/password";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (PNG, JPEG, or WEBP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("nic", formData.nic);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("gender", formData.gender);
      if (userRole === "Doctor" && formData.doctorDepartment) {
        formDataToSend.append("doctorDepartment", formData.doctorDepartment);
      }

      // Add avatar if a new one is selected
      const avatarInput = document.querySelector('input[type="file"][name="avatar"]');
      if (avatarInput && avatarInput.files[0]) {
        formDataToSend.append("avatar", avatarInput.files[0]);
      }

      const endpoint = getProfileEndpoint();
      const { data } = await axios.put(
        `${API_URL}${endpoint}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);
      setUser(data.user);
      // Refresh user data
      const meEndpoint = endpoint.replace("/profile", "/me");
      const meResponse = await axios.get(`${API_URL}${meEndpoint}`, {
        withCredentials: true,
      });
      setUser(meResponse.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = getPasswordEndpoint();
      const { data } = await axios.put(
        `${API_URL}${endpoint}`,
        passwordData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Information
        </button>
        <button
          className={`tab-button ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="profile-form-container">
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="avatar-section">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                )}
              </div>
              <div className="avatar-upload">
                <label htmlFor="avatar" className="avatar-label">
                  Change Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <p className="avatar-hint">PNG, JPEG or WEBP (Max 5MB)</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  required
                  maxLength={12}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              {userRole === "Doctor" && (
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="doctorDepartment"
                    value={formData.doctorDepartment}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentsArray.map((department, index) => (
                      <option key={index} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-update">
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="profile-form-container">
          <form onSubmit={handlePasswordUpdate} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
              <small>Password must be at least 8 characters long</small>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-update">
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;

