import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [lineStyles, setLineStyles] = useState({ width: 0, transform: 'translateX(0)' });
    const [navWidth, setNavWidth] = useState(10);
    const [style, setStyle] = useState({});
    const navRef = useRef(null);

    let liLeftHover
    const handleLinkHover = (event) => {
        const liElement = event.currentTarget;
        const liRect = liElement.getBoundingClientRect();
        const liWidth = liRect.width;
        liLeftHover = liRect.left;

        setLineStyles({ width: liWidth, transform: `translateX(${liLeftHover}px)` });
    };

    const resetLine = () => {
        setLineStyles({ width: 0, transform: `translateX(calc(${navWidth} - ${liLeftHover}))` });
    };


    useEffect(() => {
        const updateNavWidth = () => {
            if (navRef.current) {
                const ulWidth = navRef.current.offsetWidth;
                setNavWidth(ulWidth);
            }
        };

        setTimeout(() => {
            const activeLiElement = document.querySelector('.navbar__links .active');
            if (activeLiElement) {
                const activeLiRect = activeLiElement.getBoundingClientRect();
                const activeLiWidth = activeLiRect.width;
                const activeLiLeft = activeLiRect.left;
                setStyle({ width: activeLiWidth, transform: `translateX(${activeLiLeft}px)` });
            }
        }, 200);

        window.addEventListener('resize', updateNavWidth);
        updateNavWidth();

        return () => {
            window.removeEventListener('resize', updateNavWidth);
        };
    }, []);

    const handleClick = () => {
        setStyle(lineStyles);
    }

    return (
        <>
            <nav className='navbar'>
                <ul className='navbar__links'>
                    <li
                        onMouseOver={handleLinkHover}
                        onMouseOut={resetLine}
                        onFocus={handleLinkHover}
                        onBlur={resetLine}
                    >
                        <NavLink to='/panel/users' className='navbar__link' onClick={handleClick}>
                            Users
                        </NavLink>
                    </li>
                    <li
                        onMouseOver={handleLinkHover}
                        onMouseOut={resetLine}
                        onFocus={handleLinkHover}
                        onBlur={resetLine}
                    >
                        <NavLink className='navbar__link' to='/panel/settings' onClick={handleClick} >
                            Settings
                        </NavLink>
                    </li>
                    <li
                        onMouseOver={handleLinkHover}
                        onMouseOut={resetLine}
                        onFocus={handleLinkHover}
                        onBlur={resetLine}
                    >
                        <NavLink className='navbar__link' to='/panel/log' onClick={handleClick} >
                            Log
                        </NavLink>
                    </li>
                </ul>
                {Object.keys(style).length === 0 && (
                    <div className="navbar__line" style={lineStyles}></div>
                )}
                <div className="navbar__line" style={style}></div>
                <div className="navbar__background-line"></div>
            </nav>
        </>
    );
};

export default Navbar;
