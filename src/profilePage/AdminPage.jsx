import React, { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { 
  Users, Calendar, Heart, Hotel, Globe, LogOut, Lock, MapPin,
  Trash2, Edit2, Check, X, Plus, RefreshCw, Image, Eye, Map,
  Search, Save, ChevronDown, ChevronUp, TrendingUp, EyeOff,
  } from "lucide-react";
import "./AdminPage.css";

const TAB_PASSWORDS = {
  bookings:          "parmanibook",
  group_eco_tours:   "parmanitours",
  private_tours:     "parmaniprivate",
  profiles:          "parmaniusers",
  hotels:            "parmanihotels",
  favourites:        "parmanifav",
  locations_library: "parmaniloc",
};

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────
function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [adminUser, setAdminUser] = useState(null);
  const [unlockedTabs, setUnlockedTabs] = useState(new Set());

  const handleUnlock = (tabId) => setUnlockedTabs(prev => new Set([...prev, tabId]));

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("is_admin, full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (!data?.is_admin) { navigate("/"); return; }
      setAdminUser(data);
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  

  const tabs = [
    { id: "bookings",        label: "Бронирования", icon: <Calendar size={18} /> },
    { id: "group_eco_tours", label: "Group & Eco Туры",          icon: <Globe size={18} /> },
    { id: "private_tours",   label: "Приватные туры", icon: <Map size={18} /> },
    { id: "profiles",        label: "Пользователи", icon: <Users size={18} /> },
    { id: "hotels",          label: "Отели",         icon: <Hotel size={18} /> },
    { id: "favourites",      label: "Избранное",     icon: <Heart size={18} /> },
    { id: "locations_library", label: "Места", icon: <MapPin size={18} /> }
  ];

  if (!adminUser) return (
    <div className="admin-loading"><div className="admin-spinner" /></div>
  );

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">⚙️</span>
          <span>Admin Panel</span>
        </div>
        <div className="admin-user-info">
          <div className="admin-avatar">{adminUser.full_name?.[0]?.toUpperCase() || "A"}</div>
          <span>{adminUser.full_name || "Admin"}</span>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={16} /> Выйти
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
        </div>
        { [
            { id: "bookings",          component: <BookingsTable /> },
            { id: "group_eco_tours",   component: <ToursTable /> },
            { id: "private_tours",     component: <PrivateToursTable /> },
            { id: "profiles",          component: <GenericTable table="profiles" columns={["full_name", "email", "phone"]} /> },
            { id: "hotels",            component: <HotelsTable /> },
            { id: "favourites",        component: <GenericTable table="favourites" columns={["user_id", "tour_id"]} viewOnly /> },
            { id: "locations_library", component: <LocationsLibrary /> },
          ].map(({ id, component }) => (
            <Fragment key={id}> 
              {activeTab === id && (
                unlockedTabs.has(id)
                  ? component
                  : <TabPasswordGate tabId={id} onUnlock={handleUnlock} />
              )}
            </Fragment>
          ))
        }
      </main>
    </div>
  );
}

function TabPasswordGate({ tabId, onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    if (input === TAB_PASSWORDS[tabId]) {
      onUnlock(tabId);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60vh", gap: "16px"
    }}>
      <Lock size={36} strokeWidth={1.5} color="#6c757d" />
      <h3 style={{ margin: 0 }}>Введите пароль</h3>
      <div style={{display: "flex", gap: "10px"}}>
        <input
          type={show ? "text" : "password"}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
          style={{
            padding: "10px 16px", borderRadius: "8px",
            border: `1.5px solid ${error ? "#dc3545" : "#dee2e6"}`,
            outline: "none", fontSize: "16px", width: "240px",
          }}
          placeholder="••••••••"
        />
        {error && <span style={{ color: "#dc3545", fontSize: "14px" }}>Неверный пароль</span>}
        <button
            onClick={() => setShow(p => !p)}
            style={{
              border: "none", cursor: "pointer", color: "#6c757d", padding: 0, background: "none"
            }}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      <button onClick={handleSubmit} style={{
        padding: "10px 32px", borderRadius: "8px", border: "none",
        background: "#198754", color: "#fff", fontWeight: 600, cursor: "pointer"
      }}>
        Войти
      </button>
    </div>
  );
}

// Обновляет spots в group_eco_tours на основе изменения статуса
const updateTourSpots = async (tourId, guestsCount, oldStatus, newStatus) => {
  // Получаем текущее количество мест
  const { data: tour } = await supabase
    .from("group_eco_tours")
    .select("spots")
    .eq("id", tourId)
    .maybeSingle();

  if (!tour) return;

  let spotsDelta = 0;

  // Если было active (confirmed/pending) → стало cancelled/deleted → возвращаем места
  const wasActive = oldStatus === "confirmed" || oldStatus === "pending";
  const isActive  = newStatus === "confirmed" || newStatus === "pending";

  if (wasActive && !isActive) {
    spotsDelta = +guestsCount; // возвращаем места
  } else if (!wasActive && isActive) {
    spotsDelta = -guestsCount; // забираем места
  }

  if (spotsDelta !== 0) {
    await supabase
      .from("group_eco_tours")
      .update({ spots: Math.max(0, tour.spots + spotsDelta) })
      .eq("id", tourId);
  }
};

