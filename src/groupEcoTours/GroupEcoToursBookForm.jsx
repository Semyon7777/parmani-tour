import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ReactMarkdown from "react-markdown";
import termsContent from "../terms";
import {
  X, User, Mail, Phone, Users, MessageSquare,
  CheckCircle, Loader, Calendar, MapPin, LogIn
} from "lucide-react";
import "./GroupEcoToursBookForm.css";

function GroupEcoToursBookForm({ tour, isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  const [step, setStep]       = useState(1); // 1=форма, 2=успех
  const [loading, setLoading] = useState(true); // пока проверяем авторизацию
  const [authUser, setAuthUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen]         = useState(false);

  const [form, setForm] = useState({
    full_name:    "",
    email:        "",
    phone:        "",
    guests_count: 1,
    comment:      "",
  });

  // ── Проверяем авторизацию при открытии ──────────────────────
  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setError("");
    setTermsAccepted(false);
    setTermsOpen(false);
    setForm({ full_name: "", email: "", phone: "", guests_count: 1, comment: "" });

    const checkAuth = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user || null);

      // Если авторизован — подставляем данные из профиля
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        setForm(prev => ({
          ...prev,
          full_name: profile?.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
        }));
      }
      setLoading(false);
    };

    checkAuth();
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Логика авто-перехода
  const handleFinalRedirect = useCallback(() => {
    if (onClose) onClose();
    navigate("/group-eco-tours");
  }, [onClose, navigate]); // Эти зависимости стабильны

  useEffect(() => {
    let timer;
    if (step === 2) {
      timer = setTimeout(() => {
        handleFinalRedirect();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [step, handleFinalRedirect]); // Теперь варнинга не будет


  // useEffect(() => {
  //   document.body.style.overflow = isOpen ? "hidden" : "";
  //   return () => { document.body.style.overflow = ""; };
  // }, [isOpen]);

  // Блокируем скролл страницы
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [isOpen]);

  if (!isOpen || !tour) return null;

  // ── Вспомогательные данные о туре ───────────────────────────
  const tourTitle = typeof tour.title === "object"
    ? (tour.title[lang] || tour.title.en || tour.title.ru)
    : tour.title;

  const tourLocation = typeof tour.location === "object"
    ? (tour.location[lang] || tour.location.en)
    : tour.location;

  // Парсим цену за человека из строки типа "5000 AMD"
  const pricePerPerson = parseInt((tour.price || "").toString().replace(/\D/g, "")) || 0;
  const currency = (tour.price || "").replace(/[\d\s]/g, "").trim() || "AMD";
  const totalPrice = pricePerPerson > 0
    ? `${(pricePerPerson * parseInt(form.guests_count || 1)).toLocaleString()} ${currency}`
    : tour.price;

  // Максимум мест = сколько осталось (или 20 если не указано)
  const maxSpots = tour.spots ? parseInt(tour.spots) : 20;

  // ── Обработчики ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.full_name.trim())
      return t("group_booking.error_name", "Введите имя");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return t("group_booking.error_email", "Введите корректный email");
    if (!form.phone.trim())
      return t("group_booking.error_phone", "Введите телефон");

    // ПРОВЕРКА НА 0 И ДОСТУПНОСТЬ МЕСТ
    const guests = parseInt(form.guests_count);
    if (maxSpots <= 0) {
      return t("group_booking.no_spots", "К сожалению, мест больше нет");
    }
    if (!guests || guests < 1 || guests > maxSpots) {
      return t("group_booking.error_guests", `Доступно мест: ${maxSpots}`);
    }

    if (!termsAccepted)
      return t("group_booking.error_terms", "Необходимо принять условия использования");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setSubmitting(true);
    setError("");

    try {
      const guestsToBook = parseInt(form.guests_count);

      // 1. Создаем бронирование в таблице bookings
      const { error: dbError } = await supabase.from("bookings").insert([{
        user_id:      authUser?.id || null,
        tour_id:      tour.id,
        tour_name:    tourTitle,
        full_name:    form.full_name.trim(),
        email:        form.email.trim(),
        phone:        form.phone.trim(),
        guests_count: guestsToBook,
        comment:      form.comment.trim() || null,
        location:     tourLocation || null,
        travel_date: tour.date ? tour.date.split(".").reverse().join("-") : null,
        total_price:  totalPrice,
        status:       "pending",
      }]);

      if (dbError) throw dbError;

      // 2. Уменьшаем количество мест в таблице туров
      // ВАЖНО: убедись, что таблица называется правильно (например, 'group_tours' или 'tours')
      const newSpotsCount = maxSpots - guestsToBook;

      const { error: updateError } = await supabase
        .from("group_eco_tours") // ПРОВЕРЬ ИМЯ ТАБЛИЦЫ ТУТ
        .update({ spots: newSpotsCount })
        .eq("id", tour.id);

      if (updateError) {
        console.error("Ошибка при обновлении мест:", updateError);
        // Мы не прерываем процесс, так как бронь уже создана, 
        // но лучше залогировать это для админа.
      }
      
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(t("group_booking.error_server", "Ошибка при отправке. Попробуйте ещё раз."));
    } finally {
      setSubmitting(false);
    }
    
  };

  // ── Рендер ──────────────────────────────────────────────────
  return (
    <div className="gbm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="gbm-modal">

        <button className="gbm-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Шапка с инфо о туре — всегда видна */}
        <div className="gbm-header">
          {tour.image && (
            <div className="gbm-tour-img" style={{ backgroundImage: `url(${tour.image})` }} />
          )}
          <div className="gbm-header-info">
            <span className={`gbm-type-badge ${tour.type}`}>
              {tour.type === "eco"
                ? t("group_eco_tours.badge_eco", "Eco")
                : t("group_eco_tours.badge_group", "Group")}
            </span>
            <h2 className="gbm-tour-title">{tourTitle}</h2>
            <div className="gbm-tour-meta">
              {tour.date     && <span><Calendar size={13} /> {tour.date}</span>}
              {tourLocation  && <span><MapPin size={13} /> {tourLocation}</span>}
              {tour.price    && <span className="gbm-price">{tour.price} AMD/ {t("group_eco_tours.per_person", "per person")}</span>}
              {tour.spots    && (
                <span className="gbm-spots">
                  {tour.spots} {t("group_eco_tours.spots_left", "мест")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Спиннер пока проверяем авторизацию */}
        {loading ? (
          <div className="gbm-loading">
            <Loader size={28} className="gbm-spinner" />
          </div>
        ) : !authUser ? (
          /* ── Не авторизован ── */
          <div className="gbm-auth-wall">
            <div className="gbm-auth-icon"><LogIn size={40} /></div>
            <h3>{t("group_booking.login_required", "Войдите чтобы забронировать")}</h3>
            <p>{t("group_booking.login_text", "Для бронирования тура необходима авторизация")}</p>
            <button
              className="gbm-submit"
              onClick={() => { onClose(); navigate("/login"); }}
            >
              {t("group_booking.go_login", "Войти или зарегистрироваться")}
            </button>
            <button className="gbm-link" onClick={onClose}>
              {t("group_booking.cancel", "Отмена")}
            </button>
          </div>
        ) : step === 1 ? (
          /* ── Форма ── */
          <form className="gbm-form" onSubmit={handleSubmit} noValidate>
            <div className="gbm-form-title">
              {t("group_booking.form_title", "Ваши данные")}
            </div>

            <div className="gbm-fields">
              <div className="gbm-field">
                <label>{t("group_booking.name", "Имя и фамилия")} <span>*</span></label>
                <div className="gbm-input-wrapper">
                  <User size={15} className="gbm-input-icon" />
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder={t("group_booking.name_placeholder", "Иван Иванов")}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="gbm-field">
                <label>{t("group_booking.email", "Email")} <span>*</span></label>
                <div className="gbm-input-wrapper">
                  <Mail size={15} className="gbm-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="gbm-field">
                <label>{t("group_booking.phone", "Телефон")} <span>*</span></label>
                <div className="gbm-input-wrapper">
                  <Phone size={15} className="gbm-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+374 XX XXX XXX"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Количество участников с динамической ценой */}
              <div className="gbm-field">
                <label>{t("group_booking.guests", "Участников")} <span>*</span></label>
                <div className="gbm-input-wrapper">
                  <Users size={15} className="gbm-input-icon" />
                  <input
                    type="number"
                    name="guests_count"
                    value={form.guests_count}
                    onChange={handleChange}
                    min="1"
                    max={maxSpots}
                  />
                </div>
                {tour.spots && (
                  <span className="gbm-spots-hint">
                    {t("group_booking.max_spots", "Макс.")} {maxSpots} {t("group_eco_tours.spots_left", "мест")}
                  </span>
                )}
              </div>

              <div className="gbm-field gbm-field-full">
                <label>{t("group_booking.comment", "Комментарий")}</label>
                <div className="gbm-input-wrapper gbm-textarea-wrapper">
                  <MessageSquare size={15} className="gbm-input-icon gbm-input-icon-top" />
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder={t("group_booking.comment_placeholder", "Дополнительные пожелания...")}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Итоговая цена */}
            {pricePerPerson > 0 && (
              <div className="gbm-price-summary">
                <span>{form.guests_count} × {tour.price}</span>
                <span className="gbm-total">{totalPrice}</span>
              </div>
            )}

            {/* Чекбокс условий */}
            <label className="gbm-terms-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => { setTermsAccepted(e.target.checked); setError(""); }}
              />
              <span>
                {t("group_booking.terms_agree", "Я согласен с")}{" "}
                <button
                  type="button"
                  className="gbm-terms-link"
                  onClick={() => setTermsOpen(true)}
                >
                  {t("group_booking.terms_link", "условиями использования")}
                </button>
              </span>
            </label>

            {error && <div className="gbm-error">{error}</div>}

            <button 
              type="submit" 
              className="gbm-submit" 
              disabled={submitting || maxSpots <= 0} // Блокируем, если отправка ИЛИ нет мест
            >
              {submitting
                ? <><Loader size={16} className="gbm-spinner" /> {t("group_booking.sending", "Отправляем...")}</>
                : maxSpots <= 0 
                  ? t("group_booking.sold_out", "Мест нет") // Текст, если всё раскуплено
                  : t("group_booking.submit", "Записаться на тур")
              }
            </button>

            <p className="gbm-note">
              {t("group_booking.note", "Мы свяжемся с вами в течение 24 часов")}
            </p>
          </form>
        ) : (
          /* ── Успех ── */
          <div className="gbm-success">
            <div className="gbm-success-icon">
              <CheckCircle size={52} />
            </div>
            <h3>{t("group_booking.success_title", "Заявка отправлена!")}</h3>
            <p>{t("group_booking.success_text", "Мы получили вашу заявку и скоро свяжемся с вами.")}</p>
            
            <div className="gbm-success-tour">{tourTitle}</div>
            
            {pricePerPerson > 0 && (
              <div className="gbm-success-price">
                {form.guests_count} {t("group_booking.people_short", "чел.")} · {totalPrice}
              </div>
            )}

            {/* Кнопка теперь вызывает нашу функцию с редиректом */}
            <button className="gbm-submit" onClick={handleFinalRedirect}>
              {t("group_booking.success_close", "Отлично, спасибо!")}
            </button>
          </div>
        )}
      </div>

      {/* ── Вложенный модал с условиями ── */}
      {termsOpen && (
        <div className="gbm-terms-overlay" onClick={e => e.target === e.currentTarget && setTermsOpen(false)}>
          <div className="gbm-terms-modal">
            <div className="gbm-terms-header">
              <h4>{t("group_booking.terms_title", "Условия использования")}</h4>
              <button className="gbm-close" onClick={() => setTermsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="gbm-terms-body">
              <ReactMarkdown>{termsContent[i18n.language] || termsContent.en}</ReactMarkdown>
            </div>
            <div className="gbm-terms-footer">
              <button
                className="gbm-submit"
                onClick={() => { setTermsAccepted(true); setTermsOpen(false); }}
              >
                {t("group_booking.terms_accept", "Принять и закрыть")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupEcoToursBookForm;