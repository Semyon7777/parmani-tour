import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

const NavbarCustom = ({ isHomePage }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const getCurrentLanguageLabel = () =>
    i18n.language ? i18n.language.split("-")[0].toUpperCase() : "EN";

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
            Parmani<span>Tour</span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle className="custom-toggler" />

        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center">

            <LinkContainer to="/">
              <Nav.Link className="nav-link-item">
                {t("navbar_custom.home_button")}
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/tours">
              <Nav.Link className="nav-link-item">
                {t("navbar_custom.tours_button")}
              </Nav.Link>
            </LinkContainer>

            <NavDropdown
              title={t("navbar_custom.services")}
              className="custom-dropdown"
              renderMenuOnMount
            >
              <LinkContainer to="/hotels">
                <NavDropdown.Item>{t("navbar_custom.hotels")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/transport">
                <NavDropdown.Item>{t("navbar_custom.transport")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/all-in-one">
                <NavDropdown.Item>{t("navbar_custom.all_in_one")}</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/special">
                <NavDropdown.Item>{t("navbar_custom.special")}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/group-eco-tours">
                <NavDropdown.Item>{t("navbar_custom.group_&_eco_tours")}</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/contact">
              <Nav.Link className="nav-link-item">
                {t("navbar_custom.contact_button")}
              </Nav.Link>
            </LinkContainer>

            <NavDropdown
              title={t("navbar_custom.about")}
              className="custom-dropdown"
              renderMenuOnMount
            >
              <NavDropdown.Item href="/history">
                {t("navbar_custom.history")}
              </NavDropdown.Item>
              <NavDropdown.Item href="/cuisine">
                {t("navbar_custom.cuisine")}
              </NavDropdown.Item>
              <NavDropdown.Item href="/culture">
                {t("navbar_custom.culture")}
              </NavDropdown.Item>
              <NavDropdown.Item href="/nature">
                {t("navbar_custom.nature")}
              </NavDropdown.Item>

              <LinkContainer to="/about-us">
                <NavDropdown.Item>{t("navbar_custom.about_us")}</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <div className="language-divider d-none d-lg-block"></div>

            <NavDropdown
              title={getCurrentLanguageLabel()}
              className="lang-dropdown-btn"
              align="end"
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
