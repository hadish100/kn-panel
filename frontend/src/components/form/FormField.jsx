import React from 'react'

import { motion } from "framer-motion"
import Dropdown from "../Dropdown"
import MultiSelect from './inputs/MultiSelect'

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
    onChange,
    placeholder
}) => {

    if (type === "multi-select") {
        return (
            <motion.div className="modal__form__group" animate={{ x: 0, opacity: 1 }} initial={{ x: -40, opacity: 0 }} transition={{ delay: animateDelay }}>
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <MultiSelect options={options} value={value} onChange={onChange} placeholder={placeholder} />
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