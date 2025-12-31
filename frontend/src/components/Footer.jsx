import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    {
      id: 1,
      day: "Monday",
      time: "8:00 AM - 8:00 PM",
    },
    {
      id: 2,
      day: "Tuesday",
      time: "8:00 AM - 8:00 PM",
    },
    {
      id: 3,
      day: "Wednesday",
      time: "8:00 AM - 8:00 PM",
    },
    {
      id: 4,
      day: "Thursday",
      time: "8:00 AM - 8:00 PM",
    },
    {
      id: 5,
      day: "Friday",
      time: "8:00 AM - 6:00 PM",
    },
    {
      id: 6,
      day: "Saturday",
      time: "9:00 AM - 4:00 PM",
    },
    {
      id: 7,
      day: "Sunday",
      time: "Emergency Only",
    },
  ];

  return (
    <>
      <footer className={"container"}>
        <hr />
        <div className="content">
          <div>
            <span className="logo-text">Hakim</span>
            <p style={{ marginTop: "15px", fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
              Providing exceptional healthcare services with compassion and expertise. 
              Your health and well-being are our top priorities.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <Link to={"/"}>Home</Link>
              <Link to={"/appointment"}>Appointment</Link>
              <Link to={"/about"}>About</Link>
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <ul>
              {hours.map((element) => (
                <li key={element.id}>
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <div>
              <FaPhone />
              <span>+251975642413</span>
            </div>
            <div>
              <MdEmail />
              <span>aragieabiy@gmail.com</span>
            </div>
            <div>
              <FaLocationArrow />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;