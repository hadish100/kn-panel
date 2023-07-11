import React from "react";

import "./Button.css";
import { motion } from "framer-motion"

const Button = ({ children, onClick, className, disabled }) => {
    return (
        <motion.button
            className={`button ${className}`}
            onClick={onClick}
            whileTap={{ scale: 0.96 }}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}

export default Button;