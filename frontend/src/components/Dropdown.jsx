import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import "./Dropdown.css"
import { ReactComponent as ChevronDownIcon } from '../assets/svg/chevron-down.svg'

const Dropdown = ({ children, options, value, onChange }) => {
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
        <div className='dropdown-container'>
            <div ref={divEl} className={`dropdown ${isOpen ? "open" : "close"}`}>
                <div className="dropdown__value" onClick={handleClick}>
                    {value?.label || 10}
                    <ChevronDownIcon />
                </div>
                <AnimatePresence>
                    {isOpen &&
                        <motion.div
                            className='options'
                            initial={{ opacity: 0, y: -10 }} // Initial opacity and position
                            animate={{ opacity: 1, y: 0 }} // Animation to fully visible and original position
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: .3 }}
                        >
                            {renderedOptions}
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Dropdown