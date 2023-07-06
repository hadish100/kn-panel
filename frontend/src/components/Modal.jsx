import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

const Modal = ({ children, onClose, actionBar }) => {
    return ReactDOM.createPortal(
        <div className="modal__background" onClick={onClose}>
            <div className="modal__content">
                {children}
                {actionBar}
            </div>
        </div>,
        document.querySelector(".modal-container")
    )
}

export default Modal;