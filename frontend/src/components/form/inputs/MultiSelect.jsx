import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { ReactComponent as ChevronDownIcon } from '../../../assets/svg/chevron-down.svg'
import { ReactComponent as XMarkIcon } from '../../../assets/svg/x-mark.svg'
import "./MultiSelect.css"

const MultiSelect = ({ options, placeholder, onChange, value }) => {
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
        setIsOpen(false)
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

        onChange(selectedOptions)
    }

    const renderedOptions = options
        .filter((option) => !selectedOptions.some((selectedOption) => selectedOption.value === option.value))
        .map((option, index) => {
            return (
                <motion.div
                    className='option'
                    onClick={() => handleOptionClick(option)}
                    key={option.value}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 0, opacity: 0 }}
                    transition={{ delay: index * 0.15 }}
                >
                    {option.label}
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
                            className='options'
                            initial={{ height: 0, opacity: 0, y: -10 }} // Initial opacity and position
                            animate={{ height: "auto", opacity: 1, y: 0 }} // Transition to height and opacity
                            exit={{ height: 0, opacity: 0, y: -10 }} // Exit to initial opacity and position
                            transition={{ duration: 0.2 }} // Duration of animation
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