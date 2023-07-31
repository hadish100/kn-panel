import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { ReactComponent as ChevronDownIcon } from '../../../assets/svg/chevron-down.svg'
import { ReactComponent as XMarkIcon } from '../../../assets/svg/x-mark.svg'
import "./MultiSelect.css"

const MultiSelect = ({ options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([])
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

    const handleShowDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleOptionClick = (option) => {
        setSelectedOptions((prevSelectedOptions) => {
            // Check if the option is already selected, if yes, remove it
            const isOptionSelected = prevSelectedOptions.some(
                (selectedOption) => selectedOption.value === option.value
            );

            if (isOptionSelected) {
                return prevSelectedOptions.filter(
                    (selectedOption) => selectedOption.value !== option.value

                );
            } else {
                // Add the option to selectedOptions
                return [...prevSelectedOptions, option];
            }
        });
    }

    const renderedOptions = options
        .filter((option) => !selectedOptions.some((selectedOption) => selectedOption.value === option.value))
        .map((option, index) => {
            return (

                <motion.div
                    className='multi-select__option'
                    onClick={() => handleOptionClick(option)}
                    key={option.value}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: .2 }}
                    layout
                >
                    <AnimatePresence>
                        <motion.div
                            style={{ padding: "0.43rem 0.7rem" }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: .2 }}
                            layout
                        >
                            {option.label}
                        </motion.div>
                    </AnimatePresence >
                </motion.div>
            )
        })

    const handleRemoveSelectedOption = (event) => {
        event.stopPropagation()
        const optionToRemove = event.target.parentNode.parentNode.textContent
        setSelectedOptions((prevSelectedOptions) => {
            return prevSelectedOptions.filter((selectedOption) => selectedOption.label !== optionToRemove)
        })
    }

    const renderedSelectedOptions = selectedOptions.map((selectedOption) => {
        return (
            <div className='multi-select__selection' layout>
                {selectedOption.label}
                <span className='x-icon'><XMarkIcon onClick={handleRemoveSelectedOption} /></span>
            </div>
        )
    })

    return (
        <div className='multi-select-container'>
            <div ref={divEl} key={options.value}>
                <div className="multi-select__value" onClick={handleShowDropdown}>
                    {selectedOptions.length === 0 ? placeholder : null}
                    {renderedSelectedOptions}
                    <span className={`chevrondown-icon ${isOpen ? "up" : "down"}`}>
                        {selectedOptions.length === options.length ? null : <ChevronDownIcon />}

                    </span>
                </div>
                <AnimatePresence>
                    {isOpen &&
                        <motion.div
                            className='multi-select__options'
                            initial={{ height: 0 }} // Initial opacity and position
                            animate={{ height: "auto" }} // Transition to height and opacity
                            exit={{ height: 0 }} // Exit to initial opacity and position
                            transition={{ duration: .2 }} // Duration of animation
                        >
                            {renderedOptions}
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div >
    )
}

export default MultiSelect