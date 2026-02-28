import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import MyIcon from './aragats-transparent.png';
import "./Navbar.css";

const NavbarCustom = ({ isHomePage }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  
  // Состояние для управления раскрытием каждого дропдауна
  const [showDropdown, setShowDropdown] = useState({
    services: false,
    about: false,
    lang: false
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функция для клика (теперь будет работать на телефонах)
  const handleToggle = (key, isOpen) => {
    setShowDropdown(prev => ({ ...prev, [key]: isOpen }));
  };

  // Функция для открытия при наведении (только для ноутбуков)
  const handleMouseEnter = (key) => {
    if (window.innerWidth > 991) { // 991px - это стандартный порог 'lg' в Bootstrap
      setShowDropdown(prev => ({ ...prev, [key]: true }));
    }
  };

  // Функция для закрытия
  const handleMouseLeave = (key) => {
    if (window.innerWidth > 991) {
      setShowDropdown(prev => ({ ...prev, [key]: false }));
    }
  };

  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const getCurrentLanguageLabel = () => i18n.language ? i18n.language.split("-")[0].toUpperCase() : "EN";

  const transparentClass = isHomePage && !scrolled ? "navbar-transparent" : "";
  const fixedClass = !isHomePage ? "navbar-fixed" : "";
  
  return (
    <div className="navbar-container">
      <Navbar
        collapseOnSelect
        expand="lg"
        sticky="top"
        className={`custom-navbar ${scrolled ? "navbar-scrolled" : ""} ${transparentClass} ${fixedClass}`}
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
              
              <LinkContainer to="/">
                <Nav.Link className="nav-link-item">{t("navbar_custom.home_button")}</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/tours">
                <Nav.Link className="nav-link-item">{t("navbar_custom.tours_button")}</Nav.Link>
              </LinkContainer>

              {/* DROPDOWN SERVICES */}
              <NavDropdown
                title={t("navbar_custom.services")}
                className="custom-dropdown"
                // Управление состоянием
                show={showDropdown.services}
                onToggle={(isOpen) => handleToggle('services', isOpen)}
                // Наведение
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={() => handleMouseLeave('services')}
                renderMenuOnMount
              >
                <LinkContainer to="/hotels"><NavDropdown.Item>{t("navbar_custom.hotels")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/transport"><NavDropdown.Item>{t("navbar_custom.transport")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/all-in-one"><NavDropdown.Item>{t("navbar_custom.all_in_one")}</NavDropdown.Item></LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/special"><NavDropdown.Item>{t("navbar_custom.special")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/group-eco-tours"><NavDropdown.Item>{t("navbar_custom.group_&_eco_tours")}</NavDropdown.Item></LinkContainer>
              </NavDropdown>

              <LinkContainer to="/contact">
                <Nav.Link className="nav-link-item">{t("navbar_custom.contact_button")}</Nav.Link>
              </LinkContainer>

              {/* DROPDOWN ABOUT */}
              <NavDropdown
                title={t("navbar_custom.about")}
                className="custom-dropdown"
                show={showDropdown.about}
                onToggle={(isOpen) => handleToggle('about', isOpen)}
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={() => handleMouseLeave('about')}
                renderMenuOnMount
              >
                <NavDropdown.Item href="/history">{t("navbar_custom.history")}</NavDropdown.Item>
                <NavDropdown.Item href="/cuisine">{t("navbar_custom.cuisine")}</NavDropdown.Item>
                <NavDropdown.Item href="/culture">{t("navbar_custom.culture")}</NavDropdown.Item>
                <NavDropdown.Item href="/nature">{t("navbar_custom.nature")}</NavDropdown.Item>
                <LinkContainer to="/about-us"><NavDropdown.Item>{t("navbar_custom.about_us")}</NavDropdown.Item></LinkContainer>
              </NavDropdown>

              <div className="language-divider d-none d-lg-block"></div>

              {/* LANGUAGE DROPDOWN */}
              <NavDropdown
                title={getCurrentLanguageLabel()}
                className="lang-dropdown-btn"
                align="end"
                show={showDropdown.lang}
                onToggle={(isOpen) => handleToggle('lang', isOpen)}
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={() => handleMouseLeave('lang')}
              >
                <NavDropdown.Item onClick={() => changeLanguage("en")}>🇺🇸 English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage("ru")}>🇷🇺 Русский</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage("hy")}>🇦🇲 Հայերեն</NavDropdown.Item>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarCustom;
