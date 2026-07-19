import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import api from "../../services/api";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon name="medical_services" size={32} color="white" filled />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Sanctuary Health
        </h1>
        <p className="text-sm text-gray-500 mt-1">Precision Care Portal</p>
      </div>

      {!sent ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <Icon name="error" size={20} color="#ba1a1a" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="mail" size={20} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? "Sending..." : "Send Reset Link"}
              variant="primary"
              className="w-full py-3 text-base"
              icon={loading ? null : "send"}
            />
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mx-auto"
            >
              <Icon name="arrow_back" size={16} />
              Back to Sign In
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="mark_email_read" size={40} color="#005e53" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Check Your Email
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            We've sent a password reset link to <span className="font-bold text-teal-600">{email}</span>
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;