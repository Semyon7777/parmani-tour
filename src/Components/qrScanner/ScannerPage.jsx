import React, { useState } from "react";
import QrScannerComponent from "./QrScannerComponent"; // Твой готовый сканер

const SecretScannerPage = () => {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const MASTER_PASS = process.env.REACT_APP_SCANNER_PASS; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === MASTER_PASS) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Неверный код доступа");
    }
  };

  if (isAuthenticated) {
    return <QrScannerComponent />;
  }

  return (
    <div className="scanner-login-container" style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Parmani Check-in</h2>
      <p>Введите код доступа для запуска сканера</p>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Код доступа"
          style={{ padding: '10px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <br />
        <button type="submit" className="gbm-submit" style={{ marginTop: '20px' }}>
          Войти
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default SecretScannerPage;