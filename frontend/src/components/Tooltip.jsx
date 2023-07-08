import React from "react";
import { motion, AnimatePresence } from "framer-motion"


import "./Tooltip.css"

const Tooltip = ({ children, isHovered }) => {
    return (
        <AnimatePresence>
            {isHovered && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    class="tooltip"
                >
                    <motion.Tooltip>{children}</motion.Tooltip>
                </motion.span>
            )}
        </AnimatePresence>
    )
}

export default Tooltip