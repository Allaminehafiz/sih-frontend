import { useState } from "react";
import LoginForm from "../components/auth/LoginFrom";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import RegisterPage from "./RegisterPage";

const LoginPage = ({ onLoginSuccess }) => {
  const [showForgot, setShowForgot] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  if (showForgot) {
    return <ForgotPasswordForm onBackToLogin={() => setShowForgot(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Partie gauche (décorative) */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900"></div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Precision Care Platform
          </h2>
          <p className="text-teal-100 text-lg max-w-md">
            Gérez efficacement les processus médicaux.
          </p>
        </div>
      </div>

      {/* Partie droite : formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm
          onSubmit={onLoginSuccess}         // ← c’est ici que tout se joue
          onForgotPassword={() => setShowForgot(true)}
        />
      </div>
    </div>
  );
};

export default LoginPage;