import React from 'react';

import Modal from '../Modal';
import { motion, AnimatePresence } from 'framer-motion';
import LeadingIcon from '../LeadingIcon';
import { ReactComponent as XMarkIcon } from '../../assets/svg/x-mark.svg';
import FormField from '../form/FormField';
import Button from '../Button';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#396fe4' : '#396fe4',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#396fe4',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));








const Form = ({ onClose, showForm, title, iconComponent, formFields, primaryButtons, secondaryButtons, onSubmit, item }) => {

    const b2gb = (x) => parseInt(x / (2 ** 10) ** 3)

    const timeStampToDay = (timeStamp) => {
        const time = timeStamp - Math.floor(Date.now() / 1000)
        return Math.floor(time / 86400)
    }

    const getDefaultValue = (item, field) => {
        if (!item) {
            return "";
        }

        if (field.id === "volume" || field.id === "data_limit") {
            return b2gb(item[field.id]);
        } else if (field.id === "password") {
            return "";
        }

        if (field.id === "expire") {
            return timeStampToDay(item[field.id]);
        }

        return item[field.id];
    };

    const formHeader = (
        <header className="modal__header">
            <LeadingIcon>
                {iconComponent}
            </LeadingIcon>
            <h1 className="modal__title">{title}</h1>
            <div className="close-icon" onClick={onClose}>
                <XMarkIcon />
            </div>
        </header>
    )

    const formFooter = (
        <motion.footer className="modal__footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginRight: "auto", display: "flex" }}>
                {secondaryButtons?.map((button, index) => (

                index === 0 ? (
                    <Button
                    key={index}
                    className={button.className}
                    onClick={button.onClick}
                    >
                    {button.icon}
                    {/* {button.label} */}
                    </Button>
                ) : index === 1 ? (
                    <FormGroup key={index}>
                    <FormControlLabel
                    onClick={button.onClick}
                        control={<IOSSwitch sx={{ my:1,mx:2 }} defaultChecked />}
                    />
                    </FormGroup>
                ) : null

                ))}
            </div>
            {primaryButtons.map((button, index) => (
                <Button
                    key={index}
                    className={button.className}
                    onClick={button.onClick}
                >
                    {button.label}
                </Button>
            ))}
        </motion.footer>
    )

    return (
        <AnimatePresence>
            {showForm && (
                <Modal onClose={onClose}>
                    {formHeader}
                    <main className="modal__body">
                        <form className="modal__form">
                            {formFields.map((group, rowIndex) => (
                                <div key={rowIndex} className="flex gap-16">
                                    {Array.isArray(group) ? group.map((field, index) => {
                                        const defaultValue = getDefaultValue(item, field)

                                        return (<FormField
                                            key={index}
                                            label={field.label}
                                            type={field.type}
                                            id={field.id}
                                            name={field.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={defaultValue}
                                            disabled={field.disabled}
                                        />);
                                    }) : (
                                        <FormField
                                            key={rowIndex}
                                            label={group.label}
                                            type={group.type}
                                            id={group.id}
                                            name={group.name}
                                            animateDelay={rowIndex * 0.1}
                                            defaultValue={getDefaultValue(item, group)}
                                            disabled={group.disabled}
                                        />
                                    )}
                                </div>
                            ))}
                        </form>
                    </main>
                    {formFooter}
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default Form;
