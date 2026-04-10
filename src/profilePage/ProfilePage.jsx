import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Clock, Settings, LogOut, User, Mail, Globe,
    ChevronRight, Calendar, Leaf, Users, QrCode, X } from "lucide-react";
import NavbarCustom from "../Components/Navbar";
import Footer from "../Components/Footer";
import { supabase } from "../supabaseClient";
import privateToursData from "../toursPage/toursData.json";
import DigitalTicket from "../Components/DigitalTicket";
import "./ProfilePage.css";
 
// ─── СКЕЛЕТОН для карточек пока грузятся данные ───────────────
function SkeletonCard() {
  return (
    <Col md={6} lg={4}>
      <div className="profile-tour-card" style={{ overflow: 'hidden' }}>
        <div style={{ height: '180px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        <div className="profile-tour-body">
          <div style={{ height: '12px', width: '40%', background: '#eee', borderRadius: '6px', marginBottom: '10px' }} />
          <div style={{ height: '18px', width: '80%', background: '#eee', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ height: '14px', width: '55%', background: '#eee', borderRadius: '6px' }} />
        </div>
      </div>
    </Col>
  );
}
 
// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────
function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favourites");
 
  // ✅ ВЕСЬ стейт живёт здесь — переключение табов не вызывает повторных запросов
  const [user, setUser]               = useState(null);
  const [favourites, setFavourites]   = useState([]);
  const [bookings, setBookings]       = useState([]);
 
  // Отдельные флаги загрузки — профиль блокирует весь экран,
  // остальное грузится в фоне и показывает скелетон внутри таба
  const [loadingProfile, setLoadingProfile]     = useState(true);
  const [loadingFavourites, setLoadingFavourites] = useState(true);
  const [loadingBookings, setLoadingBookings]   = useState(true);
 
  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
  const loadAllData = async () => {
    // ── Шаг 1: авторизация (быстро, из кеша Supabase SDK) ──────
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) { navigate("/login"); return; }
 
    // ── Шаг 2: три запроса ПАРАЛЛЕЛЬНО ─────────────────────────
    // Раньше: profile → (открыл таб) → favourites → (открыл таб) → bookings
    // Сейчас: всё сразу, пользователь видит шапку профиля почти мгновенно
    const [profileRes, favRes, bookingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
      supabase.from("favourites").select("tour_id").eq("user_id", authUser.id),
      supabase.from("bookings").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
    ]);
 
    // ── Профиль ────────────────────────────────────────────────
    const profileData = profileRes.data;
    setUser(
      profileData
        ? { ...profileData, email: authUser.email }
        : { id: authUser.id, full_name: authUser.user_metadata?.full_name || "Traveler",
            email: authUser.email, avatar_url: authUser.user_metadata?.avatar_url }
    );
    setLoadingProfile(false); // ← шапка профиля теперь видна
 
    // ── Бронирования ───────────────────────────────────────────
    if (!bookingsRes.error) setBookings(bookingsRes.data || []);
    setLoadingBookings(false);

 
    // ── Избранное: смешиваем Supabase + JSON ───────────────────
    const favIds = (favRes.data || []).map(f => f.tour_id);
 
    if (favIds.length > 0) {
      // Групповые туры берём из Supabase
      const { data: dbTours } = await supabase
        .from("group_eco_tours")
        .select("id, title, image, price, location, type, date")
        .in("id", favIds);
 
      // Приватные туры берём из локального JSON (без сетевого запроса)
      const jsonTours = privateToursData
        .filter(tour => favIds.includes(tour.id))
        .map(tour => ({ ...tour, image: tour.imageUrl || tour.image, type: "private" }));
 
      setFavourites([...(dbTours || []), ...jsonTours]);
    }
    setLoadingFavourites(false);
  };
 
  // ✅ ОПТИМИСТИЧНОЕ удаление из избранного:
  // карточка исчезает сразу, запрос идёт в фоне, при ошибке — восстанавливаем
  const removeFavourite = useCallback(async (tourId) => {
    const removed = favourites.find(f => f.id === tourId);
    setFavourites(prev => prev.filter(f => f.id !== tourId)); // мгновенно
 
    const { error } = await supabase
      .from("favourites").delete()
      .eq("user_id", user.id).eq("tour_id", tourId);
 
    if (error && removed) {
      setFavourites(prev => [...prev, removed]); // откат при ошибке
    }
  }, [favourites, user?.id]);
 
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
 
  if (loadingProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }
 
  const tabs = [
    { id: "favourites", label: t("profile.tab_favourites", "Избранное"),    icon: <Heart size={18} /> },
    { id: "bookings",   label: t("profile.tab_bookings",   "Бронирования"), icon: <Clock size={18} /> },
    { id: "settings",  label: t("profile.tab_settings",   "Настройки"),    icon: <Settings size={18} /> },
  ];
 
  return (
    <div className="profile-page-root">
      <NavbarCustom />
 
      <div className="profile-hero">
        <Container>
          <div className="profile-hero-inner">
            <div className="profile-avatar">
              {user.avatar_url
                ? <img src={user.avatar_url} alt="" />
                : <span>{user.full_name?.[0]?.toUpperCase() || "U"}</span>
              }
            </div>
            <div className="profile-hero-info">
              <h2 className="profile-name">{user.full_name || "Guest"}</h2>
              <p className="profile-email"><Mail size={14} className="me-1" />{user.email}</p>
            </div>
            <button className="profile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> {t("profile.logout", "Выйти")}
            </button>
          </div>
        </Container>
      </div>
 
      <Container className="profile-content py-5">
        <div className="profile-tabs mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>
 
        {/* Данные уже в стейте — переключение табов мгновенное */}
        {activeTab === "favourites" && (
          <FavouritesTab
            favourites={favourites}
            loading={loadingFavourites}
            onRemove={removeFavourite}
          />
        )}
        {activeTab === "bookings" && (
          <BookingsTab bookings={bookings} loading={loadingBookings} />
        )}
        {activeTab === "settings" && (
          <SettingsTab user={user} setUser={setUser} />
        )}
      </Container>
 
      <Footer />
    </div>
  );
}
 
 
// ─── ТАБ: ИЗБРАННОЕ ───────────────────────────────────────────
// Только отображает данные — никаких запросов, никаких useEffect
function FavouritesTab({ favourites, loading, onRemove }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
 
  if (loading) {
    return (
      <Row className="g-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </Row>
    );
  }
 
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
              {(tour.type === "eco" || tour.type === "group") && (
                <div className={`tour-card-minimal ${tour.type === "eco" ? "is-eco" : "is-group"}`}>
                  <div className="tour-type-badge">
                    {tour.type === "eco" ? <Leaf size={12} /> : <Users size={12} />}
                    <span>{tour.type === "eco" ? t("group_eco_tours.badge_eco") : t("group_eco_tours.badge_group")}</span>
                  </div>
                </div>
              )}
              <button className="profile-heart-btn active" onClick={() => onRemove(tour.id)}>
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
            <div className="profile-tour-body">
              <div className="profile-tour-type">{t(`profile.tour_type-${tour.type}`)}</div>
              <h5 className="profile-tour-title">
                {typeof tour.title === "object"
                  ? (tour.title[currentLang] || tour.title.en || tour.title.ru)
                  : tour.title}
              </h5>
              <div className="profile-tour-footer">
                <span className="profile-tour-price">{tour.price}</span>
                <Link
                  to={tour.type === "private" ? `/private-tours/${tour.id}` : tour.type === "eco" ? `/eco-tour/${tour.id}` : `/group-tour/${tour.id}`}
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
// Только отображает данные — никаких запросов, никаких useEffect
function BookingsTab({ bookings, loading }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [showQR, setShowQR] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  if (loading) return (
    <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
  );

  if (bookings.length === 0) return (
    <div className="profile-empty-state">
      <Clock size={48} className="empty-icon" />
      <h4>{t("profile.no_bookings", "Нет бронирований")}</h4>
      <p>{t("profile.no_bookings_sub", "Ваши будущие и прошлые поездки появятся здесь")}</p>
      <Link to="/private-tours" className="profile-cta-btn">
        {t("profile.book_tour", "Забронировать тур")}
      </Link>
    </div>
  );

  const filters = [
    { id: "all",       label: t("profile.filter_all",       "Все") },
    { id: "pending",   label: t("profile.status_pending",   "В обработке") },
    { id: "confirmed", label: t("profile.status_confirmed", "Подтверждено") },
    { id: "cancelled", label: t("profile.status_cancelled", "Отменено") },
  ];

  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <div>
      {/* Фильтры */}
      <div className="bookings-filter">
        {filters.map(f => (
          <button
            key={f.id}
            className={`bookings-filter-btn ${filter === f.id ? "active" : ""} ${f.id !== "all" ? `status-${f.id}` : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Список */}
      {filtered.length === 0 ? (
        <div className="text-center py-4 text-muted">
          {t("profile.no_filtered_bookings", "Нет бронирований с таким статусом")}
        </div>
      ) : (
        <div className="bookings-list">
          {filtered.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-left">
                <div className={`booking-status ${booking.status}`}>
                  {t(`profile.status_${booking.status}`, booking.status)}
                </div>
                <h5 className="booking-tour-name">{booking.tour_name}</h5>
                <div className="booking-meta">
                  {booking.travel_date && (
                    <span><Calendar size={13} /> {booking.travel_date}</span>
                  )}
                </div>
              </div>
              <div className="booking-card-right">
                <div className="booking-card-right-info">
                  <div className="booking-price">{booking.total_price}</div>
                  <div className="booking-people">{booking.guests_count} {t("profile.people")}</div>
                </div>

                <div className="booking-card-right-qr">
                {/* Кнопка билета появляется только для подтвержденных туров */}
                {booking.status === 'confirmed' && (
                  <button 
                    className="btn btn-outline-success btn-sm" 
                    onClick={() => { setSelectedBooking(booking); setShowQR(true); }}
                  >
                    <QrCode size={35} className="" />
                    <div className="booking-card-right-qr-text">{t("profile.qr_ticket")}</div>
                  </button>
                )}

                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Модальное окно для QR-билета */}
      <Modal 
        show={showQR} 
        onHide={() => setShowQR(false)} 
        centered 
        dialogClassName="qr-ticket-modal"
      >
        <Modal.Body className="border-0 bg-transparent">
          <button className="ticket-close-btn" onClick={() => setShowQR(false)}>
            <X size={30} />
          </button>
          {selectedBooking && <DigitalTicket booking={selectedBooking} />}
        </Modal.Body>
      </Modal>
      
    </div>
  );
}
 
 
// ─── ТАБ: НАСТРОЙКИ ───────────────────────────────────────────
function SettingsTab({ user, setUser }) {
  const { t, i18n } = useTranslation();
  const [name, setName]   = useState(user.full_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const NAME_LIMIT = 30;

  const handleSave = async () => {

    setSaving(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, phone: phone })
      .eq("id", authUser.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setUser(prev => ({ ...prev, full_name: name, phone }));
      const firstName = name.trim().split(" ")[0];
      localStorage.setItem("parmani_user_name", firstName);
      window.dispatchEvent(new CustomEvent("user_name_updated", { detail: firstName }));
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert("Ошибка при сохранении: " + error.message);
    }
  };

  return (
    <div className="settings-wrapper">
      {/* ── Личные данные ── */}
      <div className="settings-card">
        <h5 className="settings-title">
          <User size={18} /> {t("profile.personal_info", "Личные данные")}
        </h5>
        <div className="settings-field">
          <label>{t("profile.name", "Имя")}</label>
          <input
            className="settings-input"
            value={name}
            maxLength={NAME_LIMIT}
            onChange={e => setName(e.target.value)}
            placeholder={t("profile.name_placeholder", "Ваше имя")}
          />
        </div>
        <div className="settings-field">
          <label>{t("profile.email_label", "Email")}</label>
          <input className="settings-input" value={user.email} disabled />
        </div>
        <div className="settings-field">
          <label>{t("profile.phone", "Телефон")}</label>
          <input
            className="settings-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+374 XX XXX XXX"
            type="tel"
          />
        </div>
        <button className="settings-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "..." : saved ? t("profile.saved", "Сохранено ✓") : t("profile.save", "Сохранить")}
        </button>
      </div>

      {/* ── Язык ── */}
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
              onClick={() => i18n.changeLanguage(l.code)}
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