import { useState } from "react";
import Icon from "../common/Icon";
import Button from "../common/Button";
import api from "../../services/api";

const LoginForm = ({ onSubmit, onForgotPassword, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setLoading(false);
      console.log("Connexion réussie, données :", response.data);
      if (onSubmit) {
        console.log("Appel de onSubmit");
        onSubmit({
          name: response.data.name,
          role: response.data.role,
          email: response.data.email,
        });
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon name="medical_services" size={32} color="white" filled />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Sanctuary Health
        </h1>
        <p className="text-sm text-gray-500 mt-1">Precision Care Portal</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <Icon name="error" size={20} color="#ba1a1a" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="mail" size={20} /></span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="lock" size={20} /></span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 outline-none transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <span className="text-xs text-gray-500 group-hover:text-gray-700">Remember me</span>
          </label>
          <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-teal-600 hover:text-teal-700">
            Forgot Password?
          </button>
        </div>

        <Button
  type="submit"   // ← ajoute cette ligne
  label={loading ? "Connexion..." : "Se connecter"}
  variant="primary"
  className="w-full py-3 text-base"
  icon={loading ? null : "login"}
/>
       

        
      </form>
    </div>
  );
};

export default LoginForm;