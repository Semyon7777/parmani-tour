import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { 
  Users, Calendar, Heart, Hotel, Globe, LogOut, 
  Trash2, Edit2, Check, X, Plus, RefreshCw, 
  Search, Save, ChevronDown, ChevronUp
} from "lucide-react";
import "./AdminPage.css";

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────
function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [adminUser, setAdminUser] = useState(null);

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
    { id: "group_eco_tours", label: "Туры",          icon: <Globe size={18} /> },
    { id: "profiles",        label: "Пользователи", icon: <Users size={18} /> },
    { id: "hotels",          label: "Отели",         icon: <Hotel size={18} /> },
    { id: "favourites",      label: "Избранное",     icon: <Heart size={18} /> },
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

        {activeTab === "bookings"        && <BookingsTable />}
        {activeTab === "group_eco_tours" && <ToursTable />}
        {activeTab === "profiles"        && <GenericTable table="profiles"   columns={["full_name", "email", "is_admin"]} />}
        {activeTab === "hotels"          && <HotelsTable />}
        {activeTab === "favourites"      && <GenericTable table="favourites" columns={["user_id", "tour_id"]} viewOnly />}
      </main>
    </div>
  );
}


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
    const { error } = await supabase.from("bookings").update(updateData).eq("id", editingId);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === editingId ? { ...b, ...updateData } : b));
      setEditingId(null);
    }
  };

  const quickStatus = async (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) load();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Удалить бронирование?")) return;
    setBookings(prev => prev.filter(b => b.id !== id));
    await supabase.from("bookings").delete().eq("id", id);
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

  const startEdit = (tour) => { setEditingId(tour.id); setEditData({ ...tour }); setExpandedId(tour.id); };
  const cancelEdit = () => { setEditingId(null); setExpandedId(null); };

  const saveEdit = async () => {
    const { error } = await supabase.from("group_eco_tours").update(editData).eq("id", editingId);
    if (!error) {
      setTours(prev => prev.map(t => t.id === editingId ? editData : t));
      cancelEdit();
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
            <input placeholder="Цена (напр: 15000 AMD)" onChange={e => setNewTour(p => ({ ...p, price: e.target.value }))} />
            <input placeholder="Дата" onChange={e => setNewTour(p => ({ ...p, date: e.target.value }))} />
            <input placeholder="Мест" type="number" onChange={e => setNewTour(p => ({ ...p, spots: parseInt(e.target.value) }))} />
            <input placeholder="Людей (people)" type="number" onChange={e => setNewTour(p => ({ ...p, people: parseInt(e.target.value) }))} />
            <input placeholder="Транспорт" onChange={e => setNewTour(p => ({ ...p, transport: e.target.value }))} />
            <input placeholder="URL картинки" onChange={e => setNewTour(p => ({ ...p, image: e.target.value }))} />
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
                              <label>Длительность (мин)</label>
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

  return (
    <div className="admin-table-wrapper">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="admin-refresh-btn" onClick={load}><RefreshCw size={16} /></button>
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

export default AdminPage;