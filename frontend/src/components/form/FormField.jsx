import React from 'react'

import { motion } from "framer-motion"
import Dropdown from "../Dropdown"

const FormField = ({
    label,
    type,
    id,
    name,
    animateDelay,
    defaultValue,
    disabled,
    options,
    value,
    onChange
}) => {

    if (type === "dropdown") {
        return (
            <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: animateDelay }}>
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <Dropdown options={options} value={value} onChange={onChange} />
            </motion.div>
        )
    }

    return (
        <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: animateDelay }}>
            <label className="modal__form__label" htmlFor={id}>{label}</label>
            <input className="modal__form__input" type={type} id={id} name={name} defaultValue={defaultValue} disabled={disabled} />
        </motion.div>
    )
}

export default FormField