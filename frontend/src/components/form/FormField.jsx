import React from 'react'

import { motion } from "framer-motion"
import Dropdown from "../Dropdown"
import MultiSelect from "./inputs/MultiSelect"
import MultiSelect2 from "./inputs/MultiSelect2"
import ValueAdjuster from './inputs/ValueAdjuster'
import MultiSelect5 from "./inputs/MultiSelect5"

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
    placeholder,
    editValue,
    styles
}) => {

    if (type === "multi-select") {
        return (
            <motion.div className={`modal__form__group`}>
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <MultiSelect editValue={editValue} styles={styles} />
            </motion.div>
        )
    }

    if (type === "multi-select2") {
        return (
            <motion.div className="modal__form__group" >
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <MultiSelect2 editValue={editValue} onChange={onChange} value={value} defaultValue={defaultValue} id={id} />
            </motion.div>
        )
    }

    if (type === "multi-select5") {
        console.log(onChange)
        return (
            <motion.div className="modal__form__group">
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <MultiSelect5 editValue={editValue} onChange={onChange} value={value} defaultValue={defaultValue} id={id} />
            </motion.div>
        )
    }

    if (type === "value-adjuster") {
        return (
            <motion.div className="modal__form__group" >
                <ValueAdjuster defaultValue={defaultValue} label={label} id={id} name={name} />
            </motion.div>
        )
    }

    if (type === "buy_volume") {
        return (
            <motion.div className="modal__form__group" style={{width:'calc(50% - 25px)'}} >
                <label className="modal__form__label" htmlFor={id}>{label}</label>
                <input className="modal__form__input" type={type} id={id} name={name} defaultValue={defaultValue} disabled={disabled} style={{width:'100%'}} onChange={onChange} value={value} />
            </motion.div>
        )
    }

    return (
        <motion.div className="modal__form__group">
            <label className="modal__form__label" htmlFor={id}>{label}</label>
            <input className="modal__form__input" type={type} id={id} name={name} defaultValue={defaultValue} disabled={disabled} />
        </motion.div>
    )
}

export default FormField