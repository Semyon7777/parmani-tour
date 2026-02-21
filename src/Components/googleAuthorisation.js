import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Reg from './firebase-config'; // импортируйте вашу конфигурацию Firebase
import './registration.css'; // Импортируйте ваш CSS файл с вышеуказанными стилями

class GoogleAuthorisation extends React.Component {
  handleGoogleSignIn = () => {
    const auth = getAuth(Reg);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user); // Здесь вы можете обработать данные пользователя
      })
      .catch((error) => {
        console.error("Ошибка авторизации: ", error);
      });
  };

  render() {
    return (
      <div>
        <button className="login-with-google-btn" onClick={this.handleGoogleSignIn}>Sign in with Google</button>
      </div>
    );
  }
}

export default GoogleAuthorisation;
