import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
    const [style, setStyle] = useState({});
    const location = useLocation();
    const isAgentPath = location.pathname.startsWith('/agent');

    const calculateLinkStyles = (element) => {
        const liRect = element.getBoundingClientRect();
        const liWidth = liRect.width;
        const liLeftPostion = liRect.left;

        setStyle({ width: liWidth, transform: `translateX(${liLeftPostion}px)` });
    };

    const handleLinkClick = (event) => {
        const liElement = event.currentTarget.parentElement;
        calculateLinkStyles(liElement);
    };

    useEffect(() => {
        setTimeout(() => {
            const activeLiElement = document.querySelector('.navbar__links .active').parentElement;
            if (activeLiElement) {
                calculateLinkStyles(activeLiElement);
            }
        }, 40)
    }, [location.pathname]);

    const agentLinks = [
        { path: '/agent/users', linkText: 'Users' },
        { path: '/agent/settings', linkText: 'Settings' },
        { path: '/agent/log', linkText: 'Log' },
    ];

    const adminLinks = [
        { path: '/admin/panels', linkText: 'Panels' },
        { path: '/admin/agents', linkText: 'Agents' },
    ];

    return (
        <nav className='navbar'>
            <ul className='navbar__links'>
                {isAgentPath ? (
                    <>
                        {agentLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink to={link.path} className='navbar__link' onClick={handleLinkClick}>
                                    {link.linkText}
                                </NavLink>
                            </li>
                        ))}
                    </>
                ) : (
                    <>
                        {adminLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink to={link.path} className='navbar__link' onClick={handleLinkClick}>
                                    {link.linkText}
                                </NavLink>
                            </li>
                        ))}
                    </>
                )}
            </ul>

            <div className='navbar__line' style={style}></div>
            <div className='navbar__background-line'></div>
        </nav>
    );
};

export default Navbar;
