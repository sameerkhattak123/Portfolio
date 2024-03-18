import { Link } from "react-scroll";
import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer--container">
      <hr className="divider" />
      <div className="footer--content--container">
        <div className="footer--contact">
          <div className="footer--contact-item">
            <FaPhone className="footer--contact-icon" />
            <span className="footer--contact-text">+92 3094863152</span>
          </div>
          <div className="footer--contact-item">
            <FaEnvelope className="footer--contact-icon" />
            <span className="footer--contact-text">sameerkhattak12345@gmail.com</span>
          </div>
        </div>
        <div className="footer--links">
          {/* Add your footer links here */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
