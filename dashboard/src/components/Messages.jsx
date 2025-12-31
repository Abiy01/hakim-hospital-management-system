import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "../config/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/message/getall`,
        { withCredentials: true }
      );
      setMessages(data.messages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/message/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.put(
        `${API_URL}/api/v1/message/${editingMessage._id}`,
        {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        },
        { withCredentials: true }
      );
      toast.success("Message updated successfully!");
      setShowEditForm(false);
      setEditingMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update message");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>
      {showEditForm && editingMessage && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h2>Edit Message</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={editingMessage.firstName}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={editingMessage.lastName}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={editingMessage.email}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={editingMessage.phone}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                defaultValue={editingMessage.message}
                required
                rows="4"
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Update</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingMessage(null);
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
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
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
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;