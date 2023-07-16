import React from 'react'
import { motion } from "framer-motion"

const Accordion = ({ children }) => {
    return (
        <motion.div className="accordion"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, transition: { opacity: { duration: .2 } } }}
            transition={{ opacity: { duration: .6 } }}
        >
            {children}
        </motion.div>
    )
}

export default Accordion