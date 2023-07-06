import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

const Modal = ({ children, closeModal }) => {
    return ReactDOM.createPortal(
        <div className="modal">
            <div className="modal__background" onClick={closeModal}></div>
            <div className="modal__content">
                I am modal
            </div>
        </div>,
        document.querySelector(".modal-container")
    )
}

export default Modal;