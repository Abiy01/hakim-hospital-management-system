import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "../config/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/user/doctors`,
        { withCredentials: true }
      );
      setDoctors(data.doctors);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/user/doctor/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.put(
        `${API_URL}/api/v1/user/doctor/${editingDoctor._id}`,
        {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          nic: formData.get("nic"),
          dob: formData.get("dob"),
          gender: formData.get("gender"),
          doctorDepartment: formData.get("doctorDepartment"),
        },
        { withCredentials: true }
      );
      toast.success("Doctor updated successfully!");
      setShowEditForm(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      {showEditForm && editingDoctor && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h2>Edit Doctor</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={editingDoctor.firstName}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={editingDoctor.lastName}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={editingDoctor.email}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={editingDoctor.phone}
                required
              />
              <input
                type="text"
                name="nic"
                placeholder="NIC"
                defaultValue={editingDoctor.nic}
                required
              />
              <input
                type="date"
                name="dob"
                defaultValue={editingDoctor.dob.substring(0, 10)}
                required
              />
              <select name="gender" defaultValue={editingDoctor.gender} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              <input
                type="text"
                name="doctorDepartment"
                placeholder="Department"
                defaultValue={editingDoctor.doctorDepartment}
                required
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Update</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDoctor(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card" key={element._id}>
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    DOB: <span>{element.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    NIC: <span>{element.nic}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(element)}
                    className="card-btn card-btn-edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(element._id)}
                    className="card-btn card-btn-delete"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;