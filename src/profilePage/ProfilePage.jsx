import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Clock, Settings, LogOut, User, Mail, Globe, 
    ChevronRight, MapPin, Calendar } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import privateToursData from "../toursPage/toursData.json"
import "./ProfilePage.css";

function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favourites");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFullProfile = async () => {
        // 1. Получаем базовые данные сессии (ID пользователя)
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
        navigate("/login");
        return;
        }

        // 2. Тянем расширенные данные из нашей таблицы profiles
        const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

        if (!profileError && profileData) {
        // Соединяем email из auth и данные из профиля
        setUser({ ...profileData, email: authUser.email });
        } else {
        // Если профиль вдруг не найден, используем данные из auth как запасной вариант
        setUser({
            full_name: authUser.user_metadata?.full_name || "Traveler",
            email: authUser.email,
            avatar_url: authUser.user_metadata?.avatar_url
        });
        }
        
        setLoading(false);
    };

    fetchFullProfile();
    }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const tabs = [
    { id: "favourites", label: t("profile.tab_favourites", "Избранное"), icon: <Heart size={18} /> },
    { id: "bookings",   label: t("profile.tab_bookings", "Бронирования"), icon: <Clock size={18} /> },
    { id: "settings",  label: t("profile.tab_settings", "Настройки"), icon: <Settings size={18} /> },
  ];

  return (
    <div className="profile-page-root">
      <NavbarCustom />

      {/* Hero полоска */}
      <div className="profile-hero">
        <Container>
          <div className="profile-hero-inner">
            {/* Аватар */}
            <div className="profile-avatar">
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt="avatar" />
                ) : (
                    <span>{user.full_name?.[0]?.toUpperCase() || "U"}</span>
                )}
            </div>
            <div className="profile-hero-info">
                <h2 className="profile-name">
                    {user.full_name || "Guest"}
                </h2>
              <p className="profile-email">
                <Mail size={14} className="me-1" />
                {user.email}
              </p>
            </div>
            <button className="profile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              {t("profile.logout", "Выйти")}
            </button>
          </div>
        </Container>
      </div>

      <Container className="profile-content py-5">
        {/* Табы */}
        <div className="profile-tabs mb-5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Контент табов */}
        {activeTab === "favourites" && <FavouritesTab user={user} />}
        {activeTab === "bookings"   && <BookingsTab user={user} />}
        {activeTab === "settings"   && <SettingsTab user={user} setUser={setUser} />}
      </Container>

      <Footer />
    </div>
  );
}


// ─── ТАБ: ИЗБРАННОЕ ───────────────────────────────────────────
// 1. В самом верху файла ProfilePage.jsx (где импорты) добавь свой JSON:
// import privateToursData from "../data/privateTours.json"; 

