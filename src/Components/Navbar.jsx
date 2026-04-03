import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import MyIcon from './aragats-transparent.png';
import { supabase } from "../supabaseClient";
import { User, LogOut, LogIn } from "lucide-react";
import "./Navbar.css";

const NavbarCustom = ({ isHomePage }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef({});

  // 1. Сразу инициализируем состояние из локального хранилища (МГНОВЕННО)
  const [firstName, setFirstName] = useState(localStorage.getItem("parmani_user_name") || "");

  // ДОБАВИТЬ: user в состояние dropdown, чтобы работал hover для профиля
  const [showDropdown, setShowDropdown] = useState({
    tours: false, services: false, about: false, lang: false, user: false
  });

  // Вспомогательная функция для извлечения имени
  const extractFirstName = (user) => {
    if (!user) return "";
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(" ")[0]; // "Tony Stark" -> "Tony"
    return user.email?.split("@")[0] || "User";  // "tony@mail.com" -> "tony"
  };

  useEffect(() => {
    // ✅ Слушаем обновление имени из SettingsTab
    const handleNameUpdate = (e) => {
      setFirstName(e.detail);
    };
    
    window.addEventListener("user_name_updated", handleNameUpdate);
    return () => window.removeEventListener("user_name_updated", handleNameUpdate);
  }, []);


  useEffect(() => {
    // 1. Проверяем реальную сессию в фоне
    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (activeSession) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", activeSession.user.id)
          .maybeSingle();

        const name = profile?.full_name
          ? profile.full_name.split(" ")[0]
          : extractFirstName(activeSession.user);

        // ✅ Обновляем только если имя реально изменилось
        // Если в localStorage уже правильное имя — не трогаем, флика нет
        if (name !== localStorage.getItem("parmani_user_name")) {
          setFirstName(name);
          localStorage.setItem("parmani_user_name", name);
        }
      } else {
        localStorage.removeItem("parmani_user_name");
        setFirstName("");
      }
    };

    checkSession();

    // 2. Слушатель изменений авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        // ✅ Обновляем имя только если кеша нет (первый вход)
        // Если кеш есть — там уже актуальное имя из profiles, не трогаем
        const cached = localStorage.getItem("parmani_user_name");
        if (!cached) {
          const name = extractFirstName(currentSession.user);
          setFirstName(name);
          localStorage.setItem("parmani_user_name", name);
        }
      } else {
        setFirstName("");
        localStorage.removeItem("parmani_user_name");
      }
    });

    // 3. Логика скролла
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollPos = window.scrollY;

      if (isHomePage) {
        setScrolled(scrollPos > vh);
      } else {
        setScrolled(true);
      }
    };

    // Возвращаем passive: true для плавной прокрутки
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [isHomePage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("parmani_user_name"); // Обязательно чистим при выходе
    setFirstName("");
    window.location.href = "/";
  };

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

  // TELEGRAM
  function isTelegramInApp() {
    // Detect on Android
    if (typeof window.TelegramWebview !== 'undefined') {
        return true;
    }
    // Detect on iOS
    if (typeof window.TelegramWebviewProxy !== 'undefined' || 
        typeof window.TelegramWebviewProxyProto !== 'undefined') {
        return true;
    }
    // Detect Telegram Mini App (TMA)
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        return true;
    }
    return false;
  }
  

  return (
    <>
    {isTelegramInApp() && <div className="tg-safe-area-filler" />} 
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
            <Nav className="ms-auto align-items-center home-button-mobile-style-correcting">
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
                <LinkContainer to={{ pathname: "/special", search: "?tab=school" }}><NavDropdown.Item className="dropdown-item">{t("navbar_custom.school_tours")}</NavDropdown.Item></LinkContainer>
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
                // renderMenuOnMount
              >
                <LinkContainer to="/history"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.history")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/cuisine"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.cuisine")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/nature"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.nature")}</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/culture"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.culture")}</NavDropdown.Item></LinkContainer>
              </NavDropdown>

              {/* СЕКЦИЯ ПРОФИЛЯ */}
              {/* УСЛОВНЫЙ РЕНДЕРИНГ С ИСПОЛЬЗОВАНИЕМ КЕША */}
              {firstName ? (
                <NavDropdown
                  title={<span className="d-flex align-items-center"><User size={18} className="me-1" />{firstName}</span>}
                  className="custom-dropdown user-profile-dropdown"
                  show={showDropdown.user}
                  onMouseEnter={() => handleMouseEnter('user')}
                  onMouseLeave={() => handleMouseLeave('user')}
                  onToggle={(isOpen) => handleToggle('user', isOpen)}
                >
                  <LinkContainer to="/profile"><NavDropdown.Item className="dropdown-item">{t("navbar_custom.profile_button")}</NavDropdown.Item></LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item text-danger"><LogOut size={16} className="me-2" />{t("navbar_custom.logout")}</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/profile">
                  <Nav.Link className="nav-link-item login-btn-highlight"><LogIn size={18} className="me-1" />{t("navbar_custom.login_button")}</Nav.Link>
                </LinkContainer>
              )}
              
              <div className="language-divider d-none d-lg-block"></div>

              <NavDropdown
                title={getCurrentLanguageLabel()}
                className="lang-dropdown-btn lang-button-mobile-style-correcting"
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
    </>
  );
};

export default NavbarCustom;