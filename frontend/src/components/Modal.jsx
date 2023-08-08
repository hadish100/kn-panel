import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion"

import "./Modal.css";

const Modal = ({ children, onClose, className, width }) => {
    useEffect(() => {
        document.body.classList.add("overflow-hidden")

        return () => { document.body.classList.remove("overflow-hidden") }
    }, [])

    return ReactDOM.createPortal(
        <motion.div
            className={`modal ${className}`}
            onMouseDown={onClose}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
        >
            <div className="modal__background" ></div>
            <div className="modal__content-container">
                <motion.div
                    className="modal__content"
                    onMouseUp={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{ width: width }}
                >
                    {children}
                </motion.div>
            </div>
        </motion.div >,
        document.querySelector(".modal-container")
    )
}

export default Modal;