function FavouritesTab({ user }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHybridData = async () => {
      setLoading(true);
      
      // 1. Берем все tour_id из таблицы favourites
      const { data: favRows, error } = await supabase
        .from("favourites")
        .select("tour_id")
        .eq("user_id", user.id);

      if (error || !favRows) {
        setLoading(false);
        return;
      }

      const allFavIds = favRows.map(f => f.tour_id);

      // 2. Тянем детали ГРУППОВЫХ туров из базы
      const { data: dbTours } = await supabase
        .from("group_eco_tours")
        .select("id, title, image, price, location, type")
        .in("id", allFavIds);

      // 3. Тянем детали ПРИВАТНЫХ туров из JSON
      // (Подставь сюда правильное имя переменной твоего импортированного JSON)
      const jsonTours = privateToursData
        .filter(t => allFavIds.includes(t.id))
        .map(t => ({
          ...t,
          // Приводим поля к единому формату, если в JSON они называются иначе
          image: t.imageUrl || t.image, 
          type: "private" 
        }));

      // 4. Объединяем результаты
      const combined = [...(dbTours || []), ...jsonTours];
      setFavourites(combined);
      setLoading(false);
    };

    fetchHybridData();
  }, [user.id]);

  const removeFavourite = async (tourId) => {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("tour_id", tourId);

    if (!error) {
      setFavourites(prev => prev.filter(f => f.id !== tourId));
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  if (favourites.length === 0) return (
    <div className="profile-empty-state">
      <Heart size={48} className="empty-icon" />
      <h4>{t("profile.no_favourites", "Нет избранных туров")}</h4>
      <p>{t("profile.no_favourites_sub", "Добавляй туры в избранное и они появятся здесь")}</p>
      <Link to="/group-eco-tours" className="profile-cta-btn">
        {t("profile.browse_tours", "Посмотреть туры")}
      </Link>
    </div>
  );

  return (
    <Row className="g-4">
      {favourites.map((tour) => (
        <Col md={6} lg={4} key={tour.id}>
          <div className="profile-tour-card">
            <div className="profile-tour-img" style={{ backgroundImage: `url(${tour.image})` }}>
              <button className="profile-heart-btn active" onClick={() => removeFavourite(tour.id)}>
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
            <div className="profile-tour-body">
              <div className="profile-tour-type">{tour.type}</div>
              <h5 className="profile-tour-title">{tour.title?.[currentLang] || tour.title?.en}</h5>
              <div className="profile-tour-footer">
                <span className="profile-tour-price">{tour.price}</span>
                <Link
                  to={tour.type === "private" ? `/private-tours/${tour.id}` : `/group-tour/${tour.id}`}
                  className="profile-tour-link"
                >
                  {t("profile.view", "Открыть")} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}


// ─── ТАБ: БРОНИРОВАНИЯ ────────────────────────────────────────
function BookingsTab({ user }) {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setBookings(data || []);
      setLoading(false);
    };
    fetch();
  }, [user.id]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  if (bookings.length === 0) return (
    <div className="profile-empty-state">
      <Clock size={48} className="empty-icon" />
      <h4>{t("profile.no_bookings", "Нет бронирований")}</h4>
      <p>{t("profile.no_bookings_sub", "Ваши будущие и прошлые поездки появятся здесь")}</p>
      <Link to="/tours" className="profile-cta-btn">
        {t("profile.book_tour", "Забронировать тур")}
      </Link>
    </div>
  );

  return (
    <div className="bookings-list">
      {bookings.map(booking => (
        <div key={booking.id} className="booking-card">
          <div className="booking-card-left">
            <div className={`booking-status ${booking.status}`}>
              {t(`profile.status_${booking.status}`, booking.status)}
            </div>
            <h5 className="booking-tour-name">{booking.tour_name}</h5>
            <div className="booking-meta">
              <span><Calendar size={13} /> {booking.start_date}</span>
              <span><MapPin size={13} /> {booking.location}</span>
            </div>
          </div>
          <div className="booking-card-right">
            <div className="booking-price">{booking.price}</div>
            <div className="booking-people">{booking.people} чел.</div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── ТАБ: НАСТРОЙКИ ───────────────────────────────────────────
function SettingsTab({ user, setUser }) {
  const { t, i18n } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user.user_metadata?.full_name || "");

  const handleSaveName = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    // Обновляем таблицу profiles
    const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', authUser.id);

    if (!error) {
        setSaved(true);
        // Обновляем локальное состояние, чтобы имя сразу изменилось в шапке
        setUser(prev => ({ ...prev, full_name: name }));
        setTimeout(() => setSaved(false), 2500);
    } else {
        alert("Ошибка при сохранении: " + error.message);
    }
    };

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <div className="settings-wrapper">

      {/* Личные данные */}
      <div className="settings-card">
        <h5 className="settings-title">
          <User size={18} /> {t("profile.personal_info", "Личные данные")}
        </h5>
        <div className="settings-field">
          <label>{t("profile.name", "Имя")}</label>
          <input
            className="settings-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t("profile.name_placeholder", "Ваше имя")}
          />
        </div>
        <div className="settings-field">
          <label>{t("profile.email_label", "Email")}</label>
          <input className="settings-input" value={user.email} disabled />
        </div>
        <button className="settings-save-btn" onClick={handleSaveName}>
          {saved ? t("profile.saved", "Сохранено ✓") : t("profile.save", "Сохранить")}
        </button>
      </div>

      {/* Язык */}
      <div className="settings-card">
        <h5 className="settings-title">
          <Globe size={18} /> {t("profile.language", "Язык")}
        </h5>
        <div className="lang-options">
          {[
            { code: "en", label: "English" },
            { code: "ru", label: "Русский" },
            { code: "hy", label: "Հայերեն" },
          ].map(l => (
            <button
              key={l.code}
              className={`lang-btn ${i18n.language === l.code ? "active" : ""}`}
              onClick={() => changeLanguage(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;