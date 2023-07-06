import React from "react";

import "./Modal.css";

const Modal = ({ children, closeModal }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>
                    &times;
                </span>
                {children}
            </div>
        </div>
    );
}

export default Modal;