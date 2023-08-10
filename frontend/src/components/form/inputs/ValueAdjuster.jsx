import React, { useState } from 'react'

import Button from '../../Button'
import styles from './ValueAdjuster.module.css'

const ValueAdjuster = ({ defaultValue, label }) => {
    const [valueToAdjust, setValueToAdjust] = useState('')
    const [value, setValue] = useState(defaultValue)


    const addToValue = (e) => {
        e.preventDefault()
        setValue(parseFloat(value) + parseFloat(valueToAdjust))
        setValueToAdjust('')
    }

    const subtractFromValue = (e) => {
        e.preventDefault()
        setValue(parseFloat(value) - parseFloat(valueToAdjust))
        setValueToAdjust('')
    }

    return (
        <>
            <label className={styles.label} htmlFor="value-adjuster">{label}</label>
            <div className='flex flex-row'>
                <input className={styles.input} type="number" id="value-adjuster" name="value-adjuster" value={value} onChange={(e) => setValue(e.target.value)} />
                <div className='flex flex-row'>
                    <Button onClick={(e) => subtractFromValue(e)} className={`outlined ${styles.button}`}>-</Button>
                    <Button onClick={(e) => addToValue(e)} className={`outlined ${styles.button}`}>+</Button>
                </div>
                <input className={styles.input} type='number' name='value-adjuster' value={valueToAdjust} onChange={(e) => setValueToAdjust(e.target.value)} />
            </div>
        </>
    )
}

export default ValueAdjuster