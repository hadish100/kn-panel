import React, { useState, useEffect, useRef } from 'react'

import "./Dropdown.css"
import { ReactComponent as ChevronDownIcon } from '../assets/chevron-down.svg'

const Dropdown = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const divEl = useRef(null)

    useEffect(() => {
        const handler = (event) => {
            if (!divEl.current) return

            if (!divEl.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('click', handler, true)

        return () => {
            document.removeEventListener('click', handler, true)
        }
    }, [])

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    const handleOptionClick = (option) => {
        setIsOpen(false)
        onChange(option)
    }

    const renderedOptions = options.map((option) => {
        return <div className='option' onClick={() => handleOptionClick(option)} key={option.value}>{option.label}</div>
    })

    return (
        <div ref={divEl} className={`dropdown ${isOpen ? "open" : "close"}`}>
            <div className="dropdown__value" onClick={handleClick}>
                {value?.label || 10}
                <ChevronDownIcon />
            </div>
            {isOpen && <div className='options'>{renderedOptions}</div>}
        </div>
    )
}

export default Dropdown