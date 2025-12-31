import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "../config/api";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/user/patients`,
        { withCredentials: true }
      );
      setPatients(data.patients);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch patients");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/user/patient/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.put(
        `${API_URL}/api/v1/user/patient/${editingPatient._id}`,
        {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          nic: formData.get("nic"),
          dob: formData.get("dob"),
          gender: formData.get("gender"),
        },
        { withCredentials: true }
      );
      toast.success("Patient updated successfully!");
      setShowEditForm(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update patient");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page patients">
      <h1>PATIENTS</h1>
      {showEditForm && editingPatient && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h2>Edit Patient</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={editingPatient.firstName}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={editingPatient.lastName}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={editingPatient.email}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={editingPatient.phone}
                required
              />
              <input
                type="text"
                name="nic"
                placeholder="NIC"
                defaultValue={editingPatient.nic}
                required
              />
              <input
                type="date"
                name="dob"
                defaultValue={editingPatient.dob.substring(0, 10)}
                required
              />
              <select name="gender" defaultValue={editingPatient.gender} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Update</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingPatient(null);
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
        {patients && patients.length > 0 ? (
          patients.map((element) => {
            return (
              <div className="card" key={element._id}>
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
          <h1>No Registered Patients Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Patients;

