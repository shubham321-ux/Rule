import React, { useEffect } from "react";
import "./css/PopupModal.css"; 
const PopupModal = ({ show, onClose, children }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset"; 
    }

    return () => {
      document.body.style.overflow = "unset"; 
    };
  }, [show]);

  if (!show) return null; 

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose(); // Close the modal if click is outside
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        {children} {/* Render passed content inside the modal */}
      </div>
    </div>
  );
};

export default PopupModal;