// ─── ТАБЛИЦА БРОНИРОВАНИЙ ─────────────────────────────────────
function BookingsTable() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});

  const BOOKING_FIELDS = [
    { key: "tour_name",    label: "Тур" },
    { key: "full_name",    label: "Имя" },
    { key: "email",        label: "Email" },
    { key: "phone",        label: "Телефон" },
    { key: "travel_date",  label: "Дата" },
    { key: "guests_count", label: "Гостей", type: "number" },
    { key: "total_price",  label: "Сумма" },
    { key: "location",     label: "Локация" },
    { key: "status",       label: "Статус", type: "select", options: ["pending", "confirmed", "cancelled"] },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (booking) => { setEditingId(booking.id); setEditData({ ...booking }); };

  const saveEdit = async () => {
    const { id, created_at, user_id, tour_id, ...updateData } = editData;
    const oldBooking = bookings.find(b => b.id === editingId);
    
    const { error } = await supabase.from("bookings").update(updateData).eq("id", editingId);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === editingId ? { ...b, ...updateData } : b));
      setEditingId(null);

      // Если статус изменился — обновляем spots
      if (oldBooking?.status !== updateData.status && tour_id) {
        await updateTourSpots(tour_id, updateData.guests_count || oldBooking.guests_count, oldBooking.status, updateData.status);
      }
    }
  };

  const quickStatus = async (id, newStatus) => {
    const booking = bookings.find(b => b.id === id);
    
    // Оптимистично обновляем UI
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    
    if (error) {
      load(); // откат при ошибке
      return;
    }

    // Обновляем spots если статус изменился с active на inactive или наоборот
    if (booking?.tour_id) {
      await updateTourSpots(booking.tour_id, booking.guests_count, booking.status, newStatus);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Удалить бронирование?")) return;
    
    const booking = bookings.find(b => b.id === id);
    setBookings(prev => prev.filter(b => b.id !== id));
    
    await supabase.from("bookings").delete().eq("id", id);

    // Возвращаем места если бронь была активной
    if (booking?.tour_id && (booking.status === "confirmed" || booking.status === "pending")) {
      await updateTourSpots(booking.tour_id, booking.guests_count, booking.status, "cancelled");
    }
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.tour_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors = {
    pending:   { bg: "#fff8e1", color: "#f59e0b", label: "В обработке" },
    confirmed: { bg: "#e8f5e9", color: "#22c55e", label: "Подтверждено" },
    cancelled: { bg: "#fdecea", color: "#ef4444", label: "Отменено" },
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Поиск по туру, имени, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="admin-filters">
          {["all", "pending", "confirmed", "cancelled"].map(f => (
            <button key={f} className={`filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "Все" : statusColors[f]?.label}
            </button>
          ))}
        </div>
        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
      </div>

      {loading ? <AdminSkeleton /> : (
        <div className="admin-cards">
          {filtered.length === 0 ? (
            <div className="admin-empty">Бронирований не найдено</div>
          ) : filtered.map(booking => (
            <div key={booking.id} className="booking-admin-card">
              {editingId === booking.id ? (
                <div className="booking-edit-mode">
                  <div className="booking-edit-grid">
                    {BOOKING_FIELDS.map(field => (
                      <div key={field.key} className="booking-edit-field">
                        <label>{field.label}</label>
                        {field.type === "select" ? (
                          <select value={editData[field.key] || ""} onChange={e => setEditData(p => ({ ...p, [field.key]: e.target.value }))}>
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{statusColors[opt]?.label || opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input type={field.type || "text"} value={editData[field.key] || ""} onChange={e => setEditData(p => ({ ...p, [field.key]: e.target.value }))} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="booking-edit-actions">
                    <button className="admin-save-btn" onClick={saveEdit}><Save size={14} /> Сохранить</button>
                    <button className="admin-cancel-btn" onClick={() => setEditingId(null)}>Отмена</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="booking-admin-left">
                    <div className="booking-admin-name">{booking.full_name}</div>
                    <div className="booking-admin-tour">{booking.tour_name}</div>
                    <div className="booking-admin-meta">
                      {booking.email        && <span>📧 {booking.email}</span>}
                      {booking.phone        && <span>📞 {booking.phone}</span>}
                      {booking.travel_date  && <span>📅 {booking.travel_date}</span>}
                      {booking.location     && <span>📍 {booking.location}</span>}
                      {booking.guests_count && <span>👥 {booking.guests_count} чел.</span>}
                      {booking.total_price  && <span>💰 {booking.total_price}</span>}
                    </div>
                  </div>
                  <div className="booking-admin-right">
                    <span className="status-badge" style={{ background: statusColors[booking.status]?.bg, color: statusColors[booking.status]?.color }}>
                      {statusColors[booking.status]?.label || booking.status}
                    </span>
                    <div className="status-actions">
                      {booking.status !== "confirmed" && (
                        <button className="status-btn confirm" onClick={() => quickStatus(booking.id, "confirmed")}><Check size={14} /> Подтвердить</button>
                      )}
                      {booking.status !== "cancelled" && (
                        <button className="status-btn cancel" onClick={() => quickStatus(booking.id, "cancelled")}><X size={14} /> Отменить</button>
                      )}
                      {booking.status !== "pending" && (
                        <button className="status-btn pending" onClick={() => quickStatus(booking.id, "pending")}>В обработку</button>
                      )}
                    </div>
                    <div className="booking-card-btns">
                      <button className="admin-edit-btn" onClick={() => startEdit(booking)}><Edit2 size={14} /></button>
                      <button className="admin-delete-btn" onClick={() => deleteBooking(booking.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── ТАБЛИЦА ТУРОВ (список с полными полями) ──────────────────
function ToursTable() {
  const [tours, setTours]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});
  const [showAdd, setShowAdd]     = useState(false);
  const [newTour, setNewTour]     = useState({ type: "group", is_active: true });
  const [search, setSearch]       = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("group_eco_tours").select("*");
    setTours(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (tour) => {
    setEditingId(tour.id);
    setEditData({
      ...tour,
      // Превращаем массив в текст с отступами для удобного редактирования
      gallery: tour.gallery ? JSON.stringify(tour.gallery, null, 2) : "[]"
    });
    setExpandedId(tour.id);
  };
  const cancelEdit = () => { setEditingId(null); setExpandedId(null); };

  const saveEdit = async () => {
    try {
      const finalData = {
        ...editData,
        // Пытаемся превратить текст обратно в массив JSON
        gallery: typeof editData.gallery === 'string' ? JSON.parse(editData.gallery) : editData.gallery
      };

      const { error } = await supabase.from("group_eco_tours").update(finalData).eq("id", editingId);
      
      if (!error) {
        setTours(prev => prev.map(t => t.id === editingId ? finalData : t));
        cancelEdit();
      }
    } catch (e) {
      alert("Ошибка в формате JSON галереи! Проверьте запятые и кавычки.");
      console.error("JSON Parse Error:", e);
    }
  };

  const toggleActive = async (id, current) => {
    setTours(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
    await supabase.from("group_eco_tours").update({ is_active: !current }).eq("id", id);
  };

  const deleteTour = async (id) => {
    if (!window.confirm("Удалить тур?")) return;
    setTours(prev => prev.filter(t => t.id !== id));
    await supabase.from("group_eco_tours").delete().eq("id", id);
  };

  const addTour = async () => {
    const { data, error } = await supabase.from("group_eco_tours").insert([newTour]).select().single();
    if (!error && data) {
      setTours(prev => [data, ...prev]);
      setShowAdd(false);
      setNewTour({ type: "group", is_active: true });
    }
  };

  const getTitle = (t) => typeof t.title === "object" ? (t.title?.ru || t.title?.en || "") : (t.title || "");

  const filtered = tours.filter(t => getTitle(t).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-table-wrapper">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Поиск туров..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="admin-add-btn" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} /> Добавить тур
        </button>
        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
      </div>

      {/* Форма добавления */}
      {showAdd && (
        <div className="admin-add-form">
          <h4>Новый тур</h4>
          <div className="add-form-grid">
            <input placeholder="Название EN" onChange={e => setNewTour(p => ({ ...p, title: { ...p.title, en: e.target.value } }))} />
            <input placeholder="Название RU" onChange={e => setNewTour(p => ({ ...p, title: { ...p.title, ru: e.target.value } }))} />
            <input placeholder="Название HY" onChange={e => setNewTour(p => ({ ...p, title: { ...p.title, hy: e.target.value } }))} />
            <input placeholder="Цена (напр: 15000)" onChange={e => setNewTour(p => ({ ...p, price: e.target.value }))} />
            <input placeholder="Дата (DD.MM.YYYY)" onChange={e => setNewTour(p => ({ ...p, date: e.target.value }))} />
            <input placeholder="Мест" type="number" onChange={e => setNewTour(p => ({ ...p, spots: parseInt(e.target.value) }))} />
            <input placeholder="Людей (people)" type="number" onChange={e => setNewTour(p => ({ ...p, people: parseInt(e.target.value) }))} />
            <input placeholder="Транспорт" onChange={e => setNewTour(p => ({ ...p, transport: e.target.value }))} />
            <input placeholder="URL картинки (https://...)" onChange={e => setNewTour(p => ({ ...p, image: e.target.value }))} />
            <select onChange={e => setNewTour(p => ({ ...p, type: e.target.value }))}>
              <option value="group">Group</option>
              <option value="eco">Eco</option>
            </select>
          </div>
          <div className="add-form-actions">
            <button className="admin-save-btn" onClick={addTour}><Save size={14} /> Сохранить</button>
            <button className="admin-cancel-btn" onClick={() => setShowAdd(false)}>Отмена</button>
          </div>
        </div>
      )}

      {loading ? <AdminSkeleton /> : (
        <div className="admin-cards">
          {filtered.map(tour => {
            const isEditing  = editingId === tour.id;
            const isExpanded = expandedId === tour.id;

            return (
              <div key={tour.id} className={`tour-list-card ${!tour.is_active ? "inactive" : ""}`}>
                {/* Заголовок строки */}
                <div className="tour-list-header">
                  {tour.image && <img src={tour.image} alt="" className="tour-list-thumb" loading="lazy" />}
                  <div className="tour-list-info">
                    <div className="tour-list-title">{getTitle(tour)}</div>
                    <div className="tour-list-meta">
                      <span className={`type-badge ${tour.type}`}>{tour.type}</span>
                      {tour.price && <span>💰 {tour.price}</span>}
                      {tour.date  && <span>📅 {tour.date}</span>}
                      {tour.spots && <span>👥 {tour.spots} мест</span>}
                      <span className={`active-badge ${tour.is_active ? "on" : "off"}`}>
                        {tour.is_active ? "Активен" : "Скрыт"}
                      </span>
                    </div>
                  </div>
                  <div className="tour-list-actions">
                    <button className="admin-edit-btn" onClick={() => isEditing ? cancelEdit() : startEdit(tour)}><Edit2 size={14} /></button>
                    <button className={`admin-toggle-btn ${tour.is_active ? "active" : "inactive"}`} onClick={() => toggleActive(tour.id, tour.is_active)} title={tour.is_active ? "Скрыть" : "Показать"}>
                      {tour.is_active ? <Check size={14} /> : <X size={14} />}
                    </button>
                    <button className="admin-delete-btn" onClick={() => deleteTour(tour.id)}><Trash2 size={14} /></button>
                    <button className="admin-expand-btn" onClick={() => setExpandedId(isExpanded ? null : tour.id)}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Раскрытая панель */}
                {isExpanded && (
                  <div className="tour-list-expand">
                    {isEditing ? (
                      <div className="tour-edit-fields">

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">Название</div>
                          <div className="tour-edit-row">
                            {["en", "ru", "hy"].map(lng => (
                              <div key={lng} className="booking-edit-field">
                                <label>{lng.toUpperCase()}</label>
                                <input value={typeof editData.title === "object" ? (editData.title?.[lng] || "") : ""} onChange={e => setEditData(p => ({ ...p, title: { ...p.title, [lng]: e.target.value } }))} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">Локация</div>
                          <div className="tour-edit-row">
                            {["en", "ru", "hy"].map(lng => (
                              <div key={lng} className="booking-edit-field">
                                <label>{lng.toUpperCase()}</label>
                                <input value={typeof editData.location === "object" ? (editData.location?.[lng] || "") : ""} onChange={e => setEditData(p => ({ ...p, location: { ...p.location, [lng]: e.target.value } }))} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">Описание</div>
                          <div className="tour-edit-row">
                            {["en", "ru", "hy"].map(lng => (
                              <div key={lng} className="booking-edit-field">
                                <label>{lng.toUpperCase()}</label>
                                <textarea rows={3} value={typeof editData.description === "object" ? (editData.description?.[lng] || "") : ""} onChange={e => setEditData(p => ({ ...p, description: { ...p.description, [lng]: e.target.value } }))} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">Основное</div>
                          <div className="tour-edit-row">
                            <div className="booking-edit-field">
                              <label>Цена</label>
                              <input value={editData.price || ""} onChange={e => setEditData(p => ({ ...p, price: e.target.value }))} />
                            </div>
                            <div className="booking-edit-field">
                              <label>Дата</label>
                              <input value={editData.date || ""} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} />
                            </div>
                            <div className="booking-edit-field">
                              <label>Длительность (hours)</label>
                              <input type="number" value={editData.duration || ""} onChange={e => setEditData(p => ({ ...p, duration: parseInt(e.target.value) }))} />
                            </div>
                            <div className="booking-edit-field">
                              <label>Мест (spots)</label>
                              <input type="number" value={editData.spots || ""} onChange={e => setEditData(p => ({ ...p, spots: parseInt(e.target.value) }))} />
                            </div>
                            <div className="booking-edit-field">
                              <label>URL картинки</label>
                              <input value={editData.image || ""} onChange={e => setEditData(p => ({ ...p, image: e.target.value }))} />
                            </div>
                            <div className="booking-edit-field">
                              <label>Тип</label>
                              <select value={editData.type || "group"} onChange={e => setEditData(p => ({ ...p, type: e.target.value }))}>
                                <option value="group">Group</option>
                                <option value="eco">Eco</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">
                            extra_details (JSON) — eco: {"{ mission: {en,ru,hy}, included: [] }"} / group: {"{ duration: '', included: [] }"}
                          </div>
                          <div className="booking-edit-field">
                            <textarea
                              rows={6}
                              value={editData.extra_details ? JSON.stringify(editData.extra_details, null, 2) : ""}
                              onChange={e => { try { setEditData(p => ({ ...p, extra_details: JSON.parse(e.target.value) })); } catch {} }}
                              style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                            />
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">itinerary (JSON массив)</div>
                          <div className="booking-edit-field">
                            <textarea
                              rows={8}
                              value={editData.itinerary ? JSON.stringify(editData.itinerary, null, 2) : ""}
                              onChange={e => { try { setEditData(p => ({ ...p, itinerary: JSON.parse(e.target.value) })); } catch {} }}
                              style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                            />
                          </div>
                        </div>

                        <div className="tour-edit-section">
                          <div className="tour-edit-section-title">gallery (JSON массив)</div>
                          <div className="booking-edit-field">
                            <textarea
                              rows={8}
                              // Используем текст из состояния
                              value={editData.gallery || ""} 
                              // Просто обновляем строку, не пытаясь её парсить мгновенно
                              onChange={e => setEditData(p => ({ ...p, gallery: e.target.value }))}
                              style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                            />
                          </div>
                        </div>

                        <div className="booking-edit-actions">
                          <button className="admin-save-btn" onClick={saveEdit}><Save size={14} /> Сохранить</button>
                          <button className="admin-cancel-btn" onClick={cancelEdit}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="tour-detail-view">
                        {tour.location && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Локация:</span>
                            <span>{typeof tour.location === "object" ? (tour.location?.ru || tour.location?.en) : tour.location}</span>
                          </div>
                        )}
                        {tour.description && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Описание:</span>
                            <span>{typeof tour.description === "object" ? (tour.description?.ru || tour.description?.en) : tour.description}</span>
                          </div>
                        )}
                        {tour.duration && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Длительность:</span>
                            <span>{tour.duration} мин</span>
                          </div>
                        )}
                        {tour.extra_details && (
                          <div className="tour-detail-row">
                            <span className="detail-label">extra_details:</span>
                            <pre className="json-preview">{JSON.stringify(tour.extra_details, null, 2)}</pre>
                          </div>
                        )}
                        {tour.itinerary && Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Маршрут:</span>
                            <div className="itinerary-preview">
                              {tour.itinerary.map((step, i) => (
                                <div key={i} className="itinerary-preview-step">
                                  <span className="step-time">{step.time}</span>
                                  <span>{typeof step.title === "object" ? (step.title?.ru || step.title?.en) : step.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {tour.gallery && Array.isArray(tour.gallery) && tour.gallery.length > 0 && (
                          <div className="tour-detail-row">
                            <span className="detail-label">gallery:</span>
                            <div className="itinerary-preview">
                              {tour.gallery.map((step, i) => (
                                <div key={i} className="itinerary-preview-step">
                                  <span className="step-time">{step.time}</span>
                                  <span>{typeof step.title === "object" ? (step.title?.ru || step.title?.en) : step.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── ТАБЛИЦА PRIVATE TOURS ────────────────────────────────────
// ── Редактор itinerary_ids ────────────────────────────────────
function ItineraryIdsEditor({ value, onChange }) {
  const ids = value || [];

  const updateId    = (i, val) => { const n = [...ids]; n[i] = val; onChange(n); };
  const addId       = ()       => onChange([...ids, ""]);
  const removeId    = (i)      => onChange(ids.filter((_, j) => j !== i));
  const moveUp      = (i)      => { if (i === 0) return; const n = [...ids]; [n[i-1], n[i]] = [n[i], n[i-1]]; onChange(n); };
  const moveDown    = (i)      => { if (i === ids.length - 1) return; const n = [...ids]; [n[i+1], n[i]] = [n[i], n[i+1]]; onChange(n); };

  return (
    <div className="visual-editor">
      <div className="visual-editor-label">📍 Места маршрута ({ids.length})</div>
      <div className="visual-editor-list">
        {ids.map((id, i) => (
          <div key={i} className="visual-editor-row">
            <span className="visual-editor-index">{i + 1}</span>
            <input
              className="visual-editor-input"
              value={id}
              placeholder="place_id"
              onChange={e => updateId(i, e.target.value)}
            />
            <div className="visual-editor-row-actions">
              <button className="ve-btn ve-move" onClick={() => moveUp(i)}   disabled={i === 0}              title="Вверх">↑</button>
              <button className="ve-btn ve-move" onClick={() => moveDown(i)} disabled={i === ids.length - 1} title="Вниз">↓</button>
              <button className="ve-btn ve-remove" onClick={() => removeId(i)} title="Удалить">✕</button>
            </div>
          </div>
        ))}
      </div>
      <button className="ve-add-btn" onClick={addId}>+ Добавить место</button>
    </div>
  );
}
// ── Редактор itinerary (многодневный) ─────────────────────────
function ItineraryEditor({ value, onChange }) {
  const days = value || [];

  const addDay = () => onChange([...days, { day: days.length + 1, ids: [] }]);

  const removeDay = (i) => onChange(
    days.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 }))
  );

  const updateId = (di, ii, val) => onChange(
    days.map((d, i) => i !== di ? d : { ...d, ids: d.ids.map((id, j) => j === ii ? val : id) })
  );

  const addId = (di) => onChange(
    days.map((d, i) => i !== di ? d : { ...d, ids: [...d.ids, ""] })
  );

  const removeId = (di, ii) => onChange(
    days.map((d, i) => i !== di ? d : { ...d, ids: d.ids.filter((_, j) => j !== ii) })
  );

  const moveId = (di, ii, dir) => onChange(
    days.map((d, i) => {
      if (i !== di) return d;
      const n = [...d.ids];
      const t = ii + dir;
      if (t < 0 || t >= n.length) return d;
      [n[t], n[ii]] = [n[ii], n[t]];
      return { ...d, ids: n };
    })
  );

  return (
    <div className="visual-editor">
      <div className="visual-editor-label">🗺 Маршрут по дням ({days.length} дн.)</div>
      {days.map((dayGroup, di) => (
        <div key={di} className="visual-editor-day">
          <div className="visual-editor-day-header">
            <span className="visual-editor-day-badge">День {dayGroup.day}</span>
            <span className="visual-editor-day-count">{dayGroup.ids.length} мест</span>
            <button className="ve-btn ve-remove" onClick={() => removeDay(di)}>✕ Удалить день</button>
          </div>
          <div className="visual-editor-list">
            {dayGroup.ids.map((id, ii) => (
              <div key={ii} className="visual-editor-row">
                <span className="visual-editor-index">{ii + 1}</span>
                <input
                  className="visual-editor-input"
                  value={id}
                  placeholder="place_id"
                  onChange={e => updateId(di, ii, e.target.value)}
                />
                <div className="visual-editor-row-actions">
                  <button className="ve-btn ve-move" onClick={() => moveId(di, ii, -1)} disabled={ii === 0}>↑</button>
                  <button className="ve-btn ve-move" onClick={() => moveId(di, ii,  1)} disabled={ii === dayGroup.ids.length - 1}>↓</button>
                  <button className="ve-btn ve-remove" onClick={() => removeId(di, ii)}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <button className="ve-add-btn ve-add-small" onClick={() => addId(di)}>+ Добавить место</button>
        </div>
      ))}
      <button className="ve-add-btn" onClick={addDay}>+ Добавить день</button>
    </div>
  );
}
// ── Редактор features ─────────────────────────────────────────
function FeaturesEditor({ value, onChange }) {
  const features = value || { include: { en: [], ru: [], hy: [] }, exclude: { en: [], ru: [], hy: [] } };
  const langs = ["en", "ru", "hy"];

  const updateItem = (section, lang, idx, val) => onChange({
    ...features,
    [section]: {
      ...features[section],
      [lang]: features[section][lang].map((item, i) => i === idx ? val : item)
    }
  });

  const addItem = (section, lang) => onChange({
    ...features,
    [section]: {
      ...features[section],
      [lang]: [...(features[section]?.[lang] || []), ""]
    }
  });

  const removeItem = (section, lang, idx) => onChange({
    ...features,
    [section]: {
      ...features[section],
      [lang]: features[section][lang].filter((_, i) => i !== idx)
    }
  });

  return (
    <div className="visual-editor">
      <div className="visual-editor-label">🎒 Features</div>

      {["include", "exclude"].map(section => (
        <div key={section} className="visual-editor-features-section">
          <div className="visual-editor-features-title">
            {section === "include" ? "✅ Включено" : "❌ Не включено"}
          </div>
          <div className="visual-editor-features-grid">
            {langs.map(lang => (
              <div key={lang} className="visual-editor-features-col">
                <div className="visual-editor-features-lang">{lang.toUpperCase()}</div>
                {(features[section]?.[lang] || []).map((item, idx) => (
                  <div key={idx} className="visual-editor-row">
                    <input
                      className="visual-editor-input"
                      value={item}
                      onChange={e => updateItem(section, lang, idx, e.target.value)}
                    />
                    <button className="ve-btn ve-remove" onClick={() => removeItem(section, lang, idx)}>✕</button>
                  </div>
                ))}
                <button className="ve-add-btn ve-add-small" onClick={() => addItem(section, lang)}>
                  + Добавить
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
// ── Главный компонент ─────────────────────────────────────────
function PrivateToursTable() {
  const [tours, setTours]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [editingId, setEditingId]   = useState(null);
  const [editData, setEditData]     = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("private_tours")
      .select("*")
      .order("id", { ascending: true });
    setTours(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getTourType = (tour) => {
    if (tour.itinerary)     return "multi";
    if (tour.itinerary_ids) return "single";
    return "unknown";
  };

  const startEdit = (tour) => {
    setEditingId(tour.id);
    setEditData({
      itinerary_ids: tour.itinerary_ids ? [...tour.itinerary_ids]                    : null,
      itinerary:     tour.itinerary     ? JSON.parse(JSON.stringify(tour.itinerary)) : null,
      features:      tour.features      ? JSON.parse(JSON.stringify(tour.features))  : null,
    });
    setExpandedId(tour.id);
  };

  const cancelEdit = () => { setEditingId(null); setExpandedId(null); };

  const saveEdit = async () => {
    const { error } = await supabase
      .from("private_tours")
      .update({
        itinerary_ids: editData.itinerary_ids,
        itinerary:     editData.itinerary,
        features:      editData.features,
      })
      .eq("id", editingId);

    if (!error) {
      setTours(prev => prev.map(t =>
        t.id === editingId ? { ...t, ...editData } : t  // 👈 editData содержит itinerary_ids, itinerary, features
      ));
      cancelEdit();
    } else {
      alert("Ошибка сохранения: " + error.message);
    }
  };

  const deleteTour = async (id) => {
    if (!window.confirm(`Удалить тур "${id}"?`)) return;
    setTours(prev => prev.filter(t => t.id !== id));
    await supabase.from("private_tours").delete().eq("id", id);
  };

  const filtered = tours.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-table-wrapper">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            placeholder="Поиск по ID тура..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "0.8rem", color: "#888", marginLeft: "auto", marginRight: "8px" }}>
          Всего: {tours.length} туров
        </div>
        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
      </div>

      {loading ? <AdminSkeleton /> : (
        <div className="admin-cards">
          {filtered.length === 0 ? (
            <div className="admin-empty">Туры не найдены</div>
          ) : filtered.map(tour => {
            const isEditing  = editingId === tour.id;
            const isExpanded = expandedId === tour.id;
            const type       = getTourType(tour);

            return (
              <div key={tour.id} className="tour-list-card">

                {/* Заголовок */}
                <div className="tour-list-header">
                  <div className="tour-list-info">
                    <div className="tour-list-title">{tour.id}</div>
                    <div className="tour-list-meta">
                      <span className={`type-badge ${type === "multi" ? "eco" : "group"}`}>
                        {type === "multi" ? "📅 Многодневный" : type === "single" ? "🗓 Однодневный" : "❓"}
                      </span>
                      {tour.itinerary_ids && <span>📍 {tour.itinerary_ids.length} мест</span>}
                      {tour.itinerary    && <span>🗺 {tour.itinerary.length} дн.</span>}
                      <span style={{ color: tour.features ? "#22c55e" : "#ef4444" }}>
                        {tour.features ? "✓ features" : "✗ features"}
                      </span>
                    </div>
                  </div>
                  <div className="tour-list-actions">
                    <button className="admin-edit-btn" onClick={() => isEditing ? cancelEdit() : startEdit(tour)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="admin-delete-btn" onClick={() => deleteTour(tour.id)}>
                      <Trash2 size={14} />
                    </button>
                    <button className="admin-expand-btn" onClick={() => setExpandedId(isExpanded ? null : tour.id)}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Раскрытая панель */}
                {isExpanded && (
                  <div className="tour-list-expand">
                    {isEditing ? (
                      <div className="tour-edit-fields">

                        {editData.itinerary_ids !== null && (
                          <ItineraryIdsEditor
                            value={editData.itinerary_ids}
                            onChange={val => setEditData(p => ({ ...p, itinerary_ids: val }))}
                          />
                        )}

                        {editData.itinerary !== null && (
                          <ItineraryEditor
                            value={editData.itinerary}
                            onChange={val => setEditData(p => ({ ...p, itinerary: val }))}
                          />
                        )}

                        <FeaturesEditor
                          value={editData.features}
                          onChange={val => setEditData(p => ({ ...p, features: val }))}
                        />

                        <div className="booking-edit-actions">
                          <button className="admin-save-btn" onClick={saveEdit}>
                            <Save size={14} /> Сохранить
                          </button>
                          <button className="admin-cancel-btn" onClick={cancelEdit}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="tour-detail-view">
                        {tour.itinerary_ids && (
                          <div className="tour-detail-row">
                            <span className="detail-label">itinerary_ids:</span>
                            <div className="itinerary-preview">
                              {tour.itinerary_ids.map((id, i) => (
                                <div key={i} className="itinerary-preview-step">
                                  <span className="step-time">{i + 1}</span>
                                  <span>{id}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {tour.itinerary && (
                          <div className="tour-detail-row">
                            <span className="detail-label">itinerary:</span>
                            <div className="itinerary-preview">
                              {tour.itinerary.map((dayGroup, i) => (
                                <div key={i} className="itinerary-preview-step">
                                  <span className="step-time">День {dayGroup.day}</span>
                                  <span>{dayGroup.ids?.join(", ")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {tour.features && (
                          <>
                            <div className="tour-detail-row">
                              <span className="detail-label">Включено (EN):</span>
                              <span>{tour.features?.include?.en?.join(", ")}</span>
                            </div>
                            <div className="tour-detail-row">
                              <span className="detail-label">Не включено (EN):</span>
                              <span>{tour.features?.exclude?.en?.join(", ")}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── ТАБЛИЦА ОТЕЛЕЙ (правильные колонки) ─────────────────────
function HotelsTable() {
  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});
  const [search, setSearch]       = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("hotels").select("*");
    setHotels(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (hotel) => { setEditingId(hotel.id); setEditData({ ...hotel }); setExpandedId(hotel.id); };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async () => {
    const { error } = await supabase.from("hotels").update(editData).eq("id", editingId);
    if (!error) {
      setHotels(prev => prev.map(h => h.id === editingId ? editData : h));
      cancelEdit();
    }
  };

  const toggleActive = async (id, current) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, is_active: !current } : h));
    await supabase.from("hotels").update({ is_active: !current }).eq("id", id);
  };

  const deleteHotel = async (id) => {
    if (!window.confirm("Удалить отель?")) return;
    setHotels(prev => prev.filter(h => h.id !== id));
    await supabase.from("hotels").delete().eq("id", id);
  };

  const filtered = hotels.filter(h =>
    (h.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (h.city || "").toLowerCase().includes(search.toLowerCase())
  );

  // Парсим массив картинок из базы
  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try { return JSON.parse(images); } catch { return []; }
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Поиск по названию, городу..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
      </div>

      {loading ? <AdminSkeleton /> : (
        <div className="admin-cards">
          {filtered.length === 0 ? (
            <div className="admin-empty">Отелей не найдено</div>
          ) : filtered.map(hotel => {
            const images    = parseImages(hotel.images);
            const isEditing  = editingId === hotel.id;
            const isExpanded = expandedId === hotel.id;

            return (
              <div key={hotel.id} className={`tour-list-card ${!hotel.is_active ? "inactive" : ""}`}>
                {/* Заголовок */}
                <div className="tour-list-header">
                  {images[0] && <img src={images[0]} alt={hotel.name} className="tour-list-thumb" loading="lazy" />}
                  <div className="tour-list-info">
                    <div className="tour-list-title">{hotel.name}</div>
                    <div className="tour-list-meta">
                      {hotel.city    && <span>📍 {hotel.city}</span>}
                      {hotel.rating  && <span>⭐ {hotel.rating}</span>}
                      {hotel.key     && <span>🔑 {hotel.key}</span>}
                      <span className={`active-badge ${hotel.is_active ? "on" : "off"}`}>
                        {hotel.is_active ? "Активен" : "Скрыт"}
                      </span>
                    </div>
                  </div>
                  <div className="tour-list-actions">
                    <button className="admin-edit-btn" onClick={() => isEditing ? cancelEdit() : startEdit(hotel)}><Edit2 size={14} /></button>
                    <button className={`admin-toggle-btn ${hotel.is_active ? "active" : "inactive"}`} onClick={() => toggleActive(hotel.id, hotel.is_active)}>
                      {hotel.is_active ? <Check size={14} /> : <X size={14} />}
                    </button>
                    <button className="admin-delete-btn" onClick={() => deleteHotel(hotel.id)}><Trash2 size={14} /></button>
                    <button className="admin-expand-btn" onClick={() => setExpandedId(isExpanded ? null : hotel.id)}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Раскрытая панель */}
                {isExpanded && (
                  <div className="tour-list-expand">
                    {isEditing ? (
                      <div className="tour-edit-fields">
                        <div className="tour-edit-row">
                          <div className="booking-edit-field">
                            <label>Название</label>
                            <input value={editData.name || ""} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div className="booking-edit-field">
                            <label>Город</label>
                            <input value={editData.city || ""} onChange={e => setEditData(p => ({ ...p, city: e.target.value }))} />
                          </div>
                          <div className="booking-edit-field">
                            <label>Рейтинг</label>
                            <input type="number" step="0.1" min="0" max="5" value={editData.rating || ""} onChange={e => setEditData(p => ({ ...p, rating: parseFloat(e.target.value) }))} />
                          </div>
                          <div className="booking-edit-field">
                            <label>Key (slug)</label>
                            <input value={editData.key || ""} onChange={e => setEditData(p => ({ ...p, key: e.target.value }))} />
                          </div>
                        </div>
                        <div className="tour-edit-row">
                          <div className="booking-edit-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Удобства (amenities) — через запятую</label>
                            <input
                              value={Array.isArray(editData.amenities) ? editData.amenities.join(", ") : (editData.amenities || "")}
                              onChange={e => setEditData(p => ({ ...p, amenities: e.target.value.split(",").map(s => s.trim()) }))}
                            />
                          </div>
                        </div>
                        <div className="tour-edit-row">
                          <div className="booking-edit-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Картинки — URL через запятую</label>
                            <textarea
                              rows={3}
                              value={Array.isArray(editData.images) ? editData.images.join(",\n") : (editData.images || "")}
                              onChange={e => setEditData(p => ({ ...p, images: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                            />
                          </div>
                        </div>
                        <div className="booking-edit-actions">
                          <button className="admin-save-btn" onClick={saveEdit}><Save size={14} /> Сохранить</button>
                          <button className="admin-cancel-btn" onClick={cancelEdit}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="tour-detail-view">
                        {/* Картинки */}
                        {images.length > 0 && (
                          <div className="hotel-images-row">
                            {images.slice(0, 4).map((src, i) => (
                              <img key={i} src={src} alt={`img-${i}`} className="hotel-thumb" loading="lazy" />
                            ))}
                            {images.length > 4 && <span className="hotel-more-imgs">+{images.length - 4}</span>}
                          </div>
                        )}
                        {hotel.amenities && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Удобства:</span>
                            <span>{Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities}</span>
                          </div>
                        )}
                        {hotel.key && (
                          <div className="tour-detail-row">
                            <span className="detail-label">Key:</span>
                            <span>{hotel.key}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── УНИВЕРСАЛЬНАЯ ТАБЛИЦА ────────────────────────────────────
function GenericTable({ table, columns, viewOnly = false }) {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});
  const [search, setSearch]       = useState("");
  const [showAllStats, setShowAllStats] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*");
    setRows(data || []);
    setLoading(false);
  }, [table]);

  useEffect(() => { load(); }, [load]);

  const saveEdit = async () => {
    const { error } = await supabase.from(table).update(editData).eq("id", editingId);
    if (!error) {
      setRows(prev => prev.map(r => r.id === editingId ? editData : r));
      setEditingId(null);
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Удалить запись?")) return;
    setRows(prev => prev.filter(r => r.id !== id));
    await supabase.from(table).delete().eq("id", id);
  };

  const filtered = rows.filter(row =>
    columns.some(col => String(row[col] ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  const formatValue = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "✅" : "❌";
    if (typeof val === "object") return JSON.stringify(val).slice(0, 50) + "...";
    const str = String(val);
    return str.length > 60 ? str.slice(0, 60) + "..." : str;
  };

  // ─── STATISTICS LOGIC ───────────────────────────────────────

  const tourStats = useMemo(() => {
    if (!rows.length) return [];

    // Считаем вхождения каждого tour_id
    const counts = rows.reduce((acc, row) => {
      const id = row.tour_id;
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    // Превращаем в массив и сортируем по убыванию
    return Object.entries(counts)
      .map(([id, count]) => ({ tourId: id, count }))
      .sort((a, b) => b.count - a.count);
  }, [rows]);

  // Определяем, сколько строк показывать
  const visibleStats = showAllStats ? tourStats : tourStats.slice(0, 4);

  return (
    <div className="admin-table-wrapper">
      {/* ─── STATS HEADER ──────────────────────────────────── */}
      {table === 'favourites' && tourStats.length > 0 && (
        <div className="stats-container">
          <div className="stats-header">
            <h3><TrendingUp size={18} /> Рейтинг популярных туров</h3>
            <span className="stats-count">Всего уникальных: {tourStats.length}</span>
          </div>

          <div className="stats-grid">
            {visibleStats.map((item, index) => (
              <div key={item.tourId} className="stat-pill">
                <span className="stat-rank">{index + 1}</span>
                <span className="stat-id">ID: {item.tourId}</span>
                <span className="stat-qty">{item.count} чел.</span>
              </div>
            ))}
          </div>

          {tourStats.length > 4 && (
            <button 
              className="stats-expand-btn" 
              onClick={() => setShowAllStats(!showAllStats)}
            >
              {showAllStats ? "Скрыть" : `Показать еще ${tourStats.length - 4}`}
            </button>
          )}
        </div>
      )}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
      </div>
        <div className="table-count-badge">
          {filtered.length} {filtered.length !== rows.length ? `из ${rows.length}` : 'записей'}
        </div>

      {loading ? <AdminSkeleton /> : (
        <div className="generic-table-scroll">
          <table className="generic-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col}>{col}</th>)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  {columns.map(col => (
                    <td key={col}>
                      {editingId === row.id && !viewOnly ? (
                        <input className="table-edit-input" value={editData[col] ?? ""} onChange={e => setEditData(p => ({ ...p, [col]: e.target.value }))} />
                      ) : (
                        <span className="table-cell-value">{formatValue(row[col])}</span>
                      )}
                    </td>
                  ))}
                  <td>
                    {editingId === row.id ? (
                      <div className="table-actions">
                        <button className="admin-save-btn small" onClick={saveEdit}><Check size={12} /></button>
                        <button className="admin-cancel-btn small" onClick={() => setEditingId(null)}><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        {!viewOnly && (
                          <button className="admin-edit-btn" onClick={() => { setEditingId(row.id); setEditData({ ...row }); }}><Edit2 size={14} /></button>
                        )}
                        <button className="admin-delete-btn" onClick={() => deleteRow(row.id)}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="admin-empty">Записей не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


// ─── СКЕЛЕТОН ────────────────────────────────────────────────
function AdminSkeleton() {
  return (
    <div className="admin-skeleton">
      {[1, 2, 3].map(i => (
        <div key={i} className="admin-skeleton-row">
          <div className="skeleton-block pulse" style={{ width: "30%" }} />
          <div className="skeleton-block pulse" style={{ width: "20%" }} />
          <div className="skeleton-block pulse" style={{ width: "15%" }} />
        </div>
      ))}
    </div>
  );
}

// ─── КОНСТАНТЫ ───────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "EN us" },
  { code: "ru", label: "RU 🇷🇺" },
  { code: "hy", label: "HY 🇦🇲" },
];
 
const TEXT_FIELDS = [
  { key: "header",       label: "Заголовок",       rows: 1 },
  { key: "content",      label: "Краткое описание", rows: 3 },
  { key: "full_content", label: "Полное описание",  rows: 6 },
];
 
const EMPTY_MULTILANG = { en: "", ru: "", hy: "" };
 
const emptyLocation = () => ({
  place_id:     "",
  header:       { ...EMPTY_MULTILANG },
  content:      { ...EMPTY_MULTILANG },
  full_content: { ...EMPTY_MULTILANG },
  images:       [],
});
 
// ─── ДАННЫЕ МЕСТ sights ───────────────────────────────────────
function LocationsLibrary() {
  const [locations, setLocations]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [editingId, setEditingId]   = useState(null); // place_id или "NEW"
  const [editData, setEditData]     = useState(null);
  const [activeLang, setActiveLang] = useState("en");
  const [expanded, setExpanded]     = useState(null);
  const [newImage, setNewImage]     = useState("");
 
  // ─── ЗАГРУЗКА ────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("locations_library")
      .select("*")
      .order("place_id");
    setLocations(data || []);
    setLoading(false);
  }, []);
 
  useEffect(() => { load(); }, [load]);
 
  // ─── ПОИСК ───────────────────────────────────────────────
  const filtered = locations.filter(loc => {
    const q = search.toLowerCase();
    return (
      loc.place_id?.toLowerCase().includes(q) ||
      loc.header?.en?.toLowerCase().includes(q) ||
      loc.header?.ru?.toLowerCase().includes(q) ||
      loc.header?.hy?.toLowerCase().includes(q)
    );
  });
 
  // ─── РЕДАКТИРОВАНИЕ ──────────────────────────────────────
  const startEdit = (loc) => {
    setEditData({
      place_id:     loc.place_id,
      header:       { ...EMPTY_MULTILANG, ...loc.header },
      content:      { ...EMPTY_MULTILANG, ...loc.content },
      full_content: { ...EMPTY_MULTILANG, ...loc.full_content },
      images:       loc.images || [],
    });
    setEditingId(loc.place_id);
    setActiveLang("en");
    setNewImage("");
  };
 
  const startCreate = () => {
    setEditData(emptyLocation());
    setEditingId("NEW");
    setActiveLang("en");
    setNewImage("");
  };
 
  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };
 
  // Обновить мультиязычное поле
  const setField = (fieldKey, lang, value) => {
    setEditData(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], [lang]: value },
    }));
  };
 
  // ─── СОХРАНЕНИЕ ──────────────────────────────────────────
  const save = async () => {
    if (!editData.place_id.trim()) return alert("place_id не может быть пустым");
 
    const payload = {
      place_id:     editData.place_id.trim(),
      header:       editData.header,
      content:      editData.content,
      full_content: editData.full_content,
      images:       editData.images,
    };
 
    if (editingId === "NEW") {
      const { error } = await supabase.from("locations_library").insert(payload);
      if (error) return alert("Ошибка: " + error.message);
    } else {
      const { error } = await supabase
        .from("locations_library")
        .update(payload)
        .eq("place_id", editingId);
      if (error) return alert("Ошибка: " + error.message);
    }
 
    await load();
    cancelEdit();
  };
 
  // ─── УДАЛЕНИЕ ────────────────────────────────────────────
  const remove = async (place_id) => {
    if (!window.confirm(`Удалить "${place_id}"?`)) return;
    await supabase.from("locations_library").delete().eq("place_id", place_id);
    setLocations(prev => prev.filter(l => l.place_id !== place_id));
  };
 
  // ─── ИЗОБРАЖЕНИЯ ─────────────────────────────────────────
  const addImage = () => {
    const url = newImage.trim();
    if (!url) return;
    setEditData(prev => ({ ...prev, images: [...prev.images, url] }));
    setNewImage("");
  };
 
  const removeImage = (idx) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };
 
  // ─── РЕНДЕР ФОРМЫ РЕДАКТИРОВАНИЯ ─────────────────────────
  const renderEditForm = () => (
    <div className="loc-edit-form">
      {/* place_id */}
      <div className="loc-field-row">
        <label className="loc-field-label">place_id</label>
        <input
          className="loc-input"
          value={editData.place_id}
          disabled={editingId !== "NEW"}
          onChange={e => setEditData(prev => ({ ...prev, place_id: e.target.value }))}
          placeholder="например: etchmiadzin"
        />
      </div>
 
      {/* Языковые табы */}
      <div className="loc-lang-tabs">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            className={`loc-lang-tab ${activeLang === lang.code ? "active" : ""}`}
            onClick={() => setActiveLang(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
 
      {/* Текстовые поля для активного языка */}
      {TEXT_FIELDS.map(field => {
        const currentValue = editData[field.key][activeLang] || "";
        const wordCount = field.key === "full_content"
          ? currentValue.trim() === "" ? 0 : currentValue.trim().split(/\s+/).length
          : null;

        return (
          <div key={field.key} className="loc-field-row">
            <label className="loc-field-label">
              {field.label}
              <span className="loc-lang-badge">{activeLang.toUpperCase()}</span>
              {wordCount !== null && (
                <>
                <span style={{
                  marginLeft: 8,
                  fontSize: 11,
                  color: wordCount > 200 ? "#e74c3c" : "#888",
                  fontWeight: "normal",
                }}>
                  {wordCount} слов 
                </span>
                <p className="small mb-0">maximum-150!</p>
                </>
              )}
            </label>
            <textarea
              className="loc-textarea"
              rows={field.rows}
              value={currentValue}
              onChange={e => setField(field.key, activeLang, e.target.value)}
              placeholder={`${field.label} (${activeLang})`}
            />
          </div>
        );
      })}
 
      {/* Изображения */}
      <div className="loc-field-row">
        <label className="loc-field-label">
          <Image size={14} style={{ marginRight: 4 }} />
          Изображения (Cloudinary пути)
        </label>
 
        <div className="loc-images-list">
          {editData.images.map((img, idx) => (
            <div key={idx} className="loc-image-item">
              <span className="loc-image-path">{img}</span>
              <button className="loc-image-remove" onClick={() => removeImage(idx)}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
 
        <div className="loc-image-add-row">
          <input
            className="loc-input"
            value={newImage}
            onChange={e => setNewImage(e.target.value)}
            placeholder="regions/armavir/etchmiadzin/etchmiadzin_1"
            onKeyDown={e => e.key === "Enter" && addImage()}
          />
          <button className="loc-add-img-btn" onClick={addImage}>
            <Plus size={14} /> Добавить
          </button>
        </div>
      </div>
 
      {/* Кнопки */}
      <div className="loc-edit-actions">
        <button className="admin-save-btn" onClick={save}>
          <Save size={14} /> Сохранить
        </button>
        <button className="admin-cancel-btn" onClick={cancelEdit}>
          Отмена
        </button>
      </div>
    </div>
  );
 
  // ─── РЕНДЕР КАРТОЧКИ ─────────────────────────────────────
  const renderCard = (loc) => {
    const isExpanded = expanded === loc.place_id;
    const isEditing  = editingId === loc.place_id;
 
    return (
      <div key={loc.place_id} className="loc-card">
        <div className="loc-card-header">
          <div className="loc-card-info">
            <span className="loc-place-id">{loc.place_id}</span>
            <span className="loc-place-name">
              {loc.header?.hy || loc.header?.ru || "—"}
            </span>
            {loc.images?.length > 0 && (
              <span className="loc-img-count">
                <Image size={12} /> {loc.images.length}
              </span>
            )}
          </div>
          <div className="loc-card-actions">
            <button
              className="admin-edit-btn"
              onClick={() => isEditing ? cancelEdit() : startEdit(loc)}
            >
              <Edit2 size={14} />
            </button>
            <button
              className="loc-expand-btn"
              onClick={() => setExpanded(isExpanded ? null : loc.place_id)}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button className="admin-delete-btn" onClick={() => remove(loc.place_id)}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
 
        {/* Превью при раскрытии */}
        {isExpanded && !isEditing && (
          <div className="loc-preview">
            
            <div className="loc-preview-images" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {loc.images?.map((imgUrl, index) => (
                <img 
                  key={index} 
                  src={imgUrl} 
                  alt={`${loc.place_id}-${index}`} 
                  style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "4px" }} 
                />
              ))}
            </div>
            <div className="loc-preview-langs">
              {LANGUAGES.map(lang => (
                <div key={lang.code} className="loc-preview-lang-block">
                  <div className="loc-preview-lang-title">{lang.label}</div>
                  <div className="loc-preview-field">
                    <span className="loc-preview-key">Header:</span>
                    <span>{loc.header?.[lang.code] || "—"}</span>
                  </div>
                </div>
              ))}
            </div>
            {loc.images?.length > 0 && (
              <div className="loc-preview-images">
                {loc.images.map((img, i) => (
                  <span key={i} className="loc-image-path">{img}</span>
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* Форма редактирования */}
        {isEditing && renderEditForm()}
      </div>
    );
  };
 
  // ─── ОСНОВНОЙ РЕНДЕР ─────────────────────────────────────
  return (
    <div className="admin-table-wrapper">
      {/* Добавляем этот блок */}
      <div className="admin-main-header">
        <p className="admin-subtitle">
          Всего записей: <strong>{locations.length}</strong>
          {search && ` (найдено: ${filtered.length})`}
        </p>
      </div>
      
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            placeholder="Поиск по place_id или названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="admin-refresh-btn" onClick={load}>
          <RefreshCw size={16} />
        </button>
        <button className="loc-create-btn" onClick={startCreate}>
          <Plus size={16} /> Новое место
        </button>
      </div>
 
      {/* Форма создания нового */}
      {editingId === "NEW" && (
        <div className="loc-card loc-card-new">
          <div className="loc-card-header">
            <span className="loc-place-id">Новое место</span>
          </div>
          {renderEditForm()}
        </div>
      )}
 
      {loading ? (
        <div className="admin-empty">Загрузка...</div>
      ) : (
        <div className="admin-cards">
          {filtered.length === 0 ? (
            <div className="admin-empty">Ничего не найдено</div>
          ) : (
            filtered.map(renderCard)
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;