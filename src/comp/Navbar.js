import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

function Navbar() {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const handleScroll = useCallback(() => {
        const currentScrollPos = window.pageYOffset;

        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

        setPrevScrollPos(currentScrollPos);
    }, [prevScrollPos]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <nav className={`navbar ${visible ? '' : 'navbar--hidden'}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <img src="/logo.png" alt="Logo" />
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <div className={click ? 'bar1 toggled' : 'bar1'}></div>
                    <div className={click ? 'bar2 toggled' : 'bar2'}></div>
                    <div className={click ? 'bar3 toggled' : 'bar3'}></div>
                </div>
                <div className={click ? 'navbar-buttons nav-menu-active' : 'navbar-buttons'}>
                    <Button classLabel="btnGo" label="اشتري الان" to="https://api.whatsapp.com/send/?phone=201095303755&text&type=phone_number&app_absent=0" classLabelForA=" me-5" />
                    <Button classLabel="btnGo" label="تسجيل الدخول" to="/login" classLabelForA="" />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
