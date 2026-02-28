import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import MyIcon from './aragats-transparent.png';
import "./Navbar.css";

const NavbarCustom = ({ isHomePage }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef({});
  
  const [showDropdown, setShowDropdown] = useState({
    tours: false, services: false, about: false, lang: false
  });

  useEffect(() => {
    const handleScroll = () => {
      // Используем более надежный расчет высоты
      const vh = window.innerHeight;
      const scrollPos = window.scrollY;

      if (isHomePage) {
        // На главной: строго после 100vh (минус высота самого навара)
        // Если пользователь прокрутил меньше 95% экрана, scrolled всегда false
        if (scrollPos > vh * 1) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      } else {
        // На остальных страницах: всегда true (фиксирован сразу)
        setScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleToggle = (key, isOpen) => {
    setShowDropdown(prev => ({ ...prev, [key]: isOpen }));
  };

  const handleMouseEnter = (key) => {
    if (window.innerWidth > 991) {
      if (timeoutRef.current[key]) clearTimeout(timeoutRef.current[key]);
      setShowDropdown(prev => ({ ...prev, [key]: true }));
    }
  };

  const handleMouseLeave = (key) => {
    if (window.innerWidth > 991) {
      timeoutRef.current[key] = setTimeout(() => {
        setShowDropdown(prev => ({ ...prev, [key]: false }));
      }, 50);
    }
  };

  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const getCurrentLanguageLabel = () => i18n.language ? i18n.language.split("-")[0].toUpperCase() : "EN";

  // ЛОГИКА КЛАССОВ:
  // 1. Позиция
  const positionClass = isHomePage && !scrolled ? "nav-abs" : "nav-fixed";
  // 2. Анимация (Только для главной и только когда наступил скролл)
  const animationClass = (isHomePage && scrolled) ? "nav-animate-in" : "";
  // 3. Тема
  const themeClass = isHomePage && !scrolled ? "nav-transparent" : "nav-solid";

  return (
    <div className="navbar-container">
      <Navbar
        collapseOnSelect
        expand="lg"
        className={`custom-navbar ${positionClass} ${animationClass} ${themeClass}`}
      >
        <Container fluid className="px-3 px-lg-5">
          <LinkContainer to="/">
            <Navbar.Brand className="brand-logo">
              <img src={MyIcon} alt="Logo" className="logo-image-bg" />
              Parmani<span>Tour</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle className="custom-toggler" />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              <LinkContainer to="/"><Nav.Link className="nav-link-item">{t("navbar_custom.home_button")}</Nav.Link></LinkContainer>
              
              <NavDropdown
                title={t("navbar_custom.tours_button")}
                className="custom-dropdown"
                show={showDropdown.tours}
                onMouseEnter={() => handleMouseEnter('tours')}
                onMouseLeave={() => handleMouseLeave('tours')}
                onToggle={(isOpen) => handleToggle('tours', isOpen)}
                renderMenuOnMount
              >
                <LinkContainer to="/private-tours"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.private_tours")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/group-eco-tours"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.group_&_eco_tours")}</NavDropdown.Item></LinkContainer>
              </NavDropdown>

              <NavDropdown
                title={t("navbar_custom.services")}
                className="custom-dropdown"
                show={showDropdown.services}
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={() => handleMouseLeave('services')}
                onToggle={(isOpen) => handleToggle('services', isOpen)}
                renderMenuOnMount
              >
                <LinkContainer to="/hotels"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.hotels")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/transport"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.transport")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/all-in-one"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.all_in_one")}</NavDropdown.Item></LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/special"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.special")}</NavDropdown.Item></LinkContainer>
              </NavDropdown>

              <LinkContainer to="/contact"><Nav.Link className="nav-link-item">{t("navbar_custom.contact_button")}</Nav.Link></LinkContainer>

              <NavDropdown
                title={t("navbar_custom.about")}
                className="custom-dropdown"
                show={showDropdown.about}
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={() => handleMouseLeave('about')}
                onToggle={(isOpen) => handleToggle('about', isOpen)}
                renderMenuOnMount
              >
                <NavDropdown.Item href="/history" className="dropdown-item">{t("navbar_custom.history")}</NavDropdown.Item>
                <NavDropdown.Item href="/cuisine" className="dropdown-item">{t("navbar_custom.cuisine")}</NavDropdown.Item>
                <NavDropdown.Item href="/nature" className="dropdown-item">{t("navbar_custom.nature")}</NavDropdown.Item>
                <NavDropdown.Item href="/culture" className="dropdown-item">{t("navbar_custom.culture")}</NavDropdown.Item>
                <NavDropdown.Item href="/about-us" className="dropdown-item">{t("navbar_custom.about_us")}</NavDropdown.Item>
              </NavDropdown>

              <div className="language-divider d-none d-lg-block"></div>

              <NavDropdown
                title={getCurrentLanguageLabel()}
                className="lang-dropdown-btn"
                align="end"
                show={showDropdown.lang}
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={() => handleMouseLeave('lang')}
                onToggle={(isOpen) => handleToggle('lang', isOpen)}
              >
                <NavDropdown.Item onClick={() => changeLanguage("en")}>🇺🇸 EN</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage("ru")}>🇷🇺 RU</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage("hy")}>🇦🇲 HY</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarCustom;