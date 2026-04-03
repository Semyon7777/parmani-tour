import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { Html5Qrcode } from "html5-qrcode";
import { XCircle, CheckCircle, QrCode, Loader } from "lucide-react";
import "./qrScanner.css";



function QrScannerComponent() {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { status: 'found'|'not_found'|'error', data }
  const [loading, setLoading] = useState(false);

  // Запускаем камеру
  // 1. Кнопка теперь только включает режим сканирования
  const startScanner = () => {
    setResult(null);
    setScanning(true);
  };

  // 2. А этот код сам запустит камеру, как только появится div
  useEffect(() => {
    let html5QrCode = null;

    if (scanning) {
      // Даем 300мс, чтобы React отрисовал интерфейс
      const timer = setTimeout(async () => {
        try {
          const element = document.getElementById("qr-reader");
          if (!element) return;

          html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => handleScan(decodedText, html5QrCode),
            () => {} 
          );
        } catch (err) {
          alert("Ошибка: " + err);
          setScanning(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [scanning]);

  // Останавливаем камеру
  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // Обрабатываем отсканированный QR
  const handleScan = async (text, scanner) => {
    // 1. Останавливаем камеру сразу
    try {
      if (scanner && scanner.getState() === 2) {
        await scanner.stop();
      }
    } catch (e) {
      console.warn("Scanner stop error", e);
    }

    setScanning(false);
    setLoading(true);

    // 2. Извлекаем ID из ссылки (https://parmanitour.com/verify/UUID)
    const match = text.match(/verify\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);

    if (!match) {
      setResult({ status: "error", message: "Неверный формат QR-кода" });
      setLoading(false);
      return;
    }

    const bookingId = match[1];

    // 3. Запрос к Supabase
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, tour_name, full_name, status, checked_in, guests_count")
      .eq("id", bookingId)
      .maybeSingle();

    if (error || !booking) {
      setResult({ status: "not_found", message: "Билет не найден в системе" });
      setLoading(false);
      return;
    }

    // 4. ПРОВЕРКА: Использован ли билет?
    if (booking.checked_in === true) {
      setResult({ 
        status: "error", 
        message: "Билет уже был использован!", 
        data: booking // Передаем данные, чтобы гид видел, КТО уже прошел
      });
      setLoading(false);
      return;
    }

    // 5. Если всё хорошо — отмечаем приход
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ 
        checked_in: true, 
        scanned_at: new Date().toISOString() 
      })
      .eq("id", bookingId)
      .select();

    setLoading(false);

    if (updateError) {
      setResult({ status: "error", message: "Ошибка при регистрации билета" });
    } else {
      setResult({ status: "found", data: booking });
    }
  };

  // Чистим при размонтировании
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
    <div className="qr-scanner-root">
      <div className="qr-scanner-card">

        {/* Заголовок */}
        <div className="qr-scanner-header">
          <QrCode size={24} />
          <h3>Сканер билетов</h3>
        </div>

        {/* Камера */}
        {scanning && (
          <div className="qr-video-wrapper">
            <div id="qr-reader" style={{ width: "100%" }} />
            <button className="qr-stop-btn" onClick={stopScanner}>
              Отменить
            </button>
          </div>
        )}

        {/* Кнопка старта */}
        {!scanning && !loading && (
          <button className="qr-start-btn" onClick={startScanner}>
            <QrCode size={20} />
            Сканировать QR
          </button>
        )}

        {/* Загрузка */}
        {loading && (
          <div className="qr-loading">
            <Loader size={32} className="qr-spin" />
            <p>Проверяем билет...</p>
          </div>
        )}

        {/* Результат */}
        {result && !loading && (
          <div className={`qr-result qr-result--${result.status}`}>
            {result.status === "found" ? (
              <>
                <CheckCircle size={48} className="qr-result-icon" />
                <h4>Билет действителен</h4>
                <div className="qr-result-info">
                  <div className="qr-result-row">
                    <span>Тур</span>
                    <strong>{result.data.tour_name}</strong>
                  </div>
                  <div className="qr-result-row">
                    <span>Гость</span>
                    <strong>{result.data.full_name}</strong>
                  </div>
                  <div className="qr-result-row">
                    <span>Дата</span>
                    <strong>{result.data.travel_date || "—"}</strong>
                  </div>
                  <div className="qr-result-row">
                    <span>Гостей</span>
                    <strong>{result.data.guests_count}</strong>
                  </div>
                  <div className={`qr-status-badge qr-status--${result.data.status}`}>
                    {result.data.status === "confirmed" ? "✓ Подтверждено"
                      : result.data.status === "pending" ? "⏳ В обработке"
                      : "✗ Отменено"}
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle size={48} className="qr-result-icon" />
                <h4>{result.message}</h4>
              </>
            )}

            {/* Сканировать снова */}
            <button className="qr-start-btn qr-retry-btn" onClick={startScanner}>
              Сканировать ещё
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default QrScannerComponent